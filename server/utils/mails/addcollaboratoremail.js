const sgMail = require("@sendgrid/mail");
const dotenv = require("dotenv");

dotenv.config({ path: "./../config.env" });


const sendCollaboratorInvite = async (options) => {
  const htmlTemplate = `
  <!DOCTYPE html>
  <html>
  <head>
  <meta charset="UTF-8" />
  <title>Invitation to Collaborate</title>
  </head>
  <body>
  <h1>You're Invited to Collaborate!</h1>
  <p>Dear ${options.name},</p>
  
  <p>
  As a collaborator, you’ll have the opportunity to contribute to the content,
  share ideas, and help us bring this book to life.
  </p>
  
  <p>Click below to accept the invitation:</p>
  <p>
  <a href="${options.inviteLink}" target="_blank">
  Accept Invitation
  </a>
  </p>
  
  <p>
  For questions, contact us at
  <a href="mailto:${process.env.EMAIL_ID}">
  ${process.env.EMAIL_ID}
  </a>
  </p>
  
  <p>
  Best regards,<br/>
  <strong>The Digi Library Team</strong>
  </p>
  </body>
  </html>
  `;
  
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: options.email,
    from: process.env.EMAIL_ID,
    subject:
    options.subject ||
    `Invitation to Collaborate on "${options.bookTitle}"`,
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
};

module.exports = sendCollaboratorInvite;
