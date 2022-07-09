const { schedule } = require('node-cron');
const moment = require('moment');

const newsUpload = require('../db/news scraper data upload/marketwatch');
const cryptoEventsUpload = require('../db/crypto events data upload/top-100-coins');
const earningsCalendarUpload = require('../db/calendars data upload/earnings-calendar');
const economicEventsCalendar = require('../db/calendars data upload/economic-events-calendar');
const iposCalendarUpload = require('../db/calendars data upload/ipos-calendar');

const taskNews = schedule('*/2 * * * *', async () => {
  console.log('running taskNews every two minutes');
  await newsUpload();
});

const taskCryptoEvents = schedule('0 0 * * 1-7', async () => {
  console.log('running taskCryptoEvents every day of the week.');
  await cryptoEventsUpload();
});

const taskEarningsCalendar = schedule('0 0 * * 1-7', async () => {
  console.log('running taskEarningsCalendar every day of the week');

  const date = new Date();
  const today = moment(date).format('YYYY-MM-DD');
  await earningsCalendarUpload(today);
  console.log('taskEarningsCalendar: earningsCalendarUpload procedure executed for today with date: ', today);

  const prevDay = moment(today).subtract(1, 'd');
  await earningsCalendarUpload(prevDay);
  console.log('taskEarningsCalendar: earningsCalendarUpload procedure executed for yesterday with date: ', prevDay);

  for (let i = 1; i <= 7; i++) {
    const d = moment(today).add(i, 'd');
    await earningsCalendarUpload(d);
    console.log('taskEarningsCalendar: earningsCalendarUpload procedure executed for date: ', d);
  }
});

const taskEconomicEventsCalendar = schedule('0 0 * * 1-7', async () => {
  console.log('running taskEconomicEventsCalendar every day of the week');

  const date = new Date();
  const today = moment(date).format('YYYY-MM-DD');
  await economicEventsCalendar(today);
  console.log('taskEconomicEventsCalendar: economicEventsCalendar procedure executed for today with date: ', today);

  const prevDay = moment(today).subtract(1, 'd');
  await economicEventsCalendar(prevDay);
  console.log('taskEconomicEventsCalendar: economicEventsCalendar procedure executed for yesterday with date: ', prevDay);

  for (let i = 1; i <= 7; i++) {
    const d = moment(today).add(i, 'd');
    await economicEventsCalendar(d);
    console.log('taskEarningsCalendar: economicEventsCalendar procedure executed for date: ', d);
  }
});

const taskIPOsCalendar = schedule('0 0 * * 1-7', async () => {
  console.log('running taskIPOsCalendar every day of the week');

  const date = new Date();
  const today = moment(date).format('YYYY-MM-DD');
  await iposCalendarUpload(today);
  console.log('taskIPOsCalendar: taskIPOsCalendar procedure executed for today with date: ', today);

  const nextDay = moment(today).add(1, 'd');
  await iposCalendarUpload(nextDay);
  console.log('taskEarningsCalendar: taskIPOsCalendar procedure executed for tomorrow with date: ', nextDay);
});

taskNews.start();
taskCryptoEvents.start();
taskEarningsCalendar.start();
taskIPOsCalendar.start();
taskEconomicEventsCalendar.start();
