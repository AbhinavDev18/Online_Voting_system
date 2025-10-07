import nodemailer from 'nodemailer';
import Voter from '../models/Voter.js';

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export const sendEmail = async (voterId, email) => {
    try {
        let otp = generateOTP();
        await Voter.findByIdAndUpdate(voterId, { verifyOTP: otp });
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.GMAIL_USERNAME,
                pass: process.env.GMAIL_PASSWORD
            }
        });
        let mailOptions = {
            from: process.env.GMAIL_USERNAME,
            to: email,
            subject: 'Verify your email',
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", otp),
        };
        const mailResponse = await transporter.sendMail(mailOptions);
        return mailResponse;
    }
    catch(error) {
        throw new Error(error.message);
    }
}

const VERIFICATION_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Verification - Online Voting System</title>
</head>
<body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color: #f4f4f4;">

  <!-- Container -->
  <table role="presentation" style="width:100%; border-collapse:collapse; background-color:#f4f4f4;">
    <tr>
      <td align="center" style="padding:20px 0;">

        <!-- Inner Card -->
        <table role="presentation" style="width:600px; max-width:100%; background-color:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td align="center" style="background:linear-gradient(to right, #1a73e8, #0c47a1); padding:30px;">
              <h1 style="color:#ffffff; margin:0; font-size:24px;">Online Voting System</h1>
              <p style="color:#dbe4f3; margin:5px 0 0; font-size:14px;">Secure • Transparent • Reliable</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:30px; color:#333333; font-size:16px; line-height:1.6;">
              <p>Dear Voter,</p>
              <p>To continue with your voting process, please verify your email address by entering the following One-Time Password (OTP):</p>

              <!-- OTP Code -->
              <div style="text-align:center; margin:30px 0;">
                <span style="display:inline-block; font-size:32px; font-weight:bold; color:#1a73e8; letter-spacing:6px; padding:12px 24px; border:2px dashed #1a73e8; border-radius:6px; background:#f0f7ff;">
                  {verificationCode}
                </span>
              </div>

              <p>This OTP will expire in <strong>15 minutes</strong> for security reasons. Please do not share this code with anyone.</p>
              <p>If you did not initiate this request, you can safely ignore this email.</p>

              <p style="margin-top:30px;">Thank you,<br>The Election Commission Team</p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="background-color:#f9f9f9; padding:20px; font-size:12px; color:#777;">
              <p style="margin:0;">This is an automated message. Please do not reply to this email.</p>
              <p style="margin:5px 0 0;">© 2025 Online Voting System. All rights reserved.</p>
            </td>
          </tr>
        </table>
        <!-- End Inner Card -->

      </td>
    </tr>
  </table>
  <!-- End Container -->

</body>
</html>
`;
