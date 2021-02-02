import React from 'react';
import { NavLink, Route, Switch } from 'react-router-dom';
import { Container, Grid, Header, Menu } from 'semantic-ui-react';

import UserAccount from './userAccount';
import UserNotification from './userNotification';
import UserProfile from './userProfile';

const UserSettingsPage = ({ currentUser, ...props }) => {

   const url = props.match.url;
   const path = props.match.path;
   const pathname = props.location.pathname;

   return (
      <Container>

         <Grid stackable padded="vertically">
            <Grid.Row centered>
               <Header as='h2' icon>
                  <i className="cogs icon"></i>
                        Profile & Account Settings
                     <Header.Subheader>
                     Manage your account settings and update profile.
                     </Header.Subheader>
               </Header>
            </Grid.Row>
            <Grid.Row verticalAlign="middle">

               <Menu tabular fluid >
                  <Menu.Item
                     name='Profile'
                     as={NavLink}
                     active={pathname === '/settings' ? true : pathname === '/settings/profile' ? true : false}
                     exact
                     to={`${url}/profile`}
                  />
                  <Menu.Item
                     name='Account'
                     as={NavLink} exact to={`${url}/account`}
                  />
                  <Menu.Item
                     name='Notifications'
                     as={NavLink} exact to={`${url}/notifications`}
                  />
               </Menu>


               <Switch>

                  <Route exact path={`${path}/profile`}>
                     <UserProfile currentUser={currentUser} />
                  </Route>
                  <Route exact path={`${path}/account`}>
                     <UserAccount currentUser={currentUser} />
                  </Route>
                  <Route exact path={`${path}/notifications`}>
                     <UserNotification />
                  </Route>
                  <Route exact path={path}>
                     <UserProfile currentUser={currentUser} />
                  </Route>
               </Switch>



            </Grid.Row>



         </Grid>

      </Container>
   )
}

export default UserSettingsPage