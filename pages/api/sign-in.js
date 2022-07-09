import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function handler(req, res) {
  const data = req.body;

  try {
    if (req.method === 'POST') {
      await prisma.$connect();
      
      const user = await prisma.user.findUnique({
        where: {
          email: data.email
        }
      });

      if (!user) {
        throw new Error(`There is no registered user with this email.`);
      }

      const isValid = await bcrypt.compare(data.password, user.password);

      if (isValid) {
        await prisma.$disconnect();

        return res.status(201).json({
          message: `Successfully authenticated user.`,
          user,
          error: false
        });
      } else {
        throw new Error(`Incorrect email or password.`);
      }
    }
  } catch (e) {
    await prisma.$disconnect();

    return res.status(500).json({
      message: `An error occured: ${e.message || e}`,
      error: true
    });
  }
}

export default handler;
