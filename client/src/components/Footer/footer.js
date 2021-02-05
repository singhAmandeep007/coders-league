import React from 'react'

function Footer() {
   return (
      <div className="ui center aligned basic segment footer" style={{ width: '100%', height: '100%' }}>
         <div className="ui container">
            <p>
               Made with&nbsp;
               <i aria-hidden="true" className="red like icon"></i>
               &nbsp;in India.</p>
            <div className="ui divider"></div>
         </div>
         <div role="list" className="ui divided horizontal inverted list">

            <div role="listitem" className="item">
               <a href="https://github.com/amandeepmicro" title="Amandeep Github Account" target="_blank" rel="noopener noreferrer" >
                  <i aria-hidden="true" className="github large link icon"></i>
               </a>
            </div>

            <div role="listitem" className="item">
               <a href="mailto: amandeepmicro0803@gmail.com" title="Mail" target="_blank" rel="noopener noreferrer" >
                  <i aria-hidden="true" className="mail outline large link icon"></i>
               </a>
            </div>

            <div role="listitem" className="item">
               <a href="https://www.linkedin.com/in/amandeep-singh-0803/" title="Amandeep LinkedIn Account" target="_blank" rel="noopener noreferrer" >
                  <i aria-hidden="true" className="linkedin large link icon"></i>
               </a>
            </div>

         </div>
      </div>
   )
}

export default Footer;
