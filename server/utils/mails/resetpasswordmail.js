const sgMail = require("@sendgrid/mail");
const dotenv = require('dotenv');

dotenv.config({ path: './../config.env' });

const sendmail = async (options) => {
    const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Password Reset</title>
    </head>
    <body>
        <h2>Dear ${options.name},</h2>
        <p>Greetings from Digi Library!</p>

        <a href="${options.resetLink}">Please use the link below to reset your credentials. </a>

        <p>This link will expire in 15 minutes.</p>
        <p>If you did not request a password reset, you can safely ignore this message, and no changes will be made to your account.</p>
    </body>
    </html>`;


    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      const msg = {
        to: options.email,
        from: process.env.EMAIL_ID,
        subject: options.subject || 'Password Reset Request',
        html: htmlTemplate,
      };
      
      try {
        console.log("Email Msg: ", msg);
        const res=await sgMail.send(msg);
        console.log("SendGrid response:", res);
        console.log(`Invitation sent to ${options.email}`);
      } catch (error) {
        console.error("SendGrid error:", error.response?.body || error);
        throw error;
      }
    // const transporter = nodemailer.createTransport({
    //     service: "gmail",
    //     auth: {
    //         user: process.env.EMAIL_ID,
    //         pass: process.env.EMAIL_AUTH
    //     }
    // });

    // const mailoptions = {
    //     from: process.env.EMAIL_ID,
    //     to: options.email,
    //     subject: options.subject,
    //     html: htmlTemplate
    // };

    // await transporter.sendMail(mailoptions);
}

module.exports = sendmail;
