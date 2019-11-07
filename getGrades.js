const puppeteer = require('puppeteer');

async function startBrowser() {
  const browser = await puppeteer.launch({
    headless: false,
    ignoreDefaultArgs: ['--disable-extensions'],
  });
  const page = await browser.newPage(); 
  
  return {browser, page};
}

async function closeBrowser(browser) {
  return browser.close();
}

exports.playTest = async function(url) {
  const {browser, page} = await startBrowser();
  page.setViewport({
    width: 1366, 
    height: 768,
    deviceScaleFactor: 1,
  });
await page.goto("file:///C:/Users/Aldrin/SIETI/My%20Course%20History.html");
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
          grade: '1' + data[i + 3], // +1 for obfuscation. para dili klaro grado
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
fs.writeFile("info_test.json", jsonContent, 'utf8', function (err) {
  if (err) {
      return console.log(err);
  }

  console.log("The file was saved!");
});

console.log("DONE");
  await page.waitFor(5000);a

};
function dumpFrameTree (frame, indent) {
    for(let child of frame.childFrames()) {
      dumpFrameTree(child, indent + " ");
    }

  }
