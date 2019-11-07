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
  await page.waitFor(1000);
  await page.keyboard.type(C.username);
  await page.waitFor(1000);
  await page.click(INPUT_PASSWORD_SELECTOR);
  await page.waitFor(1000);
  await page.keyboard.type(C.password);
  await page.waitFor(1000);
  await page.click(BUTTON_LOGIN_SELECTOR);
  await page.waitFor(1000);
 
  // **** FOR SELF SERVICE ****
  // await page.waitForSelector(A_SELF_SERVICE);
  // await page.click(A_SELF_SERVICE);
  // await page.waitFor(5000);

  // **** SELF SERVICE > CLASS SEARCH ****
  await page.goto('https://sais.up.edu.ph/psp/ps/EMPLOYEE/HRMS/c/SA_LEARNER_SERVICES.CLASS_SEARCH.GBL?PORTALPARAM_PTCNAV=HC_CLASS_SEARCH&EOPP.SCNode=HRMS&EOPP.SCPortal=EMPLOYEE&EOPP.SCName=CO_EMPLOYEE_SELF_SERVICE&EOPP.SCLabel=Class%20Search%20%2f%20Browse%20Catalog&EOPP.SCFName=HCCC_SS_CATALOG&EOPP.SCSecondary=true&EOPP.SCPTfname=HCCC_SS_CATALOG&FolderPath=PORTAL_ROOT_OBJECT.CO_EMPLOYEE_SELF_SERVICE.HCCC_SS_CATALOG.HC_CLASS_SEARCH&IsFolder=false');
  
  const INPUT_COURSE_SUBJECT = {
    x: 335,
    y: 355,
  };
  const INPUT_COURSE_NUMBER = {
    x: 400,
    y: 390,
  }
  const BUTTON_SEARCH = {
    x: 500,
    y: 580,
  }

  await page.mouse.click(INPUT_COURSE_SUBJECT.x, INPUT_COURSE_SUBJECT.y);
  await page.keyboard.type('CMSC');
  await page.waitFor(1000);

  await page.mouse.click(INPUT_COURSE_NUMBER.x, INPUT_COURSE_NUMBER.y);
  await page.waitFor(2500);
  await page.keyboard.type('11');
  await page.waitFor(1000);

  await page.mouse.click(BUTTON_SEARCH.x, BUTTON_SEARCH.y);
  await page.waitFor(1000);



  // **** FRAME ****
  await page.goto('https://sais.up.edu.ph/psp/ps/EMPLOYEE/HRMS/c/SA_LEARNER_SERVICES.SSS_MY_CRSEHIST.GBL?PORTALPARAM_PTCNAV=HC_SSS_MY_CRSEHIST_GBL&EOPP.SCNode=HRMS&EOPP.SCPortal=EMPLOYEE&EOPP.SCName=CO_EMPLOYEE_SELF_SERVICE&EOPP.SCLabel=Self%20Service&EOPP.SCPTfname=CO_EMPLOYEE_SELF_SERVICE&FolderPath=PORTAL_ROOT_OBJECT.CO_EMPLOYEE_SELF_SERVICE.HCCC_ACADEMIC_RECORDS.HC_SSS_MY_CRSEHIST_GBL&IsFolder=false');
  dumpFrameTree(page.mainFrame(), '');
  const frame = page.frames().find(frame => frame.name() === 'TargetContent');
  
  const data = await frame.evaluate(() => {
    const grades = Array.from(document.querySelectorAll('table.PSLEVEL1GRIDWBO > tbody > tr > td'))
    return grades.map(data => data.innerText);
  })
  
  let formatGrade = [];
  let counter = 1;

  for(i = 0; i < data.length; i += 7) {
    formatGrade.push(
      { 
        id: counter,
        gradeItem: [
          {
            course: data[i],
            description: data [i + 1],
            term: data [i + 2],
            grade: data [i + 3],
            units: data[i + 4],
          }
        ]
      }
    );
    counter++;
  }
  // console.log(formatGrade);

  const fs = require('fs');
  const jsonContent = JSON.stringify(formatGrade);
  fs.writeFile("info.json", jsonContent, 'utf8', function (err) {
    if (err) {
        return console.log(err);
    }

    console.log("The file was saved!");
  });


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
