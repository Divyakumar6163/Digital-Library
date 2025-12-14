const sgMail = require("@sendgrid/mail");
const dotenv = require('dotenv');

dotenv.config({ path: './../config.env' });

const sendmail = async (options) => {
    const htmlTemplate = `
    <h2>Dear ${options.name},</h2>
        <p>Welcome to Digi Library!</p>

        <p>Thank you for registering with us. Please verify your email address to activate your account.</p>

        <a href="${options.verificationLink}" style="display: inline-block; padding: 10px 15px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">Verify Email Address</a>

        <p>This link will expire in 1 hours.</p>
    </body>
    </html>`;

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      const msg = {
        to: options.email,
        from: process.env.EMAIL_ID,
        subject:
        options.subject || 'Please verify your email address',
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
