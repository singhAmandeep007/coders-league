import React, { useState } from 'react';

import ArticleCard from './../../components/articleCard/articleCard';
import PlaceholderCard from './../../components/placeholderCard/placeholderCard';
import { getArticlesService } from './../../services/articleApi';

function RenderArticles({ articles, userId }) {

   const [state, setState] = useState({
      loading: false,
      articles: [...articles],
      page: 1,
      hasMore: true,
      error: null
   })

   const getMoreArticles = (page) => {
      setState({
         ...state,
         loading: true
      })

      getArticlesService({ user: userId, page: page }).then(
         response => {
            if (response.data.data.length < 9) {
               setState({
                  ...state,
                  loading: false,
                  articles: [...state.articles, ...response.data.data],
                  page: page,
                  hasMore: false
               })
               return;
            }
            setState({
               ...state,
               loading: false,
               articles: [...state.articles, ...response.data.data],
               page: page
            })
         },
         err => {
            const { response } = err;
            const { request, ...errorObject } = response;
            setState({
               ...state,
               loading: false,
               error: errorObject.data.message || errorObject.data
            })
         })
   }



   return (
      <div className="ui secondary teal segment" style={{ padding: '1.4em' }}>
         {state.articles.map(article => <ArticleCard key={article._id} {...article} />)}

         {state.loading ? <PlaceholderCard num={3} /> : null}
         {state.hasMore && <button
            className="ui primary button"
            onClick={() => getMoreArticles(state.page + 1)}
            style={{
               margin: '0 auto',
               display: 'block'
            }}
         >
            <i className='icon plus'></i>
                  Load more Articles...
               </button>
         }
         {!state.hasMore && <div className="ui horizontal divider">
            Yay ! You have seen all articles !
               </div>
         }
         {state.error && <div class="ui negative message">
            <div class="header">
               Error
                  </div>
            <p>{state.error}
            </p>
         </div>
         }


      </div>
   )
}

export default RenderArticles