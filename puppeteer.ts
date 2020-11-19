import puppeteer from 'puppeteer';

const pageExists = async (page: puppeteer.Page, pageNumber: number) => {
  const [anchor] = await page.$x(`//li/a[contains(., '${pageNumber}')]`);
  if (anchor) {
    anchor.click();
    return true;
  } else {
    return false;
  }
}

const main = async (queryString: string) => {
  let browser: puppeteer.Browser;
  let url: string = 'https://www.data.gov/';

  try {
    browser = await puppeteer.launch({ headless: false });
    let page: puppeteer.Page = await browser.newPage();
    let pageNumber = 1;
    await page.goto(url);
    await page.click('input#search-header');
    await page.type('input#search-header', queryString, { delay: 2 });
    await page.keyboard.press('Enter');
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    let results = [];

    while (pageExists(page, pageNumber)) {
      await page.waitForNavigation({ waitUntil: 'networkidle0' });

      const resultsList = await page.evaluate(() => {
        const content = Array.from(document.querySelectorAll('.dataset-content'));
        let pageResults = [];

        for (const node of content) {
          const dataSetHeading = node.querySelector('.dataset-heading > a').textContent;
          const dataResources = Array.from(node.querySelector('ul.dataset-resources')?.children || []);
          const organization = node.querySelector('.organization-type-wrap > span > span')?.textContent;

          let formatList = [];

          for (const dataFormat of dataResources) {
            const format = dataFormat.querySelector('a').textContent;
            formatList.push(format);
          }

          pageResults.push({ dataSetHeading, formatList, organization });
        }

        return pageResults;
      })
      // console.log('pageNumber', pageNumber);
      // console.log('resultsList', resultsList);

      results = results.concat(resultsList);
      pageNumber++;
    }

    console.log(results);

  } catch (err) {
    console.log(err)
  }
};

export function getRandomArbitrary(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export function delay(time: number) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time)
  });
}

// main('healthcare');