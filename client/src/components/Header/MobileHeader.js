import React, { useState } from 'react';
import { Sidebar, Menu, Segment, Icon, Dropdown, Visibility } from 'semantic-ui-react';
import { NavLink, Link } from 'react-router-dom';

import './MobileHeader.css';

const MobileHeader = ({ children, leftItems, rightItems }) => {
   console.log(rightItems);

   const [sidebarOpened, setSidebarOpened] = useState(null)
   const [fixed, setFixed] = useState(false);

   return (

      <Sidebar.Pushable >
         <Sidebar
            as={Menu}
            animation='overlay'
            inverted
            onHide={() => setSidebarOpened(false)}
            vertical
            visible={sidebarOpened}
            borderless
            // icon='labeled'
            width="thin"
         >

            <Menu.Item header >
               <img src="/images/logoCLsvg.svg" alt="logomobile" className="ui mini right spaced image" />
               <strong>     <span style={{ fontSize: '1.2em' }} className="header-logo">&nbsp;&nbsp;Coders League</span></strong>
            </Menu.Item>

            {leftItems.map(item => {
               return <Menu.Item as={NavLink} exact color="blue" {...item} />
            })}
         </Sidebar>


         <Sidebar.Pusher dimmed={sidebarOpened} >

            <Visibility
               once={false}
               onBottomPassed={() => setFixed(true)}
               onBottomPassedReverse={() => setFixed(false)}
            >
               <Segment
                  inverted
                  vertical
                  basic
               >
                  <Menu
                     fixed={fixed ? 'top' : null}
                     inverted={!fixed}
                     borderless
                     secondary={!fixed}
                     style={{ paddingLeft: '1em', paddingRight: '1em' }}
                  // style={{ padding: "0.6em" }}
                  // style={{ margin: "0em" }}
                  // size='large'
                  >

                     <Menu.Item key="siddebaricon" >
                        <Icon name='sidebar' fitted size="large" onClick={() => setSidebarOpened(true)} />
                     </Menu.Item>
                     <Menu.Item key="logoimage" as={Link} to="/" >
                        <img src={fixed ? '/images/logoCLsvgBlack.svg' : '/images/logoCLsvg.svg'} alt="logodesktop" />
                     </Menu.Item>
                     <Menu.Menu position='right' >
                        {rightItems && rightItems.map(item => {
                           if (item.content === 'Theme') {
                              return (

                                 <Dropdown floating text="🎨" item key={item.key}>
                                    <Dropdown.Menu>
                                       {item.options.map(option => {
                                          return <Dropdown.Item
                                             style={{ textAlign: "center" }}
                                             onClick={() => option.setTheme()}
                                             text={option.text}
                                             key={option.key}
                                          />
                                       })}
                                    </Dropdown.Menu>
                                 </Dropdown>

                              )
                           }
                           if (item.to === "/signup" || item.to === "/login") {
                              return <Menu.Item as={NavLink} color='blue' exact {...item} />
                           }
                           if (item.to === "/profile") {
                              return (
                                 <Dropdown item floating text={item.content} key={item.key}>
                                    <Dropdown.Menu>
                                       {item.options.map(option => {
                                          if (option.to === "/logout") {
                                             return <Dropdown.Item onClick={() => option.logout()} text={option.text} icon={option.icon} key={option.key} />
                                          }
                                          return <Dropdown.Item as={NavLink} {...option} />
                                       })}
                                    </Dropdown.Menu>
                                 </Dropdown>
                              )
                           }

                           return null;
                        })}
                     </Menu.Menu>

                  </Menu>

               </Segment>
            </Visibility>

            {children}

         </Sidebar.Pusher>
      </Sidebar.Pushable>

   )

}


export default MobileHeader;