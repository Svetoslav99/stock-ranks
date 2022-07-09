const { PrismaClient } = require('@prisma/client');

const { EconomicEventsCalendarScraper } = require('../../calendar scrapers/economic-events-calendar');

const prisma = new PrismaClient();

// (async () => {
module.exports = async function economicEventsCalendarUpload(date) {
  try {
    // const date = '2022-07-07';
    const data = await EconomicEventsCalendarScraper(date); // format YYYY-MM-DD

    if (!data) {
      throw new Error('Something went wrong when trying to scrape the economic events calendar!');
    }

    if (!data.length === 0) {
      console.log('[Upload Economic Events Calendar] There is no data for the current date provided:', date);
      return;
    }

    // remove duplicates
    const filteredData = data.filter((item, index) => data.indexOf(item) === index);

    await prisma.$connect();

    // get data from the db for the same day
    const retreivedData = await prisma.economicEventsCalendar.findMany({
      where: {
        dateEconomicEvent: new Date(date).toISOString()
      }
    });
 
    if (retreivedData.length !== 0) {
      // update
      for (const dataObj of retreivedData) {
        await prisma.economicEventsCalendar.updateMany({
          where: {
            dateEconomicEvent: new Date(date).toISOString(),
            eventEconomicEvent: dataObj.eventEconomicEvent
          },
          data: filteredData.find((obj) => obj.eventEconomicEvent === dataObj.eventEconomicEvent)
        });
      }

      if (retreivedData.length !== filteredData.length) {
        // find out which objects are not in the db and add them
        const missingObjects = filteredData.filter((e) => {
          let findIndex = retreivedData.findIndex((a) => {
            return a.eventEconomicEvent === e.eventEconomicEvent;
          });
          return findIndex === -1;
        });

        await prisma.economicEventsCalendar.createMany({
          data: missingObjects
        });
      }
    } else {
      // create new records
      await prisma.economicEventsCalendar.createMany({
        data: filteredData
      });
    }

    await prisma.$disconnect();
    console.log('[Upload Economic Events Calendar] Successfully updated Economic Events Calendar!');
  } catch (e) {
    await prisma.$disconnect();
    console.log('[Upload Economic Events Calendar] An error occured: ', e.message || e);
  }
};
// })();
