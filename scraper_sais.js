const puppeteer = require('puppeteer');
const C = require('./constants');
const USERNAME_SELECTOR = '#userid';
const PASSWORD_SELECTOR = '#pwd';
const CTA_SELECTOR = '#login > button';
const SELF_SERV = '#ptnav2pglt > #ptnav2pgltbody > #ptnav2tree #fldra_CO_EMPLOYEE_SELF_SERVICE';
const WORKLIST = '#ptnav2pglt > #ptnav2pgltbody > #ptnav2tree #fldra_PT_WORKLIST';
const MY_FAVORITES = '#ptnav2pglt > #ptnav2pgltbody > #ptnav2tree #fldra_MYFAVORITES';
const USER_DEFAULTS = '#ptnav2pglt > #ptnav2pgltbody > #ptnav2tree #crefli_HC_OPR_DEFAULT_CS_GBL > a';
const CHANGE_PASS = '#ptnav2pglt > #ptnav2pgltbody > #ptnav2tree #crefli_PT_CHANGE_PASSWORD_GBL > a';
const MY_PERSONALIZATIONS = '#ptnav2pglt > #ptnav2pgltbody > #ptnav2tree #crefli_PT_USER_SELF_PERSONAL_GBL > a';
const SEARCH_BAR = '#MENU_Data > #ptnav2pglt > #ptnav2srch #ptnav2srchinput';
const SEARCH_BUTTON = '#MENU_Data > #ptnav2pglt > #ptnav2srch #ptnav2go';

const VIEW_MY_GRADES = '#ptifrmcontent > #ptifrmtarget > #ptifrmtgtframe >';



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
  await page.click(USERNAME_SELECTOR);
  await page.waitFor(3000);
  await page.keyboard.type(C.username);
  await page.waitFor(3000);
  await page.click(PASSWORD_SELECTOR);
  await page.waitFor(3000);
  await page.keyboard.type(C.password);
  await page.waitFor(3000);
  await page.click(CTA_SELECTOR);
  await page.waitFor(3000);
 
  // **** FOR SELF SERVICE ****
  // await page.waitForSelector(SELF_SERV);
  // await page.click(SELF_SERV);
  
  // **** FOR WORKLIST ****
  // await page.waitForSelector(WORKLIST);
  // await page.click(WORKLIST);

  // **** FOR MY FAVORITES ****
  // await page.waitForSelector(MY_FAVORITES);
  // await page.click(MY_FAVORITES);
  
  // **** FOR USER DEFAULTS ****
  // await page.waitForSelector(USER_DEFAULTS);
  // await page.click(USER_DEFAULTS);

  // **** FOR CHANGE MY PASSWORD ****
  // await page.waitForSelector(CHANGE_PASS);
  // await page.click(CHANGE_PASS);

  // **** FOR MY PERSONALIZATIONS ****
  // await page.waitForSelector(MY_PERSONALIZATIONS);
  // await page.click(MY_PERSONALIZATIONS);
  
  // ***** FOR SEARCHING *******  
  // await page.waitForSelector(SEARCH_BAR); 
  // await page.click(SEARCH_BAR);
  // await page.keyboard.type(C.searchWord);
  // await page.click(SEARCH_BUTTON); 

  // **** SCRAPE ANNOUNCEMENT ****
  const headings = await page.evaluate(() => 
    Array.from(document.querySelectorAll("td#ptpgltbody_ADMN_E_ANNOUNCE_HMPG > span#ADMN_E_ANNOUNCE_HMPG_Data > div > table > tbody > tr > td > h2, h3")).map((h) => h.innerText.trim())
  )
  console.log("HEADINGS = > ", headings);

  const announcements = await page.evaluate(() => 
    Array.from(document.querySelectorAll("td#ptpgltbody_ADMN_E_ANNOUNCE_HMPG > span#ADMN_E_ANNOUNCE_HMPG_Data > div > table > tbody > tr > td > p")).map((p) => p.innerText.trim())
  )
  console.log("P - >", announcements);

  console.log("DONE");

  await page.waitFor(3000);
  await page.screenshot({path: 'sais_scrape.png'});
}

(async () => {
  await playTest("https://sais.up.edu.ph/psp/ps/?cmd=login&languageCd=ENG");
  process.exit(1);
})();
