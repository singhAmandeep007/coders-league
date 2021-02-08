import axios from 'axios';

const urlCommentApi = `/api/v1/articles`;
const urlGetComments = `/api/v1/comments/`;
const urlPostCommentLike = `/api/v1/comments`;

// export function getCommentsService() {
//    return axios.get(urlCommentApi);
// }

// export function getCommentService(username, slug) {
//    return axios.get(`${urlCommentApi}/${username}/${slug}`);
// }

export function getCommentsService(query) {
   return axios.get(urlGetComments, {
      params: query
   });
}

export function postCommentService(articleId, data) {
   console.log(articleId, data)
   return axios.post(`${urlCommentApi}/${articleId}/comments/`,
      data
   );
}

export function updateCommentService(articleId, commentId, data) {
   return axios.patch(`${urlCommentApi}/${articleId}/comments/${commentId}`,
      data
   );
}

export function deleteCommentService(articleId, commentId) {
   return axios.delete(`${urlCommentApi}/${articleId}/comments/${commentId}`)
}

// COMMENT LIKE
export function postCommentLikeService(commentId) {
   console.log(commentId)
   return axios.post(`${urlPostCommentLike}/${commentId}/like`);
}