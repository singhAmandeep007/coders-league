import React from 'react';
import { Link, useLocation } from 'react-router-dom';


const NotFoundPage = () => {
   let location = useLocation();
   //console.log(location);
   return (
      <div className="ui one column stackable center aligned  grid segment red inverted" style={{ height: '87.5vh', width: '100vw', margin: '0', borderRadius: '0em' }}>
         <div className="column twelve wide">

            <h2 className="ui icon header">
               <i className="bug icon"></i>
               <div className="content">
                  Not Found
               </div>
            </h2>
            <div className="ui message large  red">

               <div className="header">Description</div>
               <p>Page for path <b><i><code>{location.pathname}</code></i></b> does not exist.</p>
               <p>How you got here is a mystery. But you can click the button below to go back to the homepage or contact us.</p>
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
   );
}

export default NotFoundPage;