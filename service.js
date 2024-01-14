const fs = require("fs");
const puppeteer = require('puppeteer');

exports.hello_world = async (req, res) => res.send('Hello World 2');
exports.test_post = async (req, res) => res.send('Test Post');

exports.generate_pdf = async (req, res) => {
  // Create a browser instance
  const browser = await puppeteer.launch();
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

exports.generate_pdf_html = async (req, res) => {
   // Create a browser instance
   const browser = await puppeteer.launch();

  const page = await browser.newPage();

  const website_url = 'https://main.d1vkma8fugi4mi.amplifyapp.com/pdf'; 

  await page.goto(website_url, { waitUntil: 'networkidle0' }); 
  await page.goto(website_url);
  await page.emulateMediaType('screen');

  const pdf = await page.pdf({
    format: "A4",
    printBackground: true,
    preferCSSPageSize: true,
    margin: { top: '50px', right: '50px', bottom: '50px', left: '50px' },
  });

  await browser.close();

  res.contentType("application/pdf");
  res.send(pdf);  
};

