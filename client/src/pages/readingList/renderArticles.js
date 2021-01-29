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
            const { searchTerm, searchTags } = action.payload;
            const matchedArticles = articleData.filter((article) => {

               if (searchTerm && searchTags.length === 0) {
                  return article.title.indexOf(searchTerm) !== -1;
               }
               else if (!searchTerm && searchTags.length > 0) {
                  return searchTags.every((v) => article.tags.includes(v))
               }
               return article.title.indexOf(searchTerm) !== -1 && searchTags.every((v) => article.tags.includes(v))
            })
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
               search={(searchTerm, searchTags) => dispatch({ type: 'SEARCH', payload: { searchTerm, searchTags } })}
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
