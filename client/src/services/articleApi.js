import axios from 'axios';

const urlGetArticles = `/api/v1/articles`;
const urlGetArticle = `/api/v1/articles/`;
const urlPostArticle = `/api/v1/articles`;
const urlUpdateArticle = `/api/v1/articles`;
const urlDeleteArticle = `/api/v1/articles`;

export function getArticlesService() {
   return axios.get(urlGetArticles);
}

export function getArticleService(username, slug) {
   return axios.get(`${urlGetArticle}/${username}/${slug}`);
}

export function postArticleService(data) {
   return axios.post(urlPostArticle,
      data
   );
}

export function updateArticleService(id, data) {
   return axios.patch(`${urlUpdateArticle}/${id}`,
      data
   )
}
export function deleteArticleService(id) {
   return axios.delete(`${urlDeleteArticle}/${id}`)
}


