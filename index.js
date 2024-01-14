const express = require('express');
var cors = require('cors')
const app = express();
const service = require('./service');

const PORT = process.env.PORT || 3000;

app.use(cors())
app.use(express.json());


app.get("/test", service.hello_world);
app.post("/test-post", service.test_post);
app.post("/pdf", service.generate_pdf);
app.post("/pdf-html", service.generate_pdf_html);
// app.post("/pdf-with-css", service.generate_pdf_with_css);


app.listen(PORT, ()=> {
    console.log(`project running on port 3000`);
});
