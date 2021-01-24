import React from 'react';
import { Placeholder } from 'semantic-ui-react';

const PlaceholderComment = ({ num = 1 }) => {

   let placeholderComments = Array.from(Array(num), (e, i) => {

      return (<div key={i}>
         <Placeholder.Line length="very short" />
         <Placeholder.Line length="full" />
      </div>)
   })

   return (
      <Placeholder fluid>
         {placeholderComments}
      </Placeholder>
   )
}
export default PlaceholderComment; 