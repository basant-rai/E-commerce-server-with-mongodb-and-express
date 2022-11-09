const nodemailer = require("nodemailer");


const sendEmail =async(mailoptions)=>{
    var transport = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD
        }
      });
    
      const message ={
        from: mailoptions.from,
        to: mailoptions.to,
        subject: mailoptions.subject,
        text: mailoptions.text,
        html:mailoptions.html
    
       
      };
      await transport.sendMail(message)

}

module.exports = sendEmail

