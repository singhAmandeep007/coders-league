import React, { useState } from 'react';
import { Container, Grid } from 'semantic-ui-react';
// import SearchBar from './SearchBar';
import Feed from './../../components/Feed/Feed'
import ArticleSearchWidget from './../../components/articleSearchWidget/articleSearchWidget';
import ArticleSearchByTimeMenu from './../../components/articleSearchByTimeMenu/articleSearchByTimeMenu';

const HomePage = () => {

   const [state, setState] = useState({
      searchTerm: '',
      searchTags: [],
      searchExpertiseLevel: '',
      sortBy: '',
      searchTime: ''

   })

   return (
      <Container>
         <Grid columns={2} stackable divided padded>
            <Grid.Row>

               <Grid.Column width={5}>
                  <ArticleSearchWidget
                     search={(searchTerm, searchTags, searchExpertiseLevel, sortBy) => setState({
                        ...state,
                        searchTerm,
                        searchTags,
                        searchExpertiseLevel,
                        sortBy
                     })}
                     reset={() => setState({

                        searchTerm: '',
                        searchTags: [],
                        searchExpertiseLevel: '',
                        sortBy: '',
                        searchTime: ''
                     })
                     }

                  />
               </Grid.Column>

               <Grid.Column width={11}>
                  <Grid.Row>
                     <ArticleSearchByTimeMenu
                        searchTime={(searchTime) => setState({
                           ...state,
                           searchTime
                        })}
                     />
                  </Grid.Row>

                  <Grid.Row >
                     {/* Feed */}
                     <Feed query={state} />
                  </Grid.Row>
               </Grid.Column>

            </Grid.Row>
         </Grid>
      </Container>
   )
}


export default HomePage;