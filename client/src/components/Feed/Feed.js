import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import MessageBox from './../messageBox';
import { getArticles } from './../../redux/article/articleActions';

import PlaceholderCard from './../placeholderCard/placeholderCard';
import ArticleCard from './../articleCard/articleCard';

const Feed = ({ articles, isFetching, articleMessage, userMessage, getArticles, query }) => {
   console.log('query:', query)
   const generateQuery = (query) => {
      let queryObj = {};
      if (query.searchTags.length > 0) queryObj.tags = query.searchTags.toString()
      if (query.searchTerm) queryObj.title = query.searchTerm.trim();
      if (query.searchExpertiseLevel) queryObj.expertiseLevel = query.searchExpertiseLevel.trim();
      if (query.sortBy) queryObj.sort = query.sortBy.trim();
      return queryObj;
   }

   useEffect(() => {
      const queryObj = generateQuery(query);
      console.log(queryObj)
      getArticles({ ...queryObj })
   }, [getArticles, query])

   return isFetching ? (
      <PlaceholderCard num={5} />
   ) : (
         <>
            {articleMessage && <MessageBox message={articleMessage} dispatchFor='article' />}
            {userMessage && <MessageBox message={userMessage} dispatchFor='user' />}

            {articles.length > 0 ? articles.map(article => {
               return <ArticleCard key={article._id} {...article} />
            }) : <div className="ui message">No article found...🙄</div>}
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