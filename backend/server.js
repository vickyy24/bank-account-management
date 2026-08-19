const express = require("express");
const cors = require("cors");

const {addAccount, getAccounts, getAccountById, updateAccount, deleteAccount} = require("./Controllers/accountController");
const {addTransaction, getTransactions} = require("./Controllers/transactionController");
const {getDashboard} = require("./Controllers/dashboardController");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/addaccount", addAccount);

app.get("/getaccounts", getAccounts);

app.get("/getaccount/:accountid", getAccountById);

app.put("/updateaccount/:accountid", updateAccount);

app.delete("/deleteaccount/:accountid", deleteAccount);

app.post("/addtransaction", addTransaction);

app.get("/gettransactions/:accountid", getTransactions);

app.get("/getdashboard", getDashboard);

app.listen(9000, function(){
    console.log("Server Started");
});