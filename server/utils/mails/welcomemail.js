const sgMail = require("@sendgrid/mail");
const dotenv = require('dotenv');

dotenv.config({ path: './../config.env' });

const sendmail = async (options) => {
    const htmlTemplate = `
   <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Digi Library</title>
</head>
<body>
    <div>
        <h1>Welcome to Digi Library!</h1>
        <p>Dear ${options.name},</p>
        <p>We’re thrilled to have you join our growing community of book lovers, learners, and knowledge seekers. At Digi Library, we strive to provide you with a rich collection of resources, personalized recommendations, and a seamless reading experience.</p>
        
        <h2>Here’s what you can do next:</h2>
        <ul>
            <li><strong>Explore our Collection:</strong> Dive into thousands of eBooks, articles, and journals across various genres and subjects.</li>
            <li><strong>Personalize Your Experience:</strong> Update your profile and preferences to receive recommendations tailored just for you.</li>
        </ul>
        
        <p>We’re here to support you on your journey to discovery and learning. If you have any questions or need assistance, don’t hesitate to reach out to our support team at <a href="mailto:[${process.env.EMAIL_ID}"> this</a>.</p>
        
        <p>Thank you for choosing Digi Library. We look forward to helping you unlock a world of knowledge.</p>

        <p>Happy Reading!<br><br>
        Best regards,<br>
        The Digi Library Team</p>
    </div>
</body>
</html>
`;

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      const msg = {
        to: options.email,
        from: process.env.EMAIL_ID,
        subject: options.subject || `Welcome to Digi Library, ${options.name}!`,
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
