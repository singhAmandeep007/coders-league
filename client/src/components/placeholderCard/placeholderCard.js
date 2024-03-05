import React from "react";
import { Placeholder, Segment } from "semantic-ui-react";

const PlaceholderCard = ({ num = 1 }) => {
  let placeholderCards = Array.from(Array(num), (e, i) => {
    return (
      <Segment
        raised
        key={i}
      >
        <Placeholder fluid>
          <Placeholder.Header image>
            <Placeholder.Line />
            <Placeholder.Line />
          </Placeholder.Header>
          <Placeholder.Paragraph>
            <Placeholder.Line length="very long" />
            <Placeholder.Line length="long" />
          </Placeholder.Paragraph>
          <Placeholder.Paragraph>
            <Placeholder.Line length="short" />
            <Placeholder.Line length="very short" />
          </Placeholder.Paragraph>
        </Placeholder>
      </Segment>
    );
  });

  return <>{placeholderCards}</>;
};

export default PlaceholderCard;
