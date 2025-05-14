import usePocketBaseCore from './usePocketBaseCore';
import usePosts from './usePosts';
import useComments from './useComments';
import useUsers from './useUsers';

export default function usePocketBaseUtils() {
  const core = usePocketBaseCore();
  const posts = usePosts();
  const comments = useComments();
  const users = useUsers();

  return {
    ...core,
    ...posts,
    ...comments,
    ...users
  };
}