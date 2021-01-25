// building custom email templates with pug and sending real email with sendGrid(in prod env) and email using mailtrap and nodemailer (in dev env).

const nodemailer = require('nodemailer');
const pug = require('pug');
const { htmlToText } = require('html-to-text');
// to generate a functionality where we can simply do this -> new Email(user,url).sendWelcome(); or sendPasswordReset 
// so for different scenerios and use cases we can customise our email
module.exports = class Email {
   constructor(user, url) {
      this.to = user.email;
      this.firstName = user.fullname.split(' ')[0];
      this.url = url;
      // we can easily customise email to send from
      this.from = `CodersLeague <${process.env.EMAIL_FROM}>`;
   }
   // have different transport for prod and dev
   newTransport() {
      // for prod env. use sendgrid
      if (process.env.NODE_ENV === 'production') {
         // free plan 100/day
         return nodemailer.createTransport({
            service: 'SendGrid',
            auth: {
               user: process.env.SENDGRID_USERNAME,
               pass: process.env.SENDGRID_PASSWORD
            }
         });
      }
      // for dev env. use mailtrap
      return nodemailer.createTransport({
         host: process.env.EMAIL_HOST,
         port: process.env.EMAIL_PORT,
         auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
         }
         // for gmail: Activate in gmail "less secure app" option
      })

   }
   // to create diff emails for diff situations
   async send(template, subject) {
      // send the actual email
      // 1) render HTML for email based on pug template
      //renderFile -Compile a Pug template from a file and render it with locals to html string. and passing in locals to pug file
      const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
         firstName: this.firstName,
         url: this.url,
         subject: subject
      })
      // 2) define the email options
      const mailOptions = {
         from: this.from,
         to: this.to,
         subject: subject,
         html: html,
         // convert html string to text
         text: htmlToText(html)
      };
      // 3) create a transport and send email
      await this.newTransport().sendMail(mailOptions);

   }
   // abstraction
   async sendWelcome() {
      await this.send('welcome', 'Welcome to the CodersLeague Network!');
   }
   // paswordReset email
   async sendPasswordReset() {
      await this.send('passwordReset', 'Your password reset token (valid for only 10 minutes)');
   }
}