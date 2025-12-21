const otpEmailTemplate = (otp, userEmail) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>OTP Verification</title>
  </head>
  <body style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding: 30px 15px;">
          <table width="100%" max-width="420" style="background:#ffffff; border-radius:8px; padding:30px;">
            
            <!-- Header -->
            <tr>
              <td align="center" style="padding-bottom:20px;">
                <h2 style="margin:0; color:#333;">🔐 OTP Verification</h2>
              </td>
            </tr>

            <!-- Message -->
            <tr>
              <td style="color:#555; font-size:15px; line-height:1.6;">
                Hello,<br/><br/>
                We received a request to reset your password for your <b>To-Do App</b> account.
                Please use the OTP below to continue.
              </td>
            </tr>

            <!-- OTP Box -->
            <tr>
              <td align="center" style="padding:25px 0;">
                <div style="
                  background:#f1f5ff;
                  color:#2d5bff;
                  font-size:32px;
                  font-weight:bold;
                  letter-spacing:6px;
                  padding:15px 30px;
                  border-radius:6px;
                  display:inline-block;
                ">
                  ${otp}
                </div>
              </td>
            </tr>

            <!-- Expiry -->
            <tr>
              <td style="color:#777; font-size:14px;">
                ⏰ This OTP is valid for <b>1 minutes</b> only.
              </td>
            </tr>

            <!-- Warning -->
            <tr>
              <td style="padding-top:20px; color:#999; font-size:13px;">
                If you did not request this, please ignore this email.
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding-top:30px; text-align:center; font-size:12px; color:#aaa;">
                © ${new Date().getFullYear()} To-Do App<br/>
                This is an automated message. Please do not reply.
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
};

export default otpEmailTemplate;
