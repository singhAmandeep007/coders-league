import React from 'react'

import ContactForm from './../../components/contactForm/contactForm';


function ContactPage({ currentUser }) {
   return (
      <div style={{ marginTop: '1em' }}>
         <h2 className="ui center aligned icon header">
            <i className="circular question icon"></i>
            <div className="ui horizontal divider">
               Describe the help you need.
            </div>
         </h2>

         <div className="column" style={{ maxWidth: 450, margin: '0 auto' }}>

            <ContactForm type='help' currentUser={currentUser} />

         </div>

      </div>

   )
}

export default ContactPage
