import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import generator from 'generate-password';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();

async function handler(req, res) {
  const data = req.body;
  let newPassword = '';

  if (req.method === 'POST') {
    try {
      await prisma.$connect();

      const user = await prisma.user.findUnique({
        where: {
          email: data.email
        }
      });

      if (!user) {
        throw new Error(`There is no registered user with this email.`);
      }

      newPassword = await generatePassword();
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      await prisma.user.update({
        where: {
          email: data.email
        },
        data: {
          password: hashedPassword
        }
      });

      await prisma.$disconnect();
    } catch (e) {
      await prisma.$disconnect();

      return res.status(500).json({
        message: `An error occured while working with the database: ${e.message || e}`,
        error: true
      });
    }
    try {
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
        to: data.email,
        subject: `Requested password reset.`,
        html: `<p>Password reset requested for your stock-ranks account. Your new randomly generated password is: </p> </br> 
                <h3>${newPassword}</h3> </br>
                <p>If you wish to change it, please log into the application and navigate to your profile page. From there you can update your password for the future. </p> </br></br>
                <h4>Best Regards,</h4> </br>
                <h4>stock-ranks team </h4>
                `
      });

      return res.status(200).json({
        // 200 OK
        message: `Successfully sent an email with a new password to ${data.email}`,
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

const generatePassword = async () => {
  return generator.generate({
    length: 16,
    numbers: true,
    symbols: false,
    lowercase: true,
    uppercase: true,
    strict: true
  });
};
