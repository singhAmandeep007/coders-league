import React from "react";
import { Link, useHistory } from "react-router-dom";
import { Button, Segment, Icon, Modal } from "semantic-ui-react";

import { deleteArticleService } from "./../../services/articleApi";

const EditDeleteArticleAction = ({ articleData }) => {
  const [open, setOpen] = React.useState(false);
  let history = useHistory();

  const deleteArticle = async () => {
    try {
      const response = await deleteArticleService(articleData.id);
      //console.log(response)
      if (response.status === 204) {
        history.push("/");
      }
    } catch (error) {
      const { response } = error;
      const { request, ...errorObject } = response;
      console.log(errorObject.data.message);
      history.push("/");
    }
  };

  return (
    <Segment
      basic
      compact
      style={{ margin: "0em" }}
    >
      <Link
        to={{
          pathname: `/a/edit/${articleData.slug}`,
          articleData: { ...articleData },
        }}
      >
        <Button
          inverted
          compact
          animated
          color="orange"
        >
          <Button.Content visible>Edit</Button.Content>
          <Button.Content hidden>
            <Icon name="edit" />
          </Button.Content>
        </Button>
      </Link>

      <Modal
        size="mini"
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
        trigger={
          <Button
            inverted
            compact
            animated
            color="red"
          >
            <Button.Content visible>Delete</Button.Content>
            <Button.Content hidden>
              <Icon name="trash" />
            </Button.Content>
          </Button>
        }
      >
        <Modal.Header>Delete Article</Modal.Header>
        <Modal.Content>
          <p>Are you sure you want to delete this article ?</p>
        </Modal.Content>
        <Modal.Actions>
          <Button
            negative
            onClick={() => setOpen(false)}
          >
            No
          </Button>
          <Button
            positive
            onClick={() => deleteArticle()}
          >
            Yes
          </Button>
        </Modal.Actions>
      </Modal>
    </Segment>
  );
};

export default EditDeleteArticleAction;
