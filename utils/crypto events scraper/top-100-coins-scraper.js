const puppeteer = require('puppeteer');

async function Top100CoinsScraper() {
  try {
    const browser = await puppeteer.launch({
      headless: true // false is to actually launch chrome and to see what is the bot doing. (defaults to true
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 768 });
    await page.goto(`https://coinmarketcal.com/en/`);
    await Promise.all([page.click('button[type=submit]'), page.waitForNavigation({ waitUntil: ['networkidle2', 'domcontentloaded'] })]);

    // Have the function globally exposed here:
    const wait = (time) => {
      return new Promise(function (resolve) {
        setTimeout(resolve, time);
      });
    };
    await page.exposeFunction('wait', wait);

    await page.click('div.btn-group > input');
    await wait(1000);
    await page.click('div.ranges > ul > li:nth-child(5)');
    await wait(1000);
    await page.click('button[title="Coins"]');
    await wait(1000);
    await page.click('#bs-select-1 > ul > li:nth-child(1) > a');
    await wait(1000);
    await page.click('#form_submit');
    await page.waitForNavigation({ waitUntil: ['networkidle2', 'domcontentloaded'] });

    const cryptoEventsData = [];
    let navigateToNextPage = true;
    do {
      const rawData = await page.evaluate(async () => {
        const data = [];
        const numOfArticles = document.querySelectorAll('.list-card > article').length;

        if (!numOfArticles) {
          // No data for the current day, break.xxx
          return {
            data: false
          };
        }

        for (let i = 1; i <= numOfArticles; i++) {
          let cryptoImgElement = '';

          cryptoImgElement = document.querySelector(`.list-card > article:nth-child(${i}) > div > div > div:nth-child(1) > div.card__logo-wrapper > div.icon-sm > img`);
          if (!cryptoImgElement) {
            cryptoImgElement = document.querySelector(
              `.list-card > article:nth-child(${i}) > div > div > div:nth-child(1) > div.card__logo-wrapper > div.icon-sm > div.slick-list > div.slick-track > div:nth-child(1) > div > img`
            );
          }

          let cryptoImgSource = cryptoImgElement.getAttribute('src');

          if (!cryptoImgSource) {
            cryptoImgSource = cryptoImgElement.getAttribute('data-src');
          }

          cryptoImgSource += '';
          if (!cryptoImgSource.includes('http')) {
            cryptoImgElement = document.querySelector(
              `.list-card > article:nth-child(${i}) > div > div > div:nth-child(1) > div.card__logo-wrapper > div.icon-sm > div.slick-list > div.slick-track > div:nth-child(2) > div > img`
            );

            cryptoImgSource = cryptoImgElement.getAttribute('src');

            if (!cryptoImgSource) {
              cryptoImgSource = cryptoImgElement.getAttribute('data-src');
            }
          }

          console.log('cryptoImgSource: ', cryptoImgSource);

          let header = document.querySelector(`.list-card > article:nth-child(${i}) > div > div > h5 > a`).innerText;

          if (header.includes('and')) {
            // rework the header, we will get only the first crypto for now.
            header = header.substring(0, header.lastIndexOf('a'));
          }
          console.log('header: ', header);

          const date = document.querySelector(`.list-card > article:nth-child(${i}) > div > div > a > h5:nth-child(1)`).innerHTML;
          console.log('date: ', date);

          const title = document.querySelector(`.list-card > article:nth-child(${i}) > div > div > a > h5:nth-child(2)`).innerHTML;
          console.log('title: ', title);

          const body = document.querySelector(`.list-card > article:nth-child(${i}) > div > div > div.box > p`).innerText;
          console.log('body: ', body);

          const sourceLinkElement = document.querySelector(`.list-card > article:nth-child(${i}) > div > div > div.box > div.container-fluid > div > div:nth-child(2) > a`);
          console.log('sourceLinkElement: ', sourceLinkElement);
          const sourceLink = sourceLinkElement.getAttribute('href');
          console.log('sourceLink: ', sourceLink);

          const trObj = {
            cryptoImgSource,
            header,
            date,
            title,
            body,
            sourceLink,
            scrapedTimestamp: new Date().toISOString()
          };

          data.push(trObj);
        }

        const numberOfNavigationButtons = document.querySelectorAll('ul.pagination > li').length;

        let nextPageExist = false,
          selector = '',
          navButtonContent = '';
        for (let i = 1; i <= numberOfNavigationButtons; i++) {
          try {
            navButtonContent = document.querySelector(`ul.pagination > li:nth-child(${i}) > a`).innerText;
          } catch (e) {
            // this means the current page is the selected one and is with a span instead of a
            navButtonContent = document.querySelector(`ul.pagination > li:nth-child(${i}) > span`).innerText;
          }

          console.log('navButtonContent:', navButtonContent);
          if (navButtonContent === '>') {
            nextPageExist = true;
            selector = `ul.pagination > li:nth-child(${i}) > a`;
          }
        }

        return {
          data,
          nextPageExist,
          selector
        };
      });

      cryptoEventsData.push(...rawData.data);
      navigateToNextPage = rawData.nextPageExist;

      if (navigateToNextPage) {
        await page.click(rawData.selector);
        await wait(3000);
      }
    } while (navigateToNextPage);

    await page.close();
    await browser.close();
    return cryptoEventsData;
  } catch (e) {
    console.log('An error occured: ', e);
  }
}

module.exports = { Top100CoinsScraper };
