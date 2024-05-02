import { get } from '../utils/AJAX';

export const PostsError = 'canny/posts/error';
function postError(error) {
  return {
    error,
    timestamp: Date.now(),
    type: PostsError,
  };
}

export const PostsLoaded = 'canny/posts/loaded';
function postsLoaded(posts, pages) {
  return {
    pages,
    posts,
    timestamp: Date.now(),
    type: PostsLoaded,
  };
}

export const RecountVotes = 'canny/posts/recount';
export function recountVotes(posts, pages) {
  return {
    type: RecountVotes,
  };
}

export function fetchPosts(params) {
  return async (dispatch, getState) => {
    const { sort } = getState().sort;
    const { error, pages, posts } = await get('/api/posts/get', {...params, sort});
    if (error) {
      return dispatch(postError(error));
    }
    dispatch(postsLoaded(posts, pages));
    return dispatch(recountVotes());
  };
}

export function loadPosts() {
  return async (dispatch, getState) => {
    await dispatch(fetchPosts());
    return dispatch(recountVotes());
  };
}
