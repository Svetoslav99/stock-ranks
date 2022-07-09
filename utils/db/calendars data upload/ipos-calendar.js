const { PrismaClient } = require('@prisma/client');

const { IPOsCalendarScraper } = require('../../calendar scrapers/ipos-calendar-scraper');

const prisma = new PrismaClient();

// (async () => {
module.exports = async function iposCalendarUpload(date) {
  try {
    // const date = '2022-07-06';
    const data = await IPOsCalendarScraper(date); // format YYYY-MM-DD
    console.log('data: ', data);

    if (!data) {
      throw new Error('Something went wrong when trying to scrape the IPOs calendar!');
    }

    if (!data.length === 0) {
      console.log('[Upload IPOs Calendar] There is no data for the current date provided:', date);
      return;
    }

    // remove duplicates
    const filteredData = data.filter((item, index) => data.indexOf(item) === index);

    await prisma.$connect();

    // get data from the db for the same day
    const retreivedData = await prisma.iPOsCalendar.findMany({
      where: {
        dateIPOs: new Date(date).toISOString()
      }
    });

    if (retreivedData.length !== 0) {
      // update
      for (const dataObj of retreivedData) {
        await prisma.iPOsCalendar.updateMany({
          where: {
            dateIPOs: new Date(date).toISOString(),
            symbolIPOs: dataObj.symbolIPOs
          },
          data: filteredData.find((obj) => obj.symbolIPOs === dataObj.symbolIPOs)
        });
      }

      if (retreivedData.length !== filteredData.length) {
        // find out which objects are not in the db and add them
        const missingObjects = filteredData.filter((e) => {
          let findIndex = retreivedData.findIndex((a) => {
            return a.symbolIPOs === e.symbolIPOs;
          });
          return findIndex === -1;
        });

        await prisma.iPOsCalendar.createMany({
          data: missingObjects
        });
      }
    } else {
      // create new records
      await prisma.iPOsCalendar.createMany({
        data: filteredData
      });
    }

    await prisma.$disconnect();
    console.log('[Upload IPOs calendar] Successfully updated IPOS calendar!');
  } catch (e) {
    await prisma.$disconnect();
    console.log('[Upload IPOs calendar] An error occured: ', e.message || e);
  }
};
// })();
