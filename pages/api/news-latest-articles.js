import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function handler(req, res) {
  if (req.method === 'POST') {
    const data = req.body;

    try {
      await prisma.$connect();

      if (data.takeAll) {
        const retreivedData = await prisma.latestArticle.findMany();

        return res.status(200).json({
          message: `Successfully retreived data from the database!`,
          dataLength: retreivedData.length,
          error: false
        });
      }

      const retreivedData = await prisma.latestArticle.findMany({
        skip: data.skip,
        take: data.take,
        orderBy: { id: 'desc' }
      });

      await prisma.$disconnect();

      if (retreivedData.length !== 0) {
        return res.status(200).json({
          message: `Successfully retreived data from the database!`,
          data: retreivedData,
          error: false
        });
      } else {
        throw new Error('There is no data in the database!');
      }
    } catch (e) {
      await prisma.$disconnect();

      return res.status(500).json({
        message: `An error occured: ${e.message || e}`,
        data: [],
        error: true
      });
    }
  }
}

export default handler;
