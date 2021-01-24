import axios from 'axios';

const urlGetComments = `/api/v1/articles`;
const urlGetComment = `/api/v1/articles`;
const urlPostComment = `/api/v1/articles/`;
const urlUpdateComment = `/api/v1/articles`;
const urlDeleteComment = `/api/v1/articles`;

const urlPostCommentLike = `/api/v1/comments`;

export function getCommentsService() {
   return axios.get(urlGetComments);
}

export function getCommentService(username, slug) {
   return axios.get(`${urlGetComment}/${username}/${slug}`);
}

export function postCommentService(articleId, data) {
   console.log(articleId, data)
   return axios.post(`${urlPostComment}/${articleId}/comments/`,
      data
   );
}

export function updateCommentService(articleId, commentId, data) {
   return axios.patch(`${urlUpdateComment}/${articleId}/comments/${commentId}`,
      data
   );
}

export function deleteCommentService(articleId, commentId) {
   return axios.delete(`${urlDeleteComment}/${articleId}/comments/${commentId}`)
}

export function postCommentLikeService(commentId) {
   console.log(commentId)
   return axios.post(`${urlPostCommentLike}/${commentId}/like`);
}