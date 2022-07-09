const { PrismaClient } = require('@prisma/client');

const { EarningsCalendarScraper } = require('../../calendar scrapers/earnings-calendar-scraper');

const prisma = new PrismaClient();

(async () => {
  // module.exports = async function earningsCalendarUpload(date) {
  try {
    const date = '2022-07-08';
    const data = await EarningsCalendarScraper(date); // format YYYY-MM-DD
    console.log('data: ', data);
    if (!data) {
      throw new Error('Something went wrong when trying to scrape the earnings calendar!');
    }

    if (!data.length === 0) {
      console.log('[Upload Earnings Calendar] There is no data for the current date provided:', date);
      return;
    }

    // remove duplicates
    const filteredData = data.filter((item, index) => data.indexOf(item) === index);

    await prisma.$connect();

    // get data from the db for the same day
    const retreivedData = await prisma.earningsCalendar.findMany({
      where: {
        dateEarnings: new Date(date).toISOString()
      }
    });

    if (retreivedData.length !== 0) {
      // update
      for (const dataObj of retreivedData) {
        await prisma.earningsCalendar.updateMany({
          where: {
            dateEarnings: new Date(date).toISOString(),
            symbolEarnings: dataObj.symbolEarnings
          },
          data: filteredData.find((obj) => obj.symbolEarnings === dataObj.symbolEarnings)
        });
      }

      if (retreivedData.length !== filteredData.length) {
        // find out which objects are not in the db and add them
        const missingObjects = filteredData.filter((e) => {
          let findIndex = retreivedData.findIndex((a) => {
            return a.symbolEarnings === e.symbolEarnings;
          });
          return findIndex === -1;
        });

        await prisma.earningsCalendar.createMany({
          data: missingObjects
        });
      }
    } else {
      // create new records
      await prisma.earningsCalendar.createMany({
        data: filteredData
      });
    }

    await prisma.$disconnect();
    console.log('[Upload Earnings Calendar] Successfully updated earnings calendar!');
  } catch (e) {
    await prisma.$disconnect();
    console.log('[Upload Earnings Calendar] An error occured: ', e.message || e);
  }
  // };
})();
