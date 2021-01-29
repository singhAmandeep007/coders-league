import React, { useRef } from 'react';
import { Dropdown } from 'semantic-ui-react';
import tagOptions from './../../common/tagOptions';

const ArticleSearchWidget = ({ search, reset }) => {

   const inputRef = useRef('');
   const tagsRef = useRef([]);

   const handleSearch = () => {
      let searchTerm = inputRef.current.value.trim();
      let searchTags = tagsRef.current.state.value;
      if (!searchTerm && searchTags.length === 0) {
         return;
      }
      search(searchTerm, searchTags)
   }

   const handleReset = () => {
      inputRef.current.value = '';
      tagsRef.current.state.value = [];
      reset()
   }

   return (

      <div className="ui secondary black segment">
         <div className="ui fluid icon input">
            <i className="search icon"></i>
            <input
               type="text"
               ref={inputRef}
               placeholder="Search by title..."
            />
         </div>
         <br />
         <Dropdown
            fluid
            multiple
            search
            selection
            options={tagOptions}
            placeholder='Search by tags...'
            ref={tagsRef}
         />
         <br />
         <div className="ui button" onClick={() => handleSearch()}>Search</div>
         <div className="ui button" onClick={() => handleReset()}>Reset</div>
      </div>
   )
}

export default ArticleSearchWidget;
