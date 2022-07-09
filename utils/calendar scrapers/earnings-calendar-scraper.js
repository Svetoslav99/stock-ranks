const puppeteer = require('puppeteer');
const moment = require('moment');

async function EarningsCalendarScraper(date) {
  try {
    const browser = await puppeteer.launch({
      headless: true // false is to actually launch chrome and to see what is the bot doing. (defaults to true
    });
    const page = await browser.newPage();
    const formattedDate = moment(date).format('YYYY-MM-DD'); // '2022-05-26' an example with two pages.
    await page.goto(`https://finance.yahoo.com/calendar/earnings?day=${formattedDate}`);
    await Promise.all([page.click('button[type=submit]'), page.waitForNavigation({ waitUntil: ['networkidle2', 'domcontentloaded'] })]);

    // Have the function globally exposed here:
    const wait = (time) => {
      return new Promise(function (resolve) {
        setTimeout(resolve, time);
      });
    };
    await page.exposeFunction('wait', wait);
    const earningsCalendarData = [];
    let isDisabled = true;
    do {
      const rawData = await page.evaluate(async (date) => {
        const data = [];
        let tbody = document.querySelector(`tbody`);

        if (!tbody) {
          // No data for the current day, return
          return data;
        }

        for (let i = 1; i <= tbody.rows.length; i++) {
          const symbolEarnings = document.querySelector(`tbody > tr:nth-child(${i}) > td:nth-child(1) > a`).innerHTML;

          const companyEarnings = document.querySelector(`tbody > tr:nth-child(${i}) > td:nth-child(2)`).innerHTML;

          let earningsCallTimeEarnings = '';
          try {
            earningsCallTimeEarnings = document.querySelector(`tbody > tr:nth-child(${i}) > td:nth-child(3) > span`).innerText;
          } catch (e) {
            earningsCallTimeEarnings = document.querySelector(`tbody > tr:nth-child(${i}) > td:nth-child(3)`).innerHTML;
          }

          const EPSEstimateEarnings = document.querySelector(`tbody > tr:nth-child(${i}) > td:nth-child(4)`).innerHTML;

          const reportedEPSEarnings = document.querySelector(`tbody > tr:nth-child(${i}) > td:nth-child(5)`).innerHTML;

          let surpriseEarnings = '';
          try {
            surpriseEarnings = document.querySelector(`tbody > tr:nth-child(${i}) > td:nth-child(6) > fin-streamer > span`).innerText;
          } catch (e) {
            surpriseEarnings = document.querySelector(`tbody > tr:nth-child(${i}) > td:nth-child(6)`).innerHTML;
          }

          if (surpriseEarnings !== '-') {
            surpriseEarnings += '%';
          }

          const trObj = {
            symbolEarnings,
            companyEarnings,
            earningsCallTimeEarnings,
            EPSEstimateEarnings,
            reportedEPSEarnings,
            surpriseEarnings,
            dateEarnings: new Date(date).toISOString()
          };

          data.push(trObj);
        }

        isNextBtnDisabled = document.querySelector('#cal-res-table > div:nth-child(2) > button:nth-child(3)[disabled]') !== null;

        return {
          data,
          isNextBtnDisabled
        };
      }, date);

      earningsCalendarData.push(...rawData.data);
      isDisabled = rawData.isNextBtnDisabled;

      if (!isDisabled) {
        await page.click('#cal-res-table > div:nth-child(2) > button:nth-child(3)');
        await wait(3000);
      }
    } while (!isDisabled);

    await page.close();
    await browser.close();
    return earningsCalendarData;
  } catch (e) {
    console.log('An error occured: ', e);
  }
}
module.exports = { EarningsCalendarScraper };
