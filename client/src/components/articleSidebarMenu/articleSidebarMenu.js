import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';

import { Menu, Icon, Dropdown, Input } from 'semantic-ui-react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import './articleSidebarMenu.css'

const ArticleSidebarMenu = ({ screen, articleData, userData }) => {

   const [state, setState] = useState({ copied: false });


   const isMobile = screen === 'mobile';
   const testUrl = 'https://www.npmjs.com/package/react-sharingbuttons'; // window.location.href

   return (
      <Menu
         fluid
         text={!isMobile}
         icon
         vertical={!isMobile}
         fixed={isMobile ? 'bottom' : null}
         widths={isMobile ? 3 : null}
      >
         <Menu.Item
            name='like'
         >
            <Icon color='red' name='like' />
         </Menu.Item>
         <Menu.Item
            name='bookmark'
         >
            <Icon name='bookmark' />
         </Menu.Item>


         <Dropdown item icon="share alternate" floating direction={isMobile ? 'left' : null}>
            <Dropdown.Menu>
               <Dropdown.Item >
                  <CopyToClipboard
                     text={window.location.href}
                     onCopy={() => setState({ copied: true })}
                  >
                     <div className="ui left icon transparent mini input ">
                        <input readOnly value={window.location.href} size="10" />
                        <i className={`${state.copied ? 'check' : 'copy outline'} icon`}></i>
                     </div>

                  </CopyToClipboard>
               </Dropdown.Item>

               <Dropdown.Item>
                  <a target="_blank" rel="noreferrer" href={`https://twitter.com/intent/tweet?text="${articleData.title}" by ${userData.username}&url=${testUrl}`}>
                     Share to Twitter
                  </a>
               </Dropdown.Item>
               <Dropdown.Item>
                  <a target="_blank" rel="noreferrer" href={`https://www.linkedin.com/shareArticle?mini=true&url=${testUrl}&title=${articleData.title}`}>
                     Share to LinkedIn
                  </a>
               </Dropdown.Item>
               <Dropdown.Item>
                  <a target="_blank" rel="noreferrer" href={`https://www.facebook.com/sharer.php?u=${testUrl}`}>
                     Share to Facebook
                  </a>
               </Dropdown.Item>

            </Dropdown.Menu>
         </Dropdown>


      </Menu >
   )

}

export default ArticleSidebarMenu;
