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

  // **** SELF SERVICE > CLASS SEARCH ****
  await page.goto('https://sais.up.edu.ph/psc/ps/EMPLOYEE/HRMS/c/SSR_ADVISEE_OVRD.SSS_STUDENT_CENTER.GBL?Page=SSS_STUDENT_CENTER&Action=U');
  
//   await waitForSelector('table > tbody > tr > .ssstabinactive:nth-child(5) > .ssstabmaintext')
//   await click('table > tbody > tr > .ssstabinactive:nth-child(5) > .ssstabmaintext')

  //await page.mouse.click(INPUT_COURSE_SUBJECT.x, INPUT_COURSE_SUBJECT.y);

  await page.waitForSelector('tbody #SSR_ADVEE_SRCH_EMPLID')
  await page.click('tbody #SSR_ADVEE_SRCH_EMPLID')
  
//   for (let i = 0; i < 13; i++) {
//     await page.keyboard.press("Tab");
//     console.log(i);
//    await page.waitFor(3000);
//   }
  await page.waitFor(3000);
  await page.keyboard.type('10044461');
  await page.waitFor(3000);
//   await page.keyboard.press("Tab");
  
//   await page.waitFor(3000);
//   for (let i = 29; i < 30; i++) {
//     await page.keyboard.press("Tab");
//     console.log(i);
//   }
//   await page.keyboard.type('11');
//   await page.waitFor(3000);

//   await page.keyboard.press('Enter');
//   await page.waitFor(3000);
//   await page.waitFor(3000);
//   await page.waitFor(3000);

//   for (let i = 0; i < 7; i++) {
//     await page.keyboard.press("Tab");
//     console.log(i);
//   }
  await page.keyboard.press('Enter');
  await page.waitFor(3000);

  
  // **** SCREENSHOT ****
  await page.screenshot({path: 'screenshot.png'});
  console.log("DONE");
}

function dumpFrameTree (frame, indent) {
  for(let child of frame.childFrames()) {
    dumpFrameTree(child, indent + " ");
  }
}

(async () => {
  await playTest("https://sais.up.edu.ph/psp/ps/?cmd=login&languageCd=ENG");
  process.exit(1);
})();
