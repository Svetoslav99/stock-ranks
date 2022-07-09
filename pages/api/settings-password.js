import bcrypt from 'bcrypt';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function handler(req, res) {
  const data = req.body;

  try {
    await prisma.$connect();

    if (req.method === 'POST') {
      const user = await prisma.user.findUnique({
        where: {
          email: data.email
        }
      });

      const isSame = await bcrypt.compare(data.oldPassword, user.password);

      if (!isSame) {
        throw new Error(`The provided old password is wrong for registered user with email ${data.email}`);
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(data.newPassword, salt);

      await prisma.user.update({
        where: {
          email: data.email
        },
        data: {
          password: hashedPassword
        }
      });

      await prisma.$disconnect();

      return res.status(201).json({
        message: 'Successfully updated your password.',
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
