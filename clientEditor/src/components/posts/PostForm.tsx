import * as yup from 'yup';
import { FieldErrors, UseFormSetError, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import { Editor } from '@tinymce/tinymce-react';
import DOMPurify from 'dompurify';

import { IPost } from '../../types/types';
import { useRef } from 'react';
import styles from './PostForm.module.css';
import backendService from '../../services/backendService';

const validationSchema = yup.object({
  title: yup.string().max(500, 'Title must be within 500 characters'),
  content: yup
    .string()
    .max(10000, 'Content must be within 10,000 characters')
    .required('Content is required'),
  isPublished: yup.boolean(),
});

interface FormValues {
  title?: string;
  isPublished?: boolean;
  content: string;
}

interface PostFormProps {
  postData?: IPost;
}

export default function PostForm({ postData }: PostFormProps) {
  const navigate = useNavigate();
  const editorRef = useRef(null);
  const form = useForm({
    defaultValues: { title: '', isPublished: true },
    resolver: yupResolver(validationSchema.pick(['title', 'isPublished'])),
  });
  const { register, handleSubmit, formState } = form;
  const setError = form.setError as UseFormSetError<FormValues>;
  const errors = formState.errors as FieldErrors<FormValues>;

  function htmlToText(html: string) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  }

  async function onSubmit({
    isPublished,
    title,
  }: {
    title?: string;
    isPublished?: boolean;
  }) {
    const htmlContent = editorRef.current.getContent();
    const purifiedHtmlContent = DOMPurify.sanitize(htmlContent);
    const textContent = htmlToText(purifiedHtmlContent).trim();
    try {
      await validationSchema.validate({ content: textContent });
      await backendService.createPost(purifiedHtmlContent, isPublished, title);
      navigate('/');
    } catch (err) {
      setError('content', { type: 'manual', message: (err as Error).message });
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          placeholder="Enter the post's title here"
          {...register('title')}
        />
      </div>
      <div className="form-group">
        <label htmlFor="content">Content</label>
        <Editor
          apiKey={import.meta.env.VITE_TINYMCE_KEY}
          onInit={(_evt, editor) => (editorRef.current = editor)}
          initialValue="<p>This is the initial content of the editor.</p>"
          init={{
            height: 500,
            menubar: false,
            plugins: [
              'advlist',
              'autolink',
              'lists',
              'link',
              'image',
              'charmap',
              'preview',
              'anchor',
              'searchreplace',
              'visualblocks',
              'code',
              'fullscreen',
              'insertdatetime',
              'media',
              'table',
              'code',
              'help',
              'wordcount',
            ],
            toolbar:
              'undo redo | blocks | ' +
              'bold italic forecolor | alignleft aligncenter ' +
              'alignright alignjustify | bullist numlist outdent indent | ' +
              'removeformat | help',
            content_style:
              'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
          }}
        />
        <p className="error">{errors.content?.message}</p>
      </div>
      <div className="form-group">
        <input type="checkbox" id="isPublished" {...register('isPublished')} />
        <label htmlFor="isPublished">Publish</label>
        <p className="error">{errors.isPublished?.message}</p>
      </div>
      <button disabled={formState.isSubmitting}>Submit</button>
    </form>
  );
}
