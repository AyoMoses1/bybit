// sendEmail.ts

import sgMail from "@sendgrid/mail";

// Set your SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export const sendEmail = async ({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) => {
  const msg = {
    to,
    from: "your-email@example.com", // Must be verified in your SendGrid account
    subject,
    html,
  };

  await sgMail.send(msg);
};
