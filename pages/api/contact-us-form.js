import nodemailer from 'nodemailer';
import validate from 'deep-email-validator';

async function handler(req, res) {
  const { email, message } = req.body;

  if (req.method === 'POST') {
    try {
      const isValidEmail = await validate(email);
      if (!isValidEmail) {
        throw new Error(`The provided email is invalid.`);
      }
    } catch (e) {
      return res.status(406).json({
        // 406 Not Acceptable
        message: `An error occured while validating the provided email: ${e.message || e}`,
        error: true
      });
    }
    try {
      // create reusable transporter object using the default SMTP transport
      const transporter = nodemailer.createTransport({
        host: 'smtp.abv.bg',
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD
        },
        tls: {
          rejectUnauthorized: false
        }
      });

      await transporter.sendMail({
        from: process.env.EMAIL_USERNAME,
        to: process.env.EMAIL_USERNAME,
        subject: `Received an email from stock-ranks 'Contact us' page. Email for reply: ${email}`,
        text: message
      });

      return res.status(200).json({
        // 200 OK
        message: `Successfully sent an email to us!`,
        error: false
      });
    } catch (e) {
      return res.status(500).json({
        // 500 Internal Server Error
        message: `An error occured while trying to send an email: ${e.message || e}`,
        error: true
      });
    }
  }
}

export default handler;
