const fetch = require('node-fetch');
const fs = require("fs");

let chrome = {};
let puppeteer;

if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
  // running on the Vercel platform.
  chrome = require('chrome-aws-lambda');
  puppeteer = require('puppeteer-core');
} else {
  // running locally.
  puppeteer = require('puppeteer');
}


exports.hello_world = async (req, res) => res.send('Hello World');

exports.generate_pdf = async (req, res) => {
  let browser = await puppeteer.launch({
    args: [...chrome.args, '--hide-scrollbars', '--disable-web-security'],
    defaultViewport: chrome.defaultViewport,
    executablePath: await chrome.executablePath,
    headless: true,
    ignoreHTTPSErrors: true,
  });
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

  //  SENDING BACK PDF IN RESPONCE TO API CALL
  res.contentType("application/pdf");
  res.send(pdf);  
};

exports.generate_pdf_html = async (req, res) => {
  let browser = await puppeteer.launch({
    args: [...chrome.args, '--hide-scrollbars', '--disable-web-security'],
    defaultViewport: chrome.defaultViewport,
    executablePath: await chrome.executablePath,
    headless: true,
    ignoreHTTPSErrors: true,
  });
  // Create a new page
  const page = await browser.newPage();

  // Website URL to export as pdf
  const website_url = 'https://main.d1vkma8fugi4mi.amplifyapp.com/pdf'; 

  // Open URL in current page
  await page.goto(website_url, { waitUntil: 'networkidle0' }); 
  // await page.evaluate(() => {
  //   localStorage.setItem('wealthtech-auth', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2RlIjoiYWNjLTAwMDA5MSIsImVtYWlsIjoiZW1haWxAZ21haWwuY29tIiwiaWF0IjoxNjk1OTU3Mzg5fQ.GgrPBKGJFbwLWhLxD1SoLrUZTwARzOhk7kAMbymeg8Q');
  // });
  await page.goto(website_url);
  //To reflect CSS used for screens instead of print
  await page.emulateMediaType('screen');

  const pdf = await page.pdf({
    format: "A4",
    printBackground: true,
    preferCSSPageSize: true,
    margin: { top: '50px', right: '50px', bottom: '50px', left: '50px' },
  });

  // Close the browser instance
  await browser.close();

  //  SENDING BACK PDF IN RESPONCE TO API CALL
  res.contentType("application/pdf");
  res.send(pdf);  
};


exports.generate_pdf_with_css = async (req, res) => { 
  let browser = await puppeteer.launch({
    args: [...chrome.args, '--hide-scrollbars', '--disable-web-security'],
    defaultViewport: chrome.defaultViewport,
    executablePath: await chrome.executablePath,
    headless: true,
    ignoreHTTPSErrors: true,
  });
  const page = await browser.newPage();
  const logo_url = "https://programatically.com/file/2021/10/Nginx-Docker-BG.webp";

  // FETCHING LOGO FROM URL AND CONVERTING INTO BASE64
  var logo = await fetch(logo_url)
    .then((response) => response.buffer())
    .then((buffer) => buffer.toString("base64"))
    .catch(console.error);

  //  ADDING CSS TO HTML BODY CONTENT
  const html = await `<style> ${fs.readFileSync(`./bootstrap.css`, "utf8")} </style> ${fs.readFileSync(`./dummy.html`, "utf8")}`; 
  await page.setContent(html, { waitUntil: "domcontentloaded"});

  //  ADDING HEADER FOOTER CSS
  // var cssb = [];
  // cssb.push(
  //   `<style> ${fs.readFileSync("./header_footer.css", "utf8", (err, data) =>
  //     data.toString()
  //   )} </style>`
  // );
  // const css = cssb.join("");

  const pdf = await page.pdf({
    format: "A4",
    printBackground: false,
    preferCSSPageSize: true,
    displayHeaderFooter: true,

    headerTemplate: `<div class="header"><img width="100" src="data:image/png;base64, ${logo}" alt="company_logo"> <h1>Main Heading</h1></div> `,
    footerTemplate: '<footer><h5>Page <span class="pageNumber"></span> of <span class="totalPages"></span></h5></footer>',
    margin: { top: "200px", bottom: "150px", right: "20px", left: "20px" },
  });

  //  SENDING BACK PDF IN RESPONCE TO API CALL
  res.contentType("application/pdf");
  res.send(pdf);  
};