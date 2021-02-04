import React, { useState } from 'react';
import { Menu } from 'semantic-ui-react';

const ArticleSearchByTimeMenu = ({ searchTime }) => {

   const [state, setState] = useState({ activeItem: 'Feed' })

   const handleItemClick = (name) => {
      console.log(name)
      setState({ activeItem: name })
      if (name === 'Feed') {
         searchTime('')
      }
      if (name === 'Week') {
         searchTime(new Date(new Date().setDate(new Date().getDate() - 7)))
      }
      if (name === 'Month') {
         searchTime(new Date(new Date().setDate(new Date().getDate() - 30)))
      }
      if (name === 'Year') {
         searchTime(new Date(new Date().setDate(new Date().getDate() - 365)))
      }
   }

   return (
      <Menu tabular fluid style={{ marginBottom: '1em' }}>
         <Menu.Item
            active={state.activeItem === 'Feed'}
            name='Feed'
            onClick={() => handleItemClick('Feed')}
         >Feed
         </Menu.Item>

         <Menu.Item
            name='Week'
            active={state.activeItem === 'Week'}
            onClick={() => handleItemClick('Week')}
         />
         <Menu.Item
            name='Month'
            active={state.activeItem === 'Month'}
            onClick={() => handleItemClick('Month')}
         />
         <Menu.Item
            name='Year'
            active={state.activeItem === 'Year'}
            onClick={() => handleItemClick('Year')}
         />
      </Menu>
   )
}

export default ArticleSearchByTimeMenu
