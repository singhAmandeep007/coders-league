import React, { useState, useEffect } from 'react';

import { useMediaQuery } from 'react-responsive';
import { Grid, Ref, Segment, Sticky, Container } from 'semantic-ui-react';

import { getArticleService } from './../../services/articleApi';

import ArticleBody from './../../components/articleBody';
import ArticleSidebarMenu from './../../components/articleSidebarMenu/articleSidebarMenu';
import CommentSection from './../../components/commentsSection/commentsSection';
import ArticleAuthorCard from './../../components/articleAuthorCard';

import PlaceholderCard from './../../components/placeholderCard/placeholderCard';
import PlaceholderComment from './../../components/placeholderComment/placeholderComment';
import PlaceholderImage from './../../components/placeholderImage/placeholderImage';

import './articlePage.css'

const ArticlePage = ({ match, history, isAuthenticated, currentUser }) => {

   const [data, setData] = useState({
      loading: true,
      isAuthor: false,
      articleData: null,
      userData: null,
      commentsData: null
   });

   const objectRef = React.useRef(null)
   // console.log(data)
   useEffect(() => {
      const { username, slug } = match.params;
      getArticleService(username, slug).then(response => {
         //console.log(response.data.data)
         let { user: userData, comments: commentsData, ...articleData } = response.data.data;

         setData({
            loading: false,
            isAuthor: isAuthenticated && currentUser.id === userData.id,
            articleData: articleData,
            userData: userData,
            commentsData: commentsData
         })
      }, err => history.push('/error'))
   }, [match, history, isAuthenticated, currentUser])

   const isDesktopOrLaptop = useMediaQuery({
      query: '(min-device-width: 768px)'
   })
   const isTabletOrMobileDevice = useMediaQuery({
      query: '(max-device-width: 768px)'
   })

   return <Grid as={Container} stackable>
      <Grid.Column style={{ padding: '0em' }}>
         {/* sticky sidebar menu*/}
         {!data.loading && isDesktopOrLaptop && <Sticky context={objectRef} offset={90}>
            {<ArticleSidebarMenu
               screen='desktop'
               articleData={data.articleData}
               isAuthenticated={isAuthenticated}
               currentUserId={(currentUser && currentUser._id) ? currentUser._id : null}
            />}
         </Sticky>}
         {/* fixed sidebar menu*/}
         {!data.loading && isTabletOrMobileDevice && <ArticleSidebarMenu screen='mobile'
            articleData={data.articleData}
            isAuthenticated={isAuthenticated}
            currentUserId={(currentUser && currentUser._id) ? currentUser._id : null}
         />}

      </Grid.Column>
      <Grid.Column width={11}>
         {/* content */}
         <Ref innerRef={objectRef}>
            <div>

               {data.loading ? <Segment>
                  <PlaceholderImage />
                  <PlaceholderComment num={5} />
               </Segment> : <ArticleBody key='articleBody'
                  articleData={data.articleData}
                  userData={data.userData}
                  isAuthor={data.isAuthor}
                  />}
               {/* comments */}
               {data.loading ? <><br /><br /><PlaceholderComment num={4} /></> : data.commentsData &&
                  <CommentSection
                     commentsData={data.commentsData}
                     isAuthenticated={isAuthenticated}
                     currentUser={currentUser}
                     articleId={data.articleData.id}
                  />
               }
            </div>
         </Ref>


      </Grid.Column>

      <Grid.Column width={4} >
         {data.loading ? <PlaceholderCard /> : data.userData && <div style={{ paddingBottom: '6em' }}>
            <Sticky context={objectRef} offset={90}>
               <ArticleAuthorCard
                  userData={data.userData}
                  isAuthenticated={isAuthenticated}
                  currentUserId={(currentUser && currentUser.id) ? currentUser.id : null}
               />
            </Sticky>
         </div>}

      </Grid.Column>
   </Grid>

}

export default ArticlePage;

