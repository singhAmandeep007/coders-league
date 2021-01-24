import React from 'react';

// import Loading from './../../Loading';
// import RenderArticles from './RenderArticles';
// import SearchBar from './SearchBar';
import Feed from './../../components/Feed/Feed'

import { Container, Grid } from 'semantic-ui-react'

class HomePage extends React.Component {
   render() {
      return (
         <Container>
            <Grid columns={2} stackable divided padded>
               <Grid.Row>

                  <Grid.Column width={3}>
                     <p> User Info Some Tags</p>
                  </Grid.Column>

                  <Grid.Column width={13}>
                     <Grid.Row>
                        {/* <SearchBar></SearchBar> */}
                     </Grid.Row>

                     <Grid.Row >
                        {/* Feed */}
                        <Feed />
                     </Grid.Row>
                  </Grid.Column>

               </Grid.Row>
            </Grid>
         </Container>
      )
   }
}



export default HomePage;