import React, { useReducer } from 'react';
import { Grid } from 'semantic-ui-react';

import ArticleCard from './../../components/articleCard/articleCard';
import ArticleSearchWidget from './../../components/articleSearchWidget/articleSearchWidget';

const RenderArticles = ({ articleData }) => {

   function reducer(state, action) {
      console.log(action)
      switch (action.type) {
         case 'SEARCH':
            return {
               articles: articleData.filter(article => article.title.indexOf(action.payload) !== -1)
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
               search={(searchTerm) => dispatch({ type: 'SEARCH', payload: searchTerm })}
               reset={() => dispatch({ type: 'RESET' })}
            />
         </Grid.Column>

         <Grid.Column width={11}>
            <div className="ui secondary teal segment" style={{ padding: '1.4em' }}>
               {state.articles.map(article => <ArticleCard
                  key={article._id}
                  {...article}
               />)
               }
            </div>
         </Grid.Column>
      </>
   )
}

export default RenderArticles;
