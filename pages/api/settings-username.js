import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function handler(req, res) {
  const data = req.body;

  try {
    await prisma.$connect();

    if (req.method === 'POST') {
      const user = await prisma.user.findUnique({
        where: {
          username: data.username
        }
      });

      if (user) {
        throw new Error(`Username is already taken.`);
      }

      await prisma.user.update({
        where: {
          email: data.email
        },
        data: {
          username: data.username
        }
      });

      await prisma.$disconnect();

      return res.status(201).json({
        message: 'Successfully updated your username.',
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
