const { PrismaClient } = require('@prisma/client');

const { Top100CoinsScraper } = require('../../crypto events scraper/top-100-coins-scraper');

const prisma = new PrismaClient();

// Self involking function expression
module.exports = async function cryptoEventsUpload() {
  try {
    const data = await Top100CoinsScraper(); // format YYYY-MM-DD
    console.log('data here: ', data);
    await prisma.$connect();

    if (!data) {
      throw new Error('Something went wrong scraping events data of the top 100 coins.');
    }

    // drop old data
    await prisma.cryptoEvent.deleteMany({});

    // create new records
    await prisma.cryptoEvent.createMany({
      data: data
    });

    await prisma.$disconnect();
    console.log('[Upload top 100 coins] Succsessfully updated crypto events!');
  } catch (e) {
    await prisma.$disconnect();
    console.log('[Upload top 100 coins] An error occured: ', e.message || e);
  }
};
