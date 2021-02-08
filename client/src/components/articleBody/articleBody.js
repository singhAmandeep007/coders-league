import React from 'react';
import { Link } from 'react-router-dom';
import { Image, Segment, List, Label } from 'semantic-ui-react';

import parse from 'html-react-parser';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { gruvboxDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';

// import convertIsoToDate from './../../utils/IsoDateConvert';
import EditDeleteArticleAction from './editDeleteArticleAction';

import './../../quill.css';

const ArticleBody = ({ articleData, userData, isAuthor = false }) => {

   const options = {
      replace: domNode => {
         if (domNode.attribs && domNode.name === 'pre') {
            console.log(domNode)
            return <SyntaxHighlighter
               language="javascript"
               style={gruvboxDark}
               className='ql-syntax'
               showLineNumbers={true}
            >
               {domNode.children[0].data}
            </SyntaxHighlighter>
         }
      }
   };

   console.log(articleData)
   return (
      <Segment raised >
         {articleData && articleData.image && <Image key='coverImage' rounded fluid src={articleData.image} alt={`cover image for ${articleData.title}`} style={{ maxHeight: "50vh" }} />}

         {userData && <div >
            <Label ribbon size='tiny' style={{ marginTop: '1.2em' }}>
               <List horizontal >
                  <List.Item >
                     <Image avatar src={userData.photo} alt='profile pic' />
                     <List.Content>
                        <Link to={`/u/${userData.username}`}>{userData.fullname}</Link>
                        {/* {userData && userData.hasOwnProperty('createdAt') && <span style={{ fontSize: '0.83rem', lineHeight: '1em', fontWeight: '200' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{convertIsoToDate(articleData.createdAt)}</span>} */}
                     </List.Content>
                  </List.Item>
               </List>
            </Label>
         </div>}

         {isAuthor && <EditDeleteArticleAction articleData={articleData} />}

         <Segment basic style={{ margin: '0em' }}>

            {articleData && articleData.title && <h1 className="ui dividing header">
               {articleData.title}
            </h1>}

            {articleData && articleData.expertiseLevel && <Label key='expertiseLevel'
               color={articleData.expertiseLevel === 'advanced' ? "red" : (articleData.expertiseLevel === 'intermediate') ? "orange" : "blue"}>
               <i className="graduation cap icon"></i>{articleData.expertiseLevel}
            </Label>}

            {articleData && articleData.tags && articleData.tags.map(tag => {
               return <Label key={tag} ># {tag}</Label>
            })}

         </Segment>
         {/* body */}
         {articleData && articleData.body && <div className="ql-snow">
            <div className="ql-editor">
               {parse(articleData.body, options)}
            </div>
         </div>}
      </Segment>
   )
}
export default ArticleBody;