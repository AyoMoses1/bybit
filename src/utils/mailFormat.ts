export const generateEmailTemplate = (): string => {
  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Poppins:wght@600&display=swap" rel="stylesheet" />
    </head>
    <body style="margin: 0; padding: 40px 0; background-color: #fef9fc; font-family: 'Inter', sans-serif; text-align: center;">
      <img src="https://res.cloudinary.com/djsfi0uiv/image/upload/v1744814374/20250225_sbhhru.svg" alt="KOLORIDE" style="height: 40px; margin-bottom: 30px;" />

      <h2 style="font-family: 'Poppins', sans-serif; color: #1a1a1a; font-weight: 300; margin-bottom: 10px; font-size: 38px;">
        Invitation to Join<br />KoloRide as a Fleetadmin
      </h2>

<div style="background: #fff; font-family: 'Inter', sans-serif; max-width: 520px; margin: 30px auto; border: 1px solid #DDE1E6; border-radius: 10px; padding: 30px; color: #5E5E5E;">

        <p style="color: #5E5E5E; font-size: 16px; margin-bottom: 20px;font-weight: 300;">
         
          You've been invited by an admin to join <a href="${"https://koloride-admin-fiht.vercel.app"}" style="color: #5E5E5E;">${"Koloride Admin"}</a> as a fleetadmin.
        </p>

        <p style="font-size: 16px; color: #5E5E5E; margin-bottom: 25px;font-weight: 400;">
          To continue, kindly reset your password
        </p>

        <a href="${"https://koloride-840e1.web.app/forgot-password"}"
           style="display: inline-block; background-color: #913B81; color: #fff; font-weight: 600;
                  text-decoration: none; border-radius: 30px; padding: 12px 28px; font-size: 14px;">
          Reset Password
        </a>

      
      </div>

      <div style="margin-top: 40px; font-size: 14px; color: #666;">
    
        <p style="margin: 5px 0;">Copyright © ${new Date().getFullYear()}</p>
        <p style="font-weight: bold; margin: 5px 0;">KoloRide</p>
        <p style="margin: 5px 0;">Trust The Process</p>
      </div>
    </body>
  </html>
  `;
};
