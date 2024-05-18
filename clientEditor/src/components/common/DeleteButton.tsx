import { useNavigate } from 'react-router-dom';
import React, { useRef } from 'react';

import backendService from '../../services/backendService';
import Delete from '../../assets/images/delete.svg';
import useProfile from '../../hooks/useProfile';
import { IComment, IPost } from '../../types/types';

interface DeleteButtonProps {
  data: IComment | IPost;
  successRedirect?: string;
}

function DeleteButton({ data, successRedirect }: DeleteButtonProps) {
  const { setProfile } = useProfile();
  const navigate = useNavigate();
  const dialogRef = useRef<HTMLDialogElement>(null);

  const dataType = 'title' in data ? 'post' : 'comment';

  function handleDialogToggle(
    e?: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) {
    e?.stopPropagation();
    const dialog = dialogRef.current as HTMLDialogElement;
    if (dialog.className === 'hidden') {
      dialog.showModal();
      dialog.className = 'shown';
    } else {
      dialog.close();
      dialog.className = 'hidden';
    }
  }

  function handleDelete(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.stopPropagation();
    handleDialogToggle();

    const deleteData = dataType
      ? backendService.deletePost
      : backendService.deleteComment;
    deleteData(data.id)
      .then(() => backendService.getUser())
      .then((user) => setProfile(user.data))
      .then(() => {
        if (successRedirect) navigate(successRedirect);
      })
      .catch((err) => console.log(err));
  }

  return (
    <>
      <button className="icon-button" onClick={handleDialogToggle}>
        <img src={Delete}></img>
      </button>
      <dialog className="hidden" ref={dialogRef}>
        <h3>Are you sure you wish to delete this {dataType}?</h3>
        <div className="row">
          <button onClick={handleDelete}>Yes</button>
          <button onClick={handleDialogToggle}>Cancel</button>
        </div>
      </dialog>
    </>
  );
}

export default DeleteButton;
