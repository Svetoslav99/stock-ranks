const { PrismaClient } = require('@prisma/client');

const { MarketWatchScraper } = require('../../news scraper/marketwatch-scraper');

const prisma = new PrismaClient();

module.exports = async function newsUpload() {
  try {
    await prisma.$connect();
    // get latest data string from the db
    const latestArticle = await prisma.latestArticle.findMany({
      take: 1,
      orderBy: { scrapedTimestamp: 'desc' }
    });

    console.log('latestArticle: ', latestArticle);

    const data = await MarketWatchScraper(latestArticle.uploadedArticleTimestamp); // format "Jun. 29, 2022 at 10:24 a.m. ET"
    // console.log('data here: ', data);

    if (data.error) {
      throw new Error(data.message);
    }

    if (data.topHeadlines.length === 0) {
      throw new Error('Something went wrong during scraping of the top headlines!');
    }

    // drop everything from news headlines since this collection will always only have  the latest scraped news
    await prisma.newsTopHeadline.deleteMany({});

    // create new records
    await prisma.newsTopHeadline.createMany({
      data: data.topHeadlines
    });

    if (data.latestArticles.length === 0) {
      throw new Error('Something went wrong during scraping of the latest articles!');
    }

    // create new records
    await prisma.latestArticle.createMany({
      data: data.latestArticles
    });

    await prisma.$disconnect();
    console.log('[Upload marketwatch news] Successsfully updated the news!');
  } catch (e) {
    await prisma.$disconnect();
    console.log('[Upload marketwatch news] An error occured: ', e.message || e);
  }
};
