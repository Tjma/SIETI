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

  // ** SELF SERVICE > CLASS SEARCH **
  await page.goto('https://sais.up.edu.ph/psp/ps/EMPLOYEE/HRMS/c/SA_LEARNER_SERVICES.CLASS_SEARCH.GBL?PORTALPARAM_PTCNAV=HC_CLASS_SEARCH&EOPP.SCNode=HRMS&EOPP.SCPortal=EMPLOYEE&EOPP.SCName=CO_EMPLOYEE_SELF_SERVICE&EOPP.SCLabel=Class%20Search%20%2f%20Browse%20Catalog&EOPP.SCFName=HCCC_SS_CATALOG&EOPP.SCSecondary=true&EOPP.SCPTfname=HCCC_SS_CATALOG&FolderPath=PORTAL_ROOT_OBJECT.CO_EMPLOYEE_SELF_SERVICE.HCCC_SS_CATALOG.HC_CLASS_SEARCH&IsFolder=false');
  
  await page.waitFor(3000);
  for (let i = 0; i < 29; i++) {
    await page.keyboard.press("Tab");
  }
  await page.waitFor(3000);
  await page.keyboard.type(C.subject);
  await page.keyboard.press("Tab");
  
  await page.waitFor(3000);
  for (let i = 29; i < 30; i++) {
    await page.keyboard.press("Tab");
  }
  await page.keyboard.type(C.subjectnumber);
  await page.waitFor(3000);

  await page.keyboard.press('Enter');
  await page.waitFor(3000);
  await page.waitFor(3000);
  await page.waitFor(3000);

  for (let i = 0; i < 7; i++) {
    await page.keyboard.press("Tab");
  }
  await page.keyboard.press('Enter');
  await page.waitFor(3000);

  dumpFrameTree(page.mainFrame(), '');
  const frame = page.frames().find(frame => frame.name() === 'TargetContent');

  const courseTitle = await frame.evaluate(() => {
    const course = Array.from(document.querySelectorAll('table > tbody > tr > td span.SSSHYPERLINKBOLD'))
    return course.map(course => course.innerText);
  })

  const data1 = await frame.evaluate(() => {
    const classes = Array.from(document.querySelectorAll('table.PSLEVEL1SCROLLAREABODYWBO > tbody > tr > td > table > tbody > tr > td'))
    return classes.map(data1 => data1.innerText);
  })

  const data2 = await frame.evaluate(() => {
    const classes = Array.from(document.querySelectorAll('table.PSLEVEL1SCROLLAREABODYWBO > tbody > tr > td > table > tbody > tr > td > div > table > tbody > tr > td'))
    return classes.map(data2 => data2.innerText);
  })

  let section = []
  let formatSchedule = [];

  for(i = 9; i < data1.length; i += 14) {
    section.push(data1[i])
  }

  counter = 0;

  formatSchedule.push(
    {
      courseTitle: courseTitle[0]
    }
  )


  for(i = 0; i < data2.length; i += 4) {
    formatSchedule.push(
      { 
        sectionID: section[counter],
        sectionDetails: [
          {
            dates_and_times: data2[i],
            room: data2[i + 1],
            instructor: data2[i + 2],
            meeting_dates: data2[i + 3],
          }
        ]
      }
    );
    counter++;
  }

  const fs = require('fs');
  const jsonContent = JSON.stringify(formatSchedule);
  fs.writeFile("info_classSearch.json", jsonContent, 'utf8', function (err) {
    if (err) {
        return console.log(err);
    }

    console.log("The file was saved!");
  });
  

  // ** SCREENSHOT **
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