const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config({ path: "./../config.env" });

const sendCollaboratorInvite = async (options) => {
  const htmlTemplate = `
   <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invitation to Collaborate</title>
</head>
<body>
    <h1>You're Invited to Collaborate!</h1>
    <p>Dear ${options.name},</p>
    <p>As a collaborator, you’ll have the opportunity to contribute to the content, share ideas, and help us bring this book to life.</p>
    
    <p>Click the link below to accept the invitation and get started:</p>
    <p><a href="${options.inviteLink}" target="_blank">Accept Invitation</a></p>
    
    <p>If you have any questions or need further details, feel free to reach out to us at <a href="mailto:${process.env.EMAIL_ID}">${process.env.EMAIL_ID}</a>.</p>

    <p>We look forward to working with you!</p>

    <p>Best regards,<br>
    <strong>The Digi Library Team</strong></p>
</body>
</html>
`;

  const transporter = nodemailer.createTransport({
    port:465,
    service: "smtp.gmail.com",
    auth: {
      user: process.env.EMAIL_ID,
      pass: process.env.EMAIL_AUTH,
    },
    secure: true,
  });
  // console.log(transporter);
  const mailoptions = {
    from: process.env.EMAIL_ID,
    to: options.email,
    subject:
      options.subject || `Invitation to Collaborate on "${options.bookTitle}"`,
    html: htmlTemplate,
  };
  const res=await new Promise((resolve, reject) => {
    transporter.sendMail(mailoptions, (error, info) => {
      if (error) {
        console.log("Error sending email:", error);
        reject(error);
      } else {
        console.log("Email sent successfully:", info.response);
        resolve(info);
      }
    });
  });
  console.log("Mail sent successfully",res);
}
  // const res=await transporter.sendMail(mailoptions);
  // console.log("Mail sent successfully", res);

module.exports = sendCollaboratorInvite;
