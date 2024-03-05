import React, { useState } from "react";
import { Segment, Form, Message } from "semantic-ui-react";
import { useForm } from "react-hook-form";

import formStyle from "./../../common/formStyles";

const UpdateProfileForm = ({ updateUserInfo, updateUserInfoCB, currentUser }) => {
  const [updateStatus, setUpdateStatus] = useState({
    statusCode: null,
    isFetching: false,
    errors: false,
    visibleMessage: false,
  });

  const { register, handleSubmit, errors, clearErrors } = useForm({
    defaultValues: {
      fullname: `${currentUser.fullname || ""}`,
      email: `${currentUser.email}`,
      username: `${currentUser.username}`,
      location: `${currentUser.location || ""}`,
      bio: `${currentUser.bio || ""}`,
      url: `${currentUser.url || ""}`,
      skills: `${currentUser.skills || ""}`,
    },
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    try {
      setUpdateStatus({ ...updateStatus, isFetching: true });
      //console.log(data)
      const response = await updateUserInfo(data);
      //console.log(response.data)
      updateUserInfoCB(response.data.data.user);
      setUpdateStatus({
        statusCode: response.status,
        isFetching: false,
        errors: false,
        visibleMessage: true,
      });
    } catch (error) {
      const { response } = error;
      const { request, ...errorObject } = response;
      setUpdateStatus({
        statusCode: errorObject.status,
        isFetching: false,
        errors: errorObject.data.message,
        visibleMessage: true,
      });
    }
  };

  const handleDismiss = () => {
    setUpdateStatus({ ...updateStatus, visibleMessage: false });
  };

  return (
    <>
      <div className="ui  floating message blue">
        <div className="header">
          <i className=" thumbtack icon"></i>
          Your Profile Data
        </div>
      </div>

      <Segment
        color="blue"
        raised
      >
        <Form
          style={formStyle.align}
          onSubmit={handleSubmit(onSubmit)}
          error={!!updateStatus.errors}
          success={updateStatus.statusCode === 200 ? true : false}
        >
          <Form.Field error={!!errors.fullname}>
            <label htmlFor="update-fullname">Full Name</label>
            <div className="ui left icon input">
              <i className="user icon"></i>
              <input
                id="update-fullname"
                name="fullname"
                type="text"
                placeholder="John Doe"
                ref={register()}
              />
            </div>
            {errors.fullname && <span style={formStyle.errorMessage}>{errors.fullname.message}</span>}
          </Form.Field>
          <Form.Field
            error={!!errors.username}
            required
          >
            <label htmlFor="update-username">User Name </label>
            <div className="ui left icon input">
              <i className="user icon"></i>
              <input
                id="update-username"
                name="username"
                type="text"
                placeholder="JohnDoe01"
                ref={register({
                  required: "You must specify a username.",
                  minLength: {
                    value: 5,
                    message: "Your username must be greater than or equal to 5 characters.",
                  },
                  pattern: {
                    // no space at all ->  /^\S+$/ no space in between characters -> /^\s*\S+\s*$/
                    value: /^\s*\S+\s*$/,
                    message: "Your username must not contain spaces.",
                  },
                })}
              />
            </div>
            {errors.username && <span style={formStyle.errorMessage}>{errors.username.message}</span>}
          </Form.Field>
          <Form.Field
            error={!!errors.email}
            required
          >
            <label htmlFor="update-email">Email</label>
            <div className="ui left icon input">
              <i className="mail icon"></i>
              <input
                id="update-email"
                name="email"
                type="email"
                placeholder="johnDoe@gmail.com"
                ref={register({
                  required: "You must specify a email.",
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "Your email must be valid.",
                  },
                })}
              />
            </div>
            {errors.email && <span style={formStyle.errorMessage}>{errors.email.message}</span>}
          </Form.Field>
          <Form.Field error={!!errors.location}>
            <label htmlFor="update-location">Location</label>
            <div className="ui left icon input">
              <i className="map marker alternate icon"></i>
              <input
                id="update-location"
                name="location"
                type="text"
                placeholder="India"
                ref={register()}
              />
            </div>
            {errors.location && <span style={formStyle.errorMessage}>{errors.location.message}</span>}
          </Form.Field>
          <Form.Field error={!!errors.bio}>
            <label htmlFor="update-bio">Bio</label>
            <textarea
              id="update-bio"
              placeholder="Just a normal guy."
              name="bio"
              ref={register()}
              rows="4"
            />

            {errors.bio && <span style={formStyle.errorMessage}>{errors.bio.message}</span>}
          </Form.Field>
          <Form.Field error={!!errors.url}>
            <label htmlFor="update-url">URL</label>
            <div className="ui left icon input">
              <i className="linkify icon"></i>
              <input
                id="update-url"
                name="url"
                type="text"
                placeholder="https...some_url..."
                ref={register()}
              />
            </div>
            {errors.url && <span style={formStyle.errorMessage}>{errors.url.message}</span>}
          </Form.Field>
          <Form.Field error={!!errors.skills}>
            <label htmlFor="update-skills">Skills</label>
            <div className="ui left icon input">
              <i className="certificate icon"></i>
              <input
                id="update-skills"
                name="skills"
                type="text"
                placeholder="Eg. HTML CSS JS (separated by space !)"
                ref={register()}
              />
            </div>
            {errors.skills && <span style={formStyle.errorMessage}>{errors.skills.message}</span>}
          </Form.Field>

          {updateStatus.visibleMessage && (
            <Message
              error={!!updateStatus.errors}
              success={updateStatus.statusCode === 200 ? true : false}
              onDismiss={handleDismiss}
              icon="bullhorn"
              content={
                updateStatus.errors
                  ? updateStatus.errors || "Error occured while updating profile."
                  : "Your profile has been updated."
              }
            />
          )}

          <Form.Button
            style={formStyle.formButton}
            color="blue"
            content="Save Profile"
            loading={updateStatus.isFetching ? true : false}
            fluid
          />

          <button
            className="ui fluid button"
            type="button"
            onClick={() => clearErrors()}
          >
            Reset
          </button>
        </Form>
      </Segment>
    </>
  );
};

export default UpdateProfileForm;
