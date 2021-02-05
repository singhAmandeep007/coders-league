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

      if (query.searchTime) queryObj["createdAt[gte]"] = query.searchTime;
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
            }) : <div className="ui segment custom-list">
                  <section className="empty">
                     <img alt="no article found" src="https://res.cloudinary.com/dryiuvv1l/image/upload/v1612506457/empty_2_kq7tyk.png" className="ui large centered image" />
                     <h2 className="ui center aligned header empty-text">Seems like no article match the query!</h2>
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