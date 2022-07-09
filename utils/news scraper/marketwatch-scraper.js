const puppeteer = require('puppeteer');

async function MarketWatchScraper(date = 'Jun. 29, 2022 at 8:13') {
  // some default data so to not be empty
  try {
    const browser = await puppeteer.launch({
      headless: true // false is to actually launch chrome and to see what is the bot doing. (defaults to true
    });
    const page = await browser.newPage();
    await page.goto(`https://www.marketwatch.com/latest-news`);

    // await page.waitForNavigation({ waitUntil: ['networkidle2', 'domcontentloaded'] });
    // await page.waitForSelector('#notice > div:nth-child(4) > div > div > button.message-component.message-button.no-children.focusable.agree-btn.sp_choice_type_11.last-focusable-el', {
    //   visible: true,
    // });
    // Have the function globally exposed here:
    // const wait = (time) => {
    //   return new Promise(function (resolve) {
    //     setTimeout(resolve, time);
    //   });
    // };
    // await page.exposeFunction('wait', wait);

    // await wait(3000);
    const data = await page.evaluate(async (date) => {
      console.log(1111);
      const topHeadlines = [],
        latestArticles = [];

      // top two main articles right now:
      for (let i = 1; i <= 2; i++) {
        const articleSourceLinkElement = document.querySelector(`div.layout--D2 > div.column--primary > div:nth-child(${i}) > figure > a`);
        const articleSourceLink = articleSourceLinkElement.getAttribute('href');
        console.log('articleSourceLink_1: ', articleSourceLink);

        const imageSourceLinkElement = document.querySelector(`div.layout--D2 > div.column--primary > div:nth-child(${i}) > figure > a > img`);
        let imageSourceLink = imageSourceLinkElement.getAttribute('data-srcset');

        if (imageSourceLink.includes('220w') && imageSourceLink.includes('1240w')) {
          imageSourceLink = imageSourceLink.substring(0, imageSourceLink.indexOf(' '));
          imageSourceLink = imageSourceLink.replace('width=220', 'width=1240');
        }
        console.log('imageSourceLink_1: ', imageSourceLink);

        const articleContentHeadline = document.querySelector(
          `div.layout--D2 > div.column--primary > div:nth-child(${i}) > div.article__content > h3.article__headline > a`
        ).textContent; // innerHTML
        console.log('articleContentHeadline_1', articleContentHeadline);

        const articleContentSummary = document.querySelector(`div.layout--D2 > div.column--primary > div:nth-child(${i}) > div.article__content > p.article__summary`).textContent; // innerHTML
        console.log('articleContentSummary_1: ', articleContentSummary);

        topHeadlines.push({
          articleLink: articleSourceLink,
          imageLink: imageSourceLink,
          title: articleContentHeadline,
          body: articleContentSummary,
          scrapedTimestamp: new Date().toISOString()
        });
      }

      for (let i = 1; i <= 4; i++) {
        const articleSourceLinkElement = document.querySelector(`div.layout--D2 > div.column--aside > div:nth-child(${i}) > figure > a`);
        const articleSourceLink = articleSourceLinkElement.getAttribute('href');
        console.log('articleSourceLink_2: ', articleSourceLink);

        const imageSourceLinkElement = document.querySelector(`div.layout--D2 > div.column--aside > div:nth-child(${i}) > figure > a > img`);
        let imageSourceLink = '';

        if (!imageSourceLinkElement) {
          imageSourceLink = 'https://images.moneycontrol.com/static-mcnews/2021/04/Sensex.jpg?impolicy=website&width=770&height=431';
        } else {
          imageSourceLink = imageSourceLinkElement.getAttribute('data-srcset');
        }

        if (imageSourceLink.includes('220w') && imageSourceLink.includes('1240w')) {
          imageSourceLink = imageSourceLink.substring(0, imageSourceLink.indexOf(' '));
          imageSourceLink = imageSourceLink.replace('width=220', 'width=1240');
        }
        console.log('imageSourceLink_2: ', imageSourceLink);

        const articleContentHeadline = document.querySelector(`div.layout--D2 > div.column--aside > div:nth-child(${i}) > div > h3 > a`).textContent; // innerHTML
        console.log('articleContentHeadline_2: ', articleContentHeadline);

        topHeadlines.push({
          articleLink: articleSourceLink,
          imageLink: imageSourceLink,
          title: articleContentHeadline,
          scrapedTimestamp: new Date().toISOString()
        });
      }

      for (let i = 1; i <= 20; i++) {
        console.log(i);
        // Get first published date and compare with current article so to know when to stop.
        const articleUploadTimestamp = document.querySelector(
          `div.more-headlines > div.j-moreHeadlineWrapper > div.collection__elements > div.element--article:nth-child(${i}) > div > div.article__details > span:nth-child(1)`
        ).textContent;
        console.log('articleUploadTimestamp_3:', articleUploadTimestamp);

        if (!articleUploadTimestamp) {
          throw new Error(`Could not find article upload timestamp with the given selector at iteration ${i}. Please check it out.`);
        }

        // This means we have reached an article that we already have in our db.
        if (date === articleUploadTimestamp) return { topHeadlines, latestArticles };
        const articleAuthorEl = document.querySelector(
          `div.more-headlines > div.j-moreHeadlineWrapper > div.collection__elements > div.element--article:nth-child(${i}) > div > div.article__details > span:nth-child(2)`
        );

        let articleAuthor = '';
        if (!articleAuthorEl) {
          articleAuthor = 'Unknown';
        } else {
          articleAuthor = articleAuthorEl.textContent;
        }

        console.log('articleAuthor_3: ', articleAuthor);

        const articleSourceLinkElement = document.querySelector(
          `div.more-headlines > div.j-moreHeadlineWrapper > div.collection__elements > div.element--article:nth-child(${i}) > figure > a`
        );
        const articleSourceLink = articleSourceLinkElement.getAttribute('href');
        console.log('articleSourceLink_3: ', articleSourceLink);

        const imageSourceLinkElement = document.querySelector(
          `div.more-headlines > div.j-moreHeadlineWrapper > div.collection__elements > div.element--article:nth-child(${i}) > figure > a > img`
        );
        let imageSourceLink = '';

        if (!imageSourceLinkElement) {
          imageSourceLink = 'https://images.moneycontrol.com/static-mcnews/2021/04/Sensex.jpg?impolicy=website&width=770&height=431';
        } else {
          console.log('imageSourceLinkElement: ', imageSourceLinkElement);
          imageSourceLink = imageSourceLinkElement.getAttribute('data-srcset');
        }

        if (!imageSourceLink.includes('im-555668') && imageSourceLink.includes('1.7777777') && !imageSourceLink.includes('barrons.com')) {
          imageSourceLink = 'https://images.moneycontrol.com/static-mcnews/2021/04/Sensex.jpg?impolicy=website&width=770&height=431';
        } else if (imageSourceLink.includes('220w') && imageSourceLink.includes('1240w')) {
          imageSourceLink = imageSourceLink.substring(0, imageSourceLink.indexOf(' '));
          imageSourceLink = imageSourceLink.replace('width=220', 'width=1240');
        }

        console.log('imageSourceLink_3: ', imageSourceLink);

        const articleContentHeadline = document.querySelector(
          `div.more-headlines > div.j-moreHeadlineWrapper > div.collection__elements > div.element--article:nth-child(${i}) > div > h3 > a`
        ).textContent;
        console.log('articleContentHeadline_3:', articleContentHeadline);

        latestArticles.push({
          articleLink: articleSourceLink,
          imageLink: imageSourceLink,
          title: articleContentHeadline,
          uploadedArticleTimestamp: articleUploadTimestamp,
          author: articleAuthor,
          scrapedTimestamp: new Date().toISOString()
        });
      }

      return { topHeadlines, latestArticles };
    }, date);

    await page.close();
    await browser.close();

    return data;
  } catch (e) {
    console.log('An error occured: ', e);
    return { error: true, message: e.message || e };
  }
}

// MarketWatchScraper();

module.exports = { MarketWatchScraper };
