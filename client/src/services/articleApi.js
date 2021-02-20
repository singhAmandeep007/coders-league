import axios from 'axios';

const urlArticleApi = `/api/v1/articles`;

export function getArticlesService(query) {
   //console.log('params', query)
   return axios.get(urlArticleApi, {
      params: query
   });
}

export function getArticleService(username, slug) {
   return axios.get(`${urlArticleApi}/${username}/${slug}`);
}

export function postArticleService(data) {
   return axios.post(urlArticleApi,
      data
   );
}

export function updateArticleService(id, data) {
   return axios.patch(`${urlArticleApi}/${id}`,
      data
   )
}
export function deleteArticleService(id) {
   return axios.delete(`${urlArticleApi}/${id}`)
}


// Article LIKE
export function postArticleLikeService(articleId) {
   return axios.post(`${urlArticleApi}/${articleId}/like`);
}

// Article BOOKMARK
export function postArticleBookmarkService(articleId) {
   return axios.post(`${urlArticleApi}/${articleId}/bookmark`);
}