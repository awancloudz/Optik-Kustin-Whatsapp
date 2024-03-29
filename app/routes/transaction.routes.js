module.exports = app => {
    const transaction = require("../controllers/transaction.controller")
    const route = require("express").Router();

    route.post("/scanwa", transaction.initwhatsapp);
    route.post("/", transaction.sendwhatsapp);

    app.use("/transaction", route);
}