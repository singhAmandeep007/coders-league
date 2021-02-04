import React from 'react';
import { Button, Modal, Image, List } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { setUserFollowing } from './../../redux/user/userActions';

const UserFollowing = ({ followingData, unfollowUser }) => {

   const [open, setOpen] = React.useState(false);
   const dispatch = useDispatch();

   const handleUnfollow = (unfollowId) => {
      dispatch(setUserFollowing(unfollowId));
      unfollowUser(unfollowId);
   }

   return (
      <Modal
         open={open}
         closeIcon
         centered
         size='tiny'
         onClose={() => setOpen(false)}
         onOpen={() => setOpen(true)}
         trigger={
            <div className="ui labeled button fluid tiny" tabIndex="0">
               <div className="ui button fluid tiny">
                  Following:
               </div>
               <span className="ui basic label">
                  {followingData.length}
               </span>
            </div>}
      >
         <Modal.Header icon='archive' content='Following: ' />
         <Modal.Content scrolling>

            <List divided verticalAlign='middle'>
               {followingData.map((following) => {
                  return (
                     <List.Item key={following._id}>
                        <List.Content floated='right'>
                           <Button
                              size='tiny'
                              primary
                              onClick={() => handleUnfollow(following._id)}
                           >
                              Unfollow
                              </Button>
                        </List.Content>
                        <Image avatar src={following.photo} />
                        <List.Content
                           as={Link}
                           to={`/u/${following.username}`}>
                           {following.fullname}
                        </List.Content>
                     </List.Item>
                  )
               })}
            </List>

         </Modal.Content>
      </Modal>
   )
}

export default UserFollowing;
