import { PrismaClient } from '@prisma/client';
import moment from 'moment';

const prisma = new PrismaClient();

async function handler(req, res) {
  const data = req.body;

  if (req.method === 'POST') {
    try {
      await prisma.$connect();

      const result = [];

      for (let date of data.dates) {
        date = new Date(date);

        let retreivedData = null;
        if (data.calendar === 'Earnings Calendar') {
          retreivedData = await prisma.earningsCalendar.findMany({
            where: {
              dateEarnings: date.toISOString()
            }
          });
        } else if (data.calendar === 'Economic Events Calendar') {
          retreivedData = await prisma.economicEventsCalendar.findMany({
            where: {
              dateEconomicEvent: date.toISOString()
            }
          });
        } else if (data.calendar === 'IPOs Calendar') {
          retreivedData = await prisma.iPOsCalendar.findMany({
            where: {
              dateIPOs: date.toISOString()
            }
          });
        }

        if (retreivedData) {
          result.push(...retreivedData);
        }
      }

      // format the dates.
      if (data.calendar === 'Earnings Calendar') {
        result.map((obj) => (obj.dateEarnings = moment(obj.dateEarnings).format('YYYY-MM-DD')));
      } else if (data.calendar === 'Economic Events Calendar') {
        result.map((obj) => (obj.dateEconomicEvent = moment(obj.dateEconomicEvent).format('YYYY-MM-DD')));
      } else if (data.calendar === 'IPOs Calendar') {
        result.map((obj) => (obj.dateIPOs = moment(obj.dateIPOs).format('YYYY-MM-DD')));
      }

      await prisma.$disconnect();

      if (result.length !== 0) {
        return res.status(200).json({
          message: `Successfully retreived data from the database!`,
          data: result,
          error: false
        });
      } else {
        throw new Error('There is no data in the database for these dates!');
      }
    } catch (e) {
      await prisma.$disconnect();

      return res.status(500).json({
        message: `An error occured: ${e.message || e}`,
        error: true
      });
    }
  }
}

export default handler;
