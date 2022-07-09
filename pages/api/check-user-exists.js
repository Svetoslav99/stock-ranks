import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function handler(req, res) {
  const data = req.body;

  try {
    if (req.method === 'POST') {
      // check for logging in with different provider than credentials provider.
      // Since we don`t have an account for this user - we will create him one the first time he logs in our app.
      // After that, every time he logs, it will again try to sign up but will resolve in already having such account in the db.
      const userExist = await prisma.user.findUnique({
        where: {
          email: data.email
        }
      });

      if (userExist) {
        await prisma.$disconnect();
        return res.status(201).json({
          message: `User with such email already exists.`,
          error: false
        });
      }

      const insertUser = await prisma.user.create({
        data: {
          email: data.email,
          username: data.name,
          avatarLink: data.image
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
