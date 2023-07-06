require("dotenv").config();
const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const route = require("../routes/user");
const { createDB, createTable } = require("./DBconfig");

const app = express();
app.use(bodyParser.json());
app.use(morgan("common"));

async function parserHandler() {
    // route of static file
    app.use(express.static("public"));
}

async function engineHandler() {
    // use tabplate engine (handlebars)
    app.engine(
        ".hbs",
        exphbs.engine({ extname: ".hbs", defaultLayout: "main" })
    );
    app.set("view engine", ".hbs");
}
app.use("/", route);

async function runingDatabase() {
    await createDB();
    await createTable();
}

module.exports = {
    app,
    parserHandler,
    engineHandler,
    runingDatabase,
};
