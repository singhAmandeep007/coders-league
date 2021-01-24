import React from 'react';
import ArticleBody from './../articleBody'

const PreviewArticle = ({ previewArticleData, userData }) => {
   return (
      <div>
         <ArticleBody articleData={previewArticleData} userData={userData} />
      </div>
   )
}

export default PreviewArticle;