import React, { useReducer } from 'react';
import { Grid } from 'semantic-ui-react';

import ArticleCard from './../../components/articleCard/articleCard';
import ArticleSearchWidget from './../../components/articleSearchWidget/articleSearchWidget';

const RenderArticles = ({ articleData }) => {

   function reducer(state, action) {
      switch (action.type) {
         case 'SEARCH_TITLE':
            return {
               articles: articleData.filter(article => article.title.indexOf(action.payload) !== -1)
            };
         case 'SEARCH':
            //console.log('action.payload', action.payload)
            const { searchTerm, searchTags, searchExpertiseLevel, sortBy } = action.payload;
            const matchedArticles = articleData.filter((article) => {

               if (searchTerm && searchTags.length === 0 && !searchExpertiseLevel) {
                  return article.title.indexOf(searchTerm) !== -1;
               }
               else if (!searchTerm && searchTags.length > 0 && !searchExpertiseLevel) {
                  return searchTags.every((v) => article.tags.includes(v))
               }
               else if (!searchTerm && searchTags.length === 0 && searchExpertiseLevel) {
                  return article.expertiseLevel.indexOf(searchExpertiseLevel) !== -1;
               }
               else if (searchTerm && searchTags.length > 0 && !searchExpertiseLevel) {
                  return article.title.indexOf(searchTerm) !== -1 && searchTags.every((v) => article.tags.includes(v))
               }
               else if (searchTerm && searchTags.length === 0 && searchExpertiseLevel) {
                  return article.title.indexOf(searchTerm) !== -1 && article.expertiseLevel.indexOf(searchExpertiseLevel) !== -1
               }
               else if (!searchTerm && searchTags.length > 0 && searchExpertiseLevel) {
                  return article.expertiseLevel.indexOf(searchExpertiseLevel) !== -1 && searchTags.every((v) => article.tags.includes(v))
               }
               return article.title.indexOf(searchTerm) !== -1 && article.expertiseLevel.indexOf(searchExpertiseLevel) !== -1 && searchTags.every((v) => article.tags.includes(v))
            })

            if (sortBy && sortBy === '-likeCounts') {
               matchedArticles.sort((a, b) => {
                  if (a.likeCounts === b.likeCounts) {
                     return b.commentCounts - a.commentCounts;
                  } else {
                     return b.likeCounts - a.likeCounts;
                  }
               });
            }
            if (sortBy && sortBy === 'likeCounts') {
               matchedArticles.sort((a, b) => {
                  if (a.likeCounts === b.likeCounts) {
                     return a.commentCounts - b.commentCounts;
                  } else {
                     return a.likeCounts - b.likeCounts;
                  }
               });
            }
            if (sortBy && sortBy === '-createdAt') {
               matchedArticles.sort((a, b) => {
                  return (a.createdAt > b.createdAt) ? -1 : ((a.createdAt < b.createdAt) ? 1 : 0);
               });
            }
            return {
               articles: matchedArticles || []
            };
         case 'RESET':
            return { articles: articleData };
         default:
            throw new Error();
      }
   }

   const [state, dispatch] = useReducer(reducer, { articles: articleData })

   return (
      <>
         <Grid.Column width={5}>
            <ArticleSearchWidget
               search={(searchTerm, searchTags, searchExpertiseLevel, sortBy) => dispatch({ type: 'SEARCH', payload: { searchTerm, searchTags, searchExpertiseLevel, sortBy } })}
               reset={() => dispatch({ type: 'RESET' })}
            />
         </Grid.Column>

         <Grid.Column width={11}>
            <div className="ui secondary black segment" style={{ padding: '1.4em' }}>
               {(state.articles && state.articles.length > 0) ? state.articles.map(article => <ArticleCard
                  key={article._id}
                  {...article}
               />) : <div className="ui message">Nothing to show...🙄</div>
               }
            </div>
         </Grid.Column>
      </>
   )
}

export default RenderArticles;
