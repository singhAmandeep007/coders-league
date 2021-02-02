import React, { useState } from 'react';
import { Dropdown, Container, Menu, Segment, Visibility } from 'semantic-ui-react';
import { NavLink, Link } from 'react-router-dom';

const DesktopHeader = ({ leftItems, rightItems }) => {

   const [fixed, setFixed] = useState(false);

   return (
      <header>

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
                  secondary={!fixed}
                  size='large'
                  borderless
                  style={{ margin: "0em" }}
               >
                  <Container>

                     <Menu.Item as={Link} to="/" >
                        <img src={fixed ? '/images/logoCLsvgBlack.svg' : '/images/logoCLsvg.svg'} alt="logodesktopw" />
                     </Menu.Item>

                     {leftItems.map(item => {
                        return <Menu.Item as={NavLink} exact {...item} />
                     })}

                     <Menu.Menu position="right">

                        {rightItems && rightItems.map(item => {
                           if (item.content === 'Theme') {
                              return (
                                 <Dropdown floating text="🎨" item key={item.key}>
                                    <Dropdown.Menu >
                                       {item.options.map(option => {
                                          return <Dropdown.Item
                                             style={{ textAlign: "center" }}
                                             onClick={() => option.setTheme()}
                                             text={option.text}
                                             key={option.key} />
                                       })}
                                    </Dropdown.Menu>
                                 </Dropdown>
                              )
                           }

                           if (item.to === "/signup" || item.to === "/login") {
                              return <Menu.Item as={NavLink} exact {...item} />
                           }
                           if (item.to === "/profile") {
                              return (
                                 <Dropdown floating item text={item.content} key={item.key}>
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
                  </Container>
               </Menu>
            </Segment>
         </Visibility>


      </header>
   );
}

export default DesktopHeader;