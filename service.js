const fetch = require('node-fetch');
const fs = require("fs");
const chromium = require('@sparticuz/chromium-min');
const puppeteer = require("puppeteer-core");

async function getBrowser() {
  return puppeteer.launch({
    args: [...chromium.args, '--hide-scrollbars', '--disable-web-security'],
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(
      `https://github.com/Sparticuz/chromium/releases/download/v116.0.0/chromium-v116.0.0-pack.tar`
    ),
    headless: chromium.headless,
    ignoreHTTPSErrors: true,
  });
}

exports.hello_world = async (req, res) => res.send('Hello World 2');
exports.test_post = async (req, res) => res.send('Test Post');

exports.generate_pdf = async (req, res) => {
  let browser = await getBrowser(); 
  const page = await browser.newPage();
  const html = await `${fs.readFileSync(`./dummy.html`, "utf8")}`;
  await page.setContent(html, { waitUntil: "domcontentloaded" });

  const pdf = await page.pdf({
    format: "A4",
    printBackground: false,
    preferCSSPageSize: true,
    displayHeaderFooter: true,

    headerTemplate: `<div class="header" style="font-size:20px; padding-left:15px;"><h1>Main Heading</h1></div> `,
    footerTemplate: '<footer><h5>Page <span class="pageNumber"></span> of <span class="totalPages"></span></h5></footer>',
    margin: { top: "200px", bottom: "150px", right: "20px", left: "20px"},
  });

  res.contentType("application/pdf");
  res.send(pdf);  
};

// exports.generate_pdf_html = async (req, res) => {
//   const options = {
//     args: [...chrome.args, "--hide-scrollbars", "--disable-web-security", '--font-render-hinting=none'],
//     defaultViewport: chrome.defaultViewport,
//     executablePath: await chrome.executablePath,
//     headless: true,
//     ignoreHTTPSErrors: true,
//  };
//   let browser = await puppeteer.launch(options); 

//   const page = await browser.newPage();

//   const website_url = 'https://main.d1vkma8fugi4mi.amplifyapp.com/pdf'; 

//   await page.goto(website_url, { waitUntil: 'networkidle0' }); 
//   await page.goto(website_url);
//   await page.emulateMediaType('screen');

//   const pdf = await page.pdf({
//     format: "A4",
//     printBackground: true,
//     preferCSSPageSize: true,
//     margin: { top: '50px', right: '50px', bottom: '50px', left: '50px' },
//   });

//   await browser.close();

//   res.contentType("application/pdf");
//   res.send(pdf);  
// };

