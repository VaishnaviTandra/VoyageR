const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "vaishnavitandra17@gmail.com",
        pass: "khmajfejqoesewoh", // NOT normal password
      },
    });

   const mailOptions = {
  from: "VoyageR <vaishnavitandra17@gmail.com>",
  to,
  subject,
  html: `
  <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
    
    <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      
      <div style="background: #4CAF50; color: white; padding: 15px; text-align: center;">
        <h2>🎉 Booking Confirmed</h2>
      </div>

      <div style="padding: 20px; color: #333;">
        <p><b>Hotel:</b> JW Marriott Mumbai Juhu</p>
        <p><b>Location:</b> Mumbai</p>
        <p><b>Check-in:</b> 2026-04-15</p>
        <p><b>Check-out:</b> 2026-04-16</p>
        <p><b>Total Price:</b> ₹7497</p>
        <p><b>Payment Status:</b> 
          <span style="color: green; font-weight: bold;">Paid</span>
        </p>

        <hr style="margin: 20px 0;" />

        <p style="text-align: center;">
          Thank you for choosing <b>VoyageR ✈️</b>
        </p>
      </div>

    </div>

  </div>
  `,
};

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (err) {
    console.error("Email error:", err);
  }
};

module.exports = sendEmail;