import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function handler(req, res) {
  const data = req.body;

  try {
    await prisma.$connect();

    if (req.method === 'POST') {
      const userExist = await prisma.user.findUnique({
        where: {
          email: data.email
        }
      });

      if (userExist) {
        throw new Error(`User with email ${data.email} already exists!`);
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(data.password, salt);

      const insertUser = await prisma.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          username: data.email,
          avatarLink: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/1024px-User-avatar.svg.png'
        }
      });

      if (!insertUser || insertUser instanceof Error) {
        throw new Error(`An error occured while trying to insert new user into the database. ${insertUser}`);
      }

      await prisma.$disconnect();

      return res.status(201).json({
        message: `Successfully inserted new user into the database!`,
        error: false
      });
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
