import { useState } from 'react';
import SearchDevice from '../components/common/SearchDevice';
import Layout from '../components/layout/Layout';
import PostList from '../components/posts/PostList';
import { IPost } from '../types/types';

export default function Search() {
  const [results, setResults] = useState<IPost[]>([]);

  return (
    <Layout>
      <section>
        <h2>Search Your Posts</h2>
        <SearchDevice setData={setResults} />
      </section>
      <main>
        <h2>Results</h2>
        <p>There are {results.length} results</p>
        <PostList postsData={results} />
      </main>
    </Layout>
  );
}
