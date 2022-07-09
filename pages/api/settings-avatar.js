import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function handler(req, res) {
  const data = req.body;

  try {
    await prisma.$connect();

    if (req.method === 'POST') {
      await prisma.user.update({
        where: {
          email: data.email
        },
        data: {
          avatarLink: data.resourceLink
        }
      });

      await prisma.$disconnect();

      return res.status(201).json({
        message: 'Successfully updated your avatar.',
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
