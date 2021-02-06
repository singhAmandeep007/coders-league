import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import MessageBox from './../messageBox';
import { getArticles } from './../../redux/article/articleActions';
import { getArticlesService } from './../../services/articleApi';

import PlaceholderCard from './../placeholderCard/placeholderCard';
import ArticleCard from './../articleCard/articleCard';

const Feed = ({ articles, isFetching, articleMessage, userMessage, getArticles, query }) => {

   const generateQuery = (query) => {
      let queryObj = {};
      if (query.searchTags.length > 0) queryObj.tags = query.searchTags.toString()
      if (query.searchTerm) queryObj.title = query.searchTerm.trim();
      if (query.searchExpertiseLevel) queryObj.expertiseLevel = query.searchExpertiseLevel.trim();
      if (query.sortBy) queryObj.sort = query.sortBy.trim();

      if (query.searchTime) queryObj["createdAt[gte]"] = query.searchTime;
      return queryObj;
   }

   useEffect(() => {
      const queryObj = generateQuery(query);
      console.log(queryObj)

      setState({
         loading: false,
         nextArticles: [],
         page: 1,
         hasMore: true,
         error: null
      })

      getArticles({ ...queryObj })
   }, [getArticles, query])

   const [state, setState] = useState({
      loading: false,
      nextArticles: [],
      page: 1,
      hasMore: true,
      error: null
   })

   const getMoreArticles = (page) => {
      setState({
         ...state,
         loading: true
      })
      const queryObj = generateQuery(query);
      getArticlesService({ ...queryObj, page: page }).then(
         response => {
            if (response.data.data.length < 9) {
               setState({
                  ...state,
                  loading: false,
                  nextArticles: [...state.nextArticles, ...response.data.data],
                  page: page,
                  hasMore: false
               })
               return;
            }
            setState({
               ...state,
               loading: false,
               nextArticles: [...state.nextArticles, ...response.data.data],
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


   return isFetching ? (
      <PlaceholderCard num={5} />
   ) : (
         <>
            {articleMessage && <MessageBox message={articleMessage} dispatchFor='article' />}
            {userMessage && <MessageBox message={userMessage} dispatchFor='user' />}

            {articles.length > 0 ? <>
               {articles.map(article => {
                  return <ArticleCard key={article._id} {...article} />
               })}
               {state.nextArticles && state.nextArticles.length > 0 && state.nextArticles.map(article => {
                  return <ArticleCard key={article._id} {...article} />
               })}
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
               </button>}
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
            </> : <div className="ui segment custom-list">
                  <section className="empty">
                     <img alt="no article found" src="https://res.cloudinary.com/dryiuvv1l/image/upload/v1612506457/empty_2_kq7tyk.png" className="ui large centered image" />
                     <h2 className="ui center aligned header empty-text">Seems like there is no article !</h2>
                  </section></div>}
         </>
      )

}

const mapStateToProps = state => ({
   articles: state.articleReducer.articles,
   articleMessage: state.articleReducer.articleMessage,
   isFetching: state.articleReducer.isFetching,
   userMessage: state.userReducer.userMessage
})
const mapDispatchToProps = dispatch => ({
   getArticles: (query) => {
      dispatch(getArticles(query));
   }
})

export default connect(mapStateToProps, mapDispatchToProps)(Feed)