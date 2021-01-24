import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import MessageBox from './../messageBox';
import { getArticles } from './../../redux/article/articleActions';

import PlaceholderCard from './../placeholderCard/placeholderCard';
import ArticleCard from './../articleCard/articleCard';

const Feed = ({ articles, isFetching, articleMessage, userMessage, getArticles }) => {

   useEffect(() => {
      getArticles()
   }, [getArticles])

   return isFetching ? (
      <PlaceholderCard num={5} />
   ) : (
         <>
            {articleMessage && <MessageBox message={articleMessage} dispatchFor='article' />}
            {userMessage && <MessageBox message={userMessage} dispatchFor='user' />}

            {articles.length > 0 && articles.map(article => {
               return <ArticleCard key={article._id} {...article} />
            })}
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
   getArticles: () => {
      dispatch(getArticles());
   }
})

export default connect(mapStateToProps, mapDispatchToProps)(Feed)