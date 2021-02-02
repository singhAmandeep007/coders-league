import React, { useRef } from 'react';
import { Dropdown } from 'semantic-ui-react';
import { tagOptions, expertiseOptions } from './../../common/dropdownOptions';

const ArticleSearchWidget = ({ search, reset }) => {

   const inputRef = useRef('');
   const tagsRef = useRef([]);
   const expertiseLevelRef = useRef('');
   const sortRef = useRef('');


   const handleSearch = () => {
      let searchTerm = inputRef.current.value.trim();
      let searchTags = tagsRef.current.state.value;
      let searchExpertiseLevel = expertiseLevelRef.current.state.value;
      let sortBy = sortRef.current.state.value;

      if (!searchTerm && searchTags.length === 0 && searchExpertiseLevel.length === 0 && !sortBy) {
         return;
      }
      search(searchTerm, searchTags, searchExpertiseLevel, sortBy);
   }

   const handleReset = () => {
      inputRef.current.value = '';
      tagsRef.current.state.value = [];
      expertiseLevelRef.current.state.value = '';
      sortRef.current.state.value = '';
      reset()
   }

   const sortOptions = [
      { key: 'default', text: 'Default', value: '' },
      { key: 'likeCounts', text: 'Likes: Low to High', value: 'likeCounts' },
      { key: '-likeCounts', text: 'Likes: High to Low', value: '-likeCounts' },
      { key: '-createdAt', text: 'Latest Published', value: '-createdAt' },
   ]

   return (

      <div className="ui secondary black segment">
         <div className="ui fluid icon input">
            <i className="search icon"></i>
            <input
               type="text"
               ref={inputRef}
               placeholder="Title..."
            />
         </div>
         <br />
         <Dropdown
            fluid
            multiple
            search
            selection
            options={tagOptions}
            placeholder='Tags ...'
            ref={tagsRef}
            lazyLoad={true}
         />
         <br />
         <Dropdown
            fluid
            clearable
            selection
            options={expertiseOptions}
            placeholder='Expertise ...'
            ref={expertiseLevelRef}
            lazyLoad={true}
         />
         <br />
         <Dropdown
            fluid
            clearable
            options={sortOptions}
            selection
            placeholder='Sort ...'
            ref={sortRef}
            lazyLoad={true}
         />

         <br />
         <div className="ui button primary tiny" onClick={() => handleSearch()}>Search</div>
         <div className="ui button tiny" onClick={() => handleReset()}>Reset</div>
      </div>
   )
}

export default ArticleSearchWidget;
