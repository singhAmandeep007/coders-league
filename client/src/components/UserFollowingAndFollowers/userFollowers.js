import React from "react";
import { Modal, Image, List } from "semantic-ui-react";
import { Link } from "react-router-dom";

const UserFollowers = ({ followersData }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Modal
      open={open}
      closeIcon
      centered
      size="tiny"
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      trigger={
        <div
          className="ui labeled button fluid tiny"
          tabIndex="0"
        >
          <div className="ui button fluid tiny">Followers:</div>
          <span className="ui basic label">{followersData.length}</span>
        </div>
      }
    >
      <Modal.Header
        icon="archive"
        content="Followers: "
      />
      <Modal.Content scrolling>
        <List
          divided
          verticalAlign="middle"
        >
          {followersData.map((followers) => {
            return (
              <List.Item key={followers._id}>
                <Image
                  avatar
                  src={followers.photo}
                />
                <List.Content
                  as={Link}
                  to={`/u/${followers.username}`}
                >
                  {followers.fullname}
                </List.Content>
              </List.Item>
            );
          })}
        </List>
      </Modal.Content>
    </Modal>
  );
};

export default UserFollowers;
