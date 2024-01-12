const express = require('express');
const app = express();
const service = require('./service');
const cors = require('cors');

const options = [
    cors({
      origin: '*',
      methods: '*',
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    })
  ];

app.use(options);
app.use(express.json());


app.get("/test", service.hello_world);
app.post("/pdf", service.generate_pdf);
app.post("/pdf-html", service.generate_pdf_html);
app.post("/pdf-with-css", service.generate_pdf_with_css);


app.listen(3000, ()=> {
    console.log(`project running on port 3000`);
});
