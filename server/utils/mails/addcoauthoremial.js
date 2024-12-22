const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config({ path: './../config.env' });

const sendCoAuthorInvite = async (options) => {
    const htmlTemplate = `
   <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invitation to Co-Author</title>
</head>
<body>
    <h1>You're Invited to Co-Author!</h1>
    <p>Dear ${options.name},</p>
    <p>We are thrilled to invite you to co-author our book. Your expertise and creativity will be instrumental in shaping its content and making it a success.</p>
    
    <p>Click the link below to accept the invitation and start collaborating as a co-author:</p>
    <p><a href="${options.inviteLink}" target="_blank">Accept Invitation</a></p>
    
    <p>If you have any questions or need further details, feel free to reach out to us at <a href="mailto:${process.env.EMAIL_ID}">${process.env.EMAIL_ID}</a>.</p>

    <p>We can't wait to work with you!</p>

    <p>Best regards,<br>
    <strong>The Digi Library Team</strong></p>
</body>
</html>
`;

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_ID,
            pass: process.env.EMAIL_AUTH
        }
    });

    const mailoptions = {
        from: process.env.EMAIL_ID,
        to: options.email,
        subject: options.subject || `Invitation to Co-Author "${options.bookTitle}"`,
        html: htmlTemplate
    };

    await transporter.sendMail(mailoptions);
};

module.exports = sendCoAuthorInvite;
