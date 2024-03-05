import React, { useRef } from "react";
import { Dropdown } from "semantic-ui-react";
import { tagOptions, expertiseOptions, sortOptions } from "./../../common/dropdownOptions";

const ArticleSearchWidget = ({ search, reset }) => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const inputRef = useRef("");
  const tagsRef = useRef([]);
  const expertiseLevelRef = useRef("");
  const sortRef = useRef("");

  const handleSearch = () => {
    let searchTerm = inputRef.current.value.trim();
    let searchTags = tagsRef.current.state.value;
    let searchExpertiseLevel = expertiseLevelRef.current.state.value;
    let sortBy = sortRef.current.state.value;

    if (!searchTerm && searchTags.length === 0 && searchExpertiseLevel.length === 0 && !sortBy) {
      return;
    }
    search(searchTerm, searchTags, searchExpertiseLevel, sortBy);
  };

  const handleReset = () => {
    inputRef.current.value = "";
    tagsRef.current.state.value = [];
    expertiseLevelRef.current.state.value = "";
    sortRef.current.state.value = "";
    reset();
  };

  return (
    <div>
      <h5 className="ui top attached header">
        Filter
        <i
          className={`angle ${!isCollapsed ? "up" : "down"} icon`}
          style={{ float: "right", marginRight: "0px" }}
          onClick={() => setIsCollapsed(!isCollapsed)}
        ></i>
      </h5>

      <div className={`ui secondary bottom attached segment ${isCollapsed ? "hiddenCustom" : ""}`}>
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
          placeholder="Tags ..."
          ref={tagsRef}
          lazyLoad={true}
        />
        <br />
        <Dropdown
          fluid
          clearable
          selection
          options={expertiseOptions}
          placeholder="Expertise ..."
          ref={expertiseLevelRef}
          lazyLoad={true}
        />
        <br />
        <Dropdown
          fluid
          clearable
          options={sortOptions}
          selection
          placeholder="Sort ..."
          ref={sortRef}
          lazyLoad={true}
        />

        <br />
        <div
          className="ui button primary tiny"
          onClick={() => handleSearch()}
        >
          Search
        </div>
        <div
          className="ui button tiny"
          onClick={() => handleReset()}
        >
          Reset
        </div>
      </div>
    </div>
  );
};

export default ArticleSearchWidget;
