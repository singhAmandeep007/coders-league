import React, { useCallback } from 'react';
import { Grid, Image, Segment, Button, Modal } from 'semantic-ui-react';

import { useDispatch } from 'react-redux';

import UploadPhotoSingle from './../../../components/UploadPhoto/uploadPhotoSingle';
import UpdateProfileForm from './../../../components/UpdateProfileForm';

import { updateUserService } from './../../../services/userApi';
import { updateUserInfo } from './../../../redux/user/userActions';

const UserProfile = ({ currentUser }) => {
   const [open, setOpen] = React.useState(false);
   const dispatch = useDispatch()
   const updateUserInfoCB = useCallback((userData) => dispatch(updateUserInfo(userData)), [dispatch])

   return (
      <Grid celled='internally' stackable>
         <Grid.Row columns={2}>
            <Grid.Column width={6} >

               <div className="ui floating message blue">
                  <div className="header">
                     <i className=" thumbtack icon"></i>
                     Your Profile Photo
                  </div>
               </div>

               <Segment raised color="blue">
                  <Image src={currentUser.photo} fluid style={{ marginBottom: '5px' }} />
                  <Modal
                     closeIcon
                     size="tiny"
                     onClose={() => setOpen(false)}
                     onOpen={() => setOpen(true)}
                     open={open}
                     trigger={<Button fluid compact secondary>Upload Profile Photo</Button>}
                  >
                     <Modal.Header>Upload Profile Image</Modal.Header>
                     <Modal.Content >
                        <UploadPhotoSingle
                           upload={updateUserService}
                           onUploadSuccess={updateUserInfoCB}
                        />
                     </Modal.Content>
                     <Modal.Actions>
                        <Button onClick={() => setOpen(false)}>Cancel</Button>
                        <Button onClick={() => setOpen(false)} positive>
                           Ok
                           </Button>
                     </Modal.Actions>
                  </Modal>
               </Segment>
            </Grid.Column>
            <Grid.Column width={10}>
               <UpdateProfileForm
                  updateUserInfo={updateUserService}
                  updateUserInfoCB={updateUserInfoCB}
                  currentUser={currentUser}
               />
            </Grid.Column>
         </Grid.Row>
      </Grid>
   )
}

export default UserProfile;