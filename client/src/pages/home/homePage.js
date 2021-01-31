import React, { useState } from 'react';
import { Container, Grid } from 'semantic-ui-react';
// import SearchBar from './SearchBar';
import Feed from './../../components/Feed/Feed'
import ArticleSearchWidget from './../../components/articleSearchWidget/articleSearchWidget';


const HomePage = () => {

   const [state, setState] = useState({
      searchTerm: '',
      searchTags: [],
      searchExpertiseLevel: '',
      sortBy: ''
   })

   return (
      <Container>
         <Grid columns={2} stackable divided padded>
            <Grid.Row>

               <Grid.Column width={5}>
                  <ArticleSearchWidget
                     search={(searchTerm, searchTags, searchExpertiseLevel, sortBy) => setState({
                        searchTerm,
                        searchTags,
                        searchExpertiseLevel,
                        sortBy
                     })}
                     reset={() => setState({
                        searchTerm: '',
                        searchTags: [],
                        searchExpertiseLevel: '',
                        sortBy: ''
                     })
                     }

                  />
               </Grid.Column>

               <Grid.Column width={11}>
                  <Grid.Row>
                     {/* <SearchBar></SearchBar> */}
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