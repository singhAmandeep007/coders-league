import React, { useState } from "react";
import { Button, Form, Icon, Image, Progress, Message } from "semantic-ui-react";

const UploadPhotoSingle = React.memo(({ upload, onUploadSuccess }) => {

   const [fileStatus, setFileStatus] = useState({
      file: null,
      filename: '',
      previewSource: null,
      statusCode: null,
      isUploading: false,
      errors: false
   })
   const baseFileStatus = {
      file: null,
      filename: '',
      previewSource: null,
      statusCode: null,
      isUploading: false,
      errors: false
   }
   function isImage(file) {
      return file['type'].split('/')[0] === 'image';
   }
   function returnFileSize(number) {
      if (number < 1024) {
         return number + 'bytes';
      } else if (number >= 1024 && number < 1048576) {
         return (number / 1024).toFixed(1) + 'KB';
      } else if (number >= 1048576) {
         return (number / 1048576).toFixed(1) + 'MB';
      }
   }
   const handleFileInputChange = e => {
      const file = e.target.files[0];
      console.log('file', file);
      if (file) {
         if (!isImage(file)) {
            setFileStatus({
               ...baseFileStatus,
               filename: `Name: ${file.name}   Size: ${returnFileSize(file.size)}`,
               errors: 'Not an image! Please upload only an image.'
            })
            return;
         }
         if (file.size > 5242880) {
            setFileStatus({
               ...baseFileStatus,
               filename: `Name: ${file.name}   Size: ${returnFileSize(file.size)}`,
               errors: 'Only Image upto the size of 5MB is allowed!'
            })
            return;
         }
         if (file.size < 5242880) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
               setFileStatus({
                  ...baseFileStatus,
                  filename: `Name: ${file.name}   Size: ${returnFileSize(file.size)}`,
                  file: file,
                  previewSource: reader.result
               })
            }
            reader.onerror = () => {
               setFileStatus({
                  ...baseFileStatus,
                  errors: 'Error in reading the File!',
               })
               return;
            }
         }
      }
      else {
         setFileStatus({
            ...baseFileStatus,
            errors: 'No Image Selected!'
         })
         return;
      }
   }


   const handleSubmitFile = async (e) => {
      e.preventDefault(); // Stop form submit
      if (fileStatus.errors || !fileStatus.file) {
         setFileStatus({ ...baseFileStatus, errors: 'No Image Selected or Image size > 5MB!' });
         return;
      }
      let formData = new FormData();
      formData.append('photo', fileStatus.file);

      try {
         setFileStatus({ ...fileStatus, isUploading: true });
         const response = await upload(formData)
         console.log(response.data.data)
         onUploadSuccess(response.data.data.user)
         setFileStatus({
            ...baseFileStatus,
            statusCode: response.status,
         })
      } catch (error) {
         const { response } = error;
         const { request, ...errorObject } = response;
         setFileStatus({
            ...baseFileStatus,
            statusCode: errorObject.status,
            errors: errorObject.data.message
         })
      }
   }
   return (
      <>
         {fileStatus.previewSource && (
            <Image
               src={fileStatus.previewSource}
               size="medium"
               centered
               rounded
               alt='chosen profile pic'
            />
         )}
         <br />
         <Form onSubmit={handleSubmitFile} error={!!fileStatus.errors} >
            <Form.Field>

               <Button as="label" htmlFor="photo" type="button" animated="fade">
                  <Button.Content visible>
                     <Icon name="file image" />
                  </Button.Content>
                  <Button.Content hidden>Choose a Image</Button.Content>
               </Button>
               <input
                  type="file"
                  name="photo"
                  id="photo"
                  accept="image/*"
                  onChange={handleFileInputChange}
                  hidden
               />
               <Form.Input
                  fluid
                  label="Image Chosen: "
                  placeholder="Use the above bar to browse your file system"
                  readOnly
                  value={fileStatus.filename}
               />
               <Message
                  error
                  content={fileStatus.errors}
                  icon='bullhorn'
               />
               <Button type="submit" primary loading={fileStatus.isUploading}>
                  Upload
               </Button>
               {fileStatus.statusCode && fileStatus.statusCode === 200 ? (
                  <Progress
                     style={{ marginTop: "20px" }}
                     percent={100}
                     success
                     progress
                     size='small'
                  >
                     Image Upload Success
                  </Progress>
               ) : fileStatus.statusCode && (fileStatus.statusCode === 500 || fileStatus.statusCode === 400) ? (
                  <Progress
                     style={{ marginTop: "20px" }}
                     percent={100}
                     error
                     active
                     progress
                     size='small'
                  >
                     Image Upload Failed
                  </Progress>
               ) : null}
            </Form.Field>
         </Form>

      </>
   );
})


export default UploadPhotoSingle;




