const express = require('express');
const cors = require('cors')
const app = express();
const service = require('./service');

app.use(express.json());


app.get("/test", cors(), service.hello_world);
app.post("/pdf", cors(), service.generate_pdf);
app.post("/pdf-html", service.generate_pdf_html);
app.post("/pdf-with-css", service.generate_pdf_with_css);


app.listen(3000, ()=> {
    console.log(`project running on port 3000`);
});
