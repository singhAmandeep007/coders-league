import React, { useRef } from 'react';
// import { Input, Button } from 'semantic-ui-react';


const ArticleSearchWidget = ({ search, reset }) => {

   const inputRef = useRef('');

   const handleSearch = () => {
      let searchTerm = inputRef.current.value;
      if (!searchTerm || searchTerm === '') {
         return reset()
      }
      search(searchTerm);
   }

   return (
      <>
         <div className="ui fluid icon input">
            <input
               type="text"
               ref={inputRef}
               placeholder="Search by title..."
            />
            <i className="inverted circular search link icon" onClick={handleSearch}></i>

         </div>
      </>


   )
}

export default ArticleSearchWidget;
