const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config({ path: './../config.env' });

const sendReviewerInvite = async (options) => {
    const htmlTemplate = `
   <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invitation to Review</title>
</head>
<body>
    <h1>You're Invited to Review!</h1>
    <p>Dear ${options.name},</p>
    <p>We are excited to invite you to review our book. Your insights and expertise will play a vital role in enhancing its quality and relevance.</p>
    
    <p>Click the link below to accept the invitation and start reviewing:</p>
    <p><a href="${options.inviteLink}" target="_blank">Accept Invitation</a></p>
    
    <p>If you have any questions or need further details, feel free to reach out to us at <a href="mailto:${process.env.EMAIL_ID}">${process.env.EMAIL_ID}</a>.</p>

    <p>We look forward to your valuable feedback!</p>

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
        subject: options.subject || `Invitation to Review "${options.bookTitle}"`,
        html: htmlTemplate
    };

    await transporter.sendMail(mailoptions);
};

module.exports = sendReviewerInvite;
