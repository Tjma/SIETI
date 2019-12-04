const puppeteer = require('puppeteer');
const C = require('./login_credentials');

const INPUT_USERNAME_SELECTOR = '#userid';
const INPUT_PASSWORD_SELECTOR = '#pwd';
const BUTTON_LOGIN_SELECTOR = '#login > button';

const A_SELF_SERVICE = '#ptnav2pglt > #ptnav2pgltbody > #ptnav2tree #fldra_CO_EMPLOYEE_SELF_SERVICE';

async function startBrowser() {
  const browser = await puppeteer.launch({
    ignoreDefaultArgs: ['--disable-extensions'],
    headless: false,
  });
  const page = await browser.newPage();
  
  return {browser, page};
}

async function closeBrowser(browser) {
  return browser.close();
}

async function playTest(url) {
  const {browser, page} = await startBrowser();
  page.setViewport({
    width: 1920, 
    height: 1080,
    deviceScaleFactor: 1,
  });

  await page.goto(url);
  await page.click(INPUT_USERNAME_SELECTOR);
  await page.waitFor(3000);
  await page.keyboard.type(C.username);
  await page.waitFor(3000);
  await page.click(INPUT_PASSWORD_SELECTOR);
  await page.waitFor(3000);
  await page.keyboard.type(C.password);
  await page.waitFor(3000);
  await page.click(BUTTON_LOGIN_SELECTOR);
  await page.waitFor(3000);

  // **** Student Search  ****
  await page.goto('https://sais.up.edu.ph/psc/ps/EMPLOYEE/HRMS/c/SSR_ADVISEE_OVRD.SSS_STUDENT_CENTER.GBL?Page=SSS_STUDENT_CENTER&Action=U');
  

  await page.waitForSelector('tbody #SSR_ADVEE_SRCH_EMPLID')
  await page.click('tbody #SSR_ADVEE_SRCH_EMPLID')
  
  await page.waitFor(3000);
  await page.keyboard.type('10044461');
  await page.waitFor(3000);

  await page.waitForSelector('tbody #SSR_ADVEE_SRCH_LAST_NAME_SRCH')
  await page.click('tbody #SSR_ADVEE_SRCH_LAST_NAME_SRCH')
  
  await page.waitFor(3000);
  await page.keyboard.type('Alvarez');
  await page.waitFor(3000);

  await page.waitForSelector('tbody #SSR_ADVEE_SRCH_FIRST_NAME_SRCH')
  await page.click('tbody #SSR_ADVEE_SRCH_FIRST_NAME_SRCH')

  await page.waitFor(3000);
  await page.keyboard.type('Timothy John');
  await page.waitFor(3000);

  await page.keyboard.press('Enter');
  await page.waitFor(3000);

  
  // **** SCREENSHOT ****
  await page.screenshot({path: 'screenshot.png'});
  console.log("DONE");
}


(async () => {
  await playTest("https://sais.up.edu.ph/psp/ps/?cmd=login&languageCd=ENG");
  process.exit(1);
})();
