const con = require("../Config/db");

async function getDashboard(req, res){

    try{

        const [totalAccounts] = await con.query(`SELECT COUNT(*) AS totalAccounts FROM Accounts_table`);

        const [activeAccounts] = await con.query(`SELECT COUNT(*) AS activeAccounts FROM Accounts_table WHERE status='Active'`);

        const [inactiveAccounts] = await con.query(`SELECT COUNT(*) AS inactiveAccounts FROM Accounts_table WHERE status='Inactive'`);

        const [totalBalance] = await con.query(`SELECT COALESCE(SUM(balance),0) AS totalBalance FROM Accounts_table`);

        const [accountTypes] = await con.query(
            `SELECT account_type AS accountType, COUNT(*) AS total
            FROM Accounts_table
            GROUP BY account_type`
        );

        res.status(200).send({
            totalAccounts: totalAccounts[0].totalAccounts,
            activeAccounts: activeAccounts[0].activeAccounts,
            inactiveAccounts: inactiveAccounts[0].inactiveAccounts,
            totalBalance: totalBalance[0].totalBalance,
            accountTypes: accountTypes
        });

    }
    catch(error){
        res.status(500).send({message: error.message});
    }

}

module.exports = {getDashboard};