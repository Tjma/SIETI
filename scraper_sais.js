const puppeteer = require('puppeteer');
const C = require('./login_credentials');

const INPUT_USERNAME_SELECTOR = '#userid';
const INPUT_PASSWORD_SELECTOR = '#pwd';
const BUTTON_LOGIN_SELECTOR = '#login > button';

const A_SELF_SERVICE = '#ptnav2pglt > #ptnav2pgltbody > #ptnav2tree #fldra_CO_EMPLOYEE_SELF_SERVICE';

async function startBrowser() {
  const browser = await puppeteer.launch({
    ignoreDefaultArgs: ['--disable-extensions'],
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
    width: 1366, 
    height: 768,
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
 
  // **** FOR SELF SERVICE ****
  await page.waitForSelector(A_SELF_SERVICE);
  await page.click(A_SELF_SERVICE);
  await page.waitFor(5000);

  // **** SELF SERVICE > CLASS SEARCH ****

  // **** FRAME ****
  await page.goto('https://sais.up.edu.ph/psp/ps/EMPLOYEE/HRMS/c/SA_LEARNER_SERVICES.SSS_MY_CRSEHIST.GBL?PORTALPARAM_PTCNAV=HC_SSS_MY_CRSEHIST_GBL&EOPP.SCNode=HRMS&EOPP.SCPortal=EMPLOYEE&EOPP.SCName=CO_EMPLOYEE_SELF_SERVICE&EOPP.SCLabel=Self%20Service&EOPP.SCPTfname=CO_EMPLOYEE_SELF_SERVICE&FolderPath=PORTAL_ROOT_OBJECT.CO_EMPLOYEE_SELF_SERVICE.HCCC_ACADEMIC_RECORDS.HC_SSS_MY_CRSEHIST_GBL&IsFolder=false');
  dumpFrameTree(page.mainFrame(), '');
  const frame = page.frames().find(frame => frame.name() === 'TargetContent');
  // const text = await frame.$eval('table.PSLEVEL1GRIDWBO > tbody', element => element.textContent);
  const data = await frame.evaluate(() => {
    const grades = Array.from(document.querySelectorAll('table.PSLEVEL1GRIDWBO > tbody'))
    return grades.map(data => data.innerText);
  })

  console.log("FRAME CONTENT ", data);

  // **** SCREENSHOT ****
  await page.screenshot({path: 'screenshot.png'});
  console.log("DONE");
}

function dumpFrameTree(frame, indent) {
  for(let child of frame.childFrames()) {
    dumpFrameTree(child, indent + " ");
  }
}

(async () => {
  await playTest("https://sais.up.edu.ph/psp/ps/?cmd=login&languageCd=ENG");
  process.exit(1);
})();
