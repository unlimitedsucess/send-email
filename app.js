const express = require("express");
const bodyParser = require("body-parser");
const helmet = require('helmet');
const cors = require('cors');

const app = express();

const emailRoutes = require("./routes/email");

app.use(helmet());

app.use(bodyParser.json());

app.use(cors({
    origin: '*',
    methods: ['GET,OPTIONS,PATCH,DELETE,POST,PUT']
  }));

app.use("/api/v1", emailRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
