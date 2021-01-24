import React from 'react';
import { Link } from 'react-router-dom';

const ErrorPage = () => {
   return (
      <div className="ui one column stackable center aligned  grid segment red inverted" style={{ height: '87.5vh', width: '100vw', margin: '0', borderRadius: '0em' }}>
         <div className="column twelve wide">

            <h2 className="ui icon header">
               <i className="exclamation triangle icon"></i>
               <div className="content">
                  404
                  </div>
            </h2>
            <div className="ui message large  red">

               <div className="header">Description</div>
               <p>Page you were trying to visit is <strong>not found</strong> or <strong>deleted.</strong></p>
               <div className="ui horizontal divider" style={{ paddingTop: '60px' }}>
                  👇
               </div>
               <Link to="/" className="link">
                  <button className="ui primary button">
                     Home
               </button>
               </Link>
               <Link to="/" className="link">
                  <button className="ui secondary button">
                     Contact Us
               </button>
               </Link>
            </div>


         </div>
      </div>
   )
}
export default ErrorPage;