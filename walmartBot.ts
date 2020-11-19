import { Browser, ElementHandle, Page } from 'puppeteer';
import puppeteer from 'puppeteer-extra';
import RecaptchaPlugin from 'puppeteer-extra-plugin-recaptcha'
import { delay, getRandomArbitrary } from './puppeteer';
import LoginObj from './logins';

// new file ./logins.ts
// start of file
// const LoginObj = {
//   email: 'EMAIL LOGIN FOR WALMART ACCOUNT',
//   password: 'PASSWORD FOR WALMART ACCOUNT',
//   CVV: 000, // CVV for card on default card
//   TWO_CAPTCHA_KEY: 'ASK_FOR_API_KEY', // you can use my api key
// }

// export default LoginObj;
// end of file

puppeteer.use(
  RecaptchaPlugin({
    provider: {
      id: '2captcha',
      token: LoginObj.TWO_CAPTCHA_KEY,
    },
  })
);

interface Account {
  loginUrl: string;
  email: string;
  password: string;
  CVV: number;
  productUrl: WalmartProductUrl;
}

const login = async (browser: Browser, account: Account) => {
  const page: Page = await browser.newPage();
  page.goto(account.loginUrl);
  await page.waitForNavigation({ waitUntil: 'domcontentloaded' })
  await page.click('input#email');
  await page.type('input#email', account.email, { delay: 2 });
  await page.click('input#password');
  await page.type('input#password', account.password, { delay: 2 });
  await page.click('#sign-in-form > button.button.m-margin-top.text-inherit');
  await page.waitForNavigation();
  return page;
}

const main = async (account: Account) => {
  let browser: Browser;

  try {
    browser = await puppeteer.launch({
      headless: false,
      args: ['--incognito'],
    });

    const page: Page = await login(browser, account);
    await page.goto(account.productUrl);

    let button: ElementHandle<Element> = null;
    const addToCartBtnSelector: string = '#add-on-atc-container > div:nth-child(1) > section > div.valign-middle.display-inline-block.prod-product-primary-cta.primaryProductCTA-marker > div.prod-product-cta-add-to-cart.display-inline-block > button';

    while (!button) {
      await page.reload();
      await delay(getRandomArbitrary(699, 999));
      button = await page.$(addToCartBtnSelector);
    }

    await button.click();
    // wait for modal?
    await page.waitForNavigation();

    await page.solveRecaptchas();
    await page.waitForNavigation();

    const checkOutBtnSelector: string = '#cart-root-container-content-skip > div:nth-child(1) > div > div.Cart-PACModal.standard-pac.pac-added.pac-new-ny.no-price-fulfillment.pac-vanilla-hf > div > div > div > div > div.Cart-PACModal-Body-right-rail.Grid-col.u-size-1.u-size-1-2-m.u-size-1-2-l > div > div > div.Grid-col.u-size-1-2.pos-actions-container > div.cart-pos-main-actions.s-margin-top > div.new-ny-styling.cart-pos-proceed-to-checkout > div > button.button.ios-primary-btn-touch-fix.hide-content-max-m.checkoutBtn.button--primary';
    await page.waitForSelector(checkOutBtnSelector);
    await (await page.$(checkOutBtnSelector)).click();
    await page.waitForNavigation();

    try {
      const continueDeliverySelector: string = '[aria-label="Continue to Delivery Address"]';
      await page.waitForSelector(continueDeliverySelector);
      await page.click(continueDeliverySelector);
      await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
    } catch (err) {
      console.log('continueDeliverySelector');
      console.error(err);
    }

    try {
      const confirmAddressSelector: string = '[aria-label="Continue to Payment Options"]';
      await page.waitForSelector(confirmAddressSelector);
      await page.click(confirmAddressSelector);
      await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
    } catch (err) {
      console.log('confirmAddressSelector');
      console.error(err);
    }

    try {
      const CVVInputSelector: string = '#cvv-confirm';
      await page.waitForSelector(CVVInputSelector, { timeout: 1000 });
      await page.click(CVVInputSelector);
      await page.type(CVVInputSelector, account.CVV.toString(), { delay: 3 });
    } catch (err) {
      console.log('CVVInputSelector')
      console.error(err);
    }

    const reviewOrderSelector: string = '[aria-label="Review Your Order"]';
    await page.waitForSelector(reviewOrderSelector);
    await (await page.$(reviewOrderSelector)).click();
    await page.waitForNavigation();

    const placeOrderSelector: string = '[aria-label="Place Order"]';
    await page.waitForSelector(placeOrderSelector);
    await (await page.$(placeOrderSelector)).click();
    await page.waitForNavigation();

  } catch (err) {
    console.error(err)
  } finally {
    if (browser) {
      console.log(`Order placed for: ${account.productUrl}`)
      browser.close();
    }
  }

};

const loginUrl: string = 'https://www.walmart.com/account/login?';

enum WalmartProductUrl {
  PS5_CONSOLE = 'https://www.walmart.com/ip/PlayStation-5-Console/363472942',
  PS5_DIGITAL = 'https://www.walmart.com/ip/Sony-PlayStation-5-Digital-Edition/493824815',
  XBOX_SERIES_X = 'https://www.walmart.com/ip/XB1-Xbox-Series-X/443574645',
}

main({
  ...LoginObj,
  loginUrl,
  productUrl: WalmartProductUrl.PS5_DIGITAL // select item you want
})

