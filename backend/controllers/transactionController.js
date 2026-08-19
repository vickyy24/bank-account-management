const con = require("../Config/db");

async function addTransaction(req, res){

    try{

        const d= req.body;

        const accountid = d.AccountId;

        const [result] = await con.query(
            `SELECT * FROM Accounts_table
            WHERE account_id=?`,[accountid]
        );

        if(result.length === 0){

            res.status(404).send({message: "Account Not Found"});

        }
        else{

            const account = result[0];

            if(d.Amount <= 0){

                res.status(400).send({message: "Amount Must Be Greater Than 0"});

            }
            else if(d.TransactionType === "Withdrawal" && account.balance < d.Amount){

                res.status(400).send({message: "Insufficient Balance"});

            }
            else{

                let newBalance;

                if(d.TransactionType === "Deposit"){

                    newBalance = Number(account.balance) + Number(d.Amount);

                }
                else{

                    newBalance = Number(account.balance) - Number(d.Amount);

                }

                await con.query(
                    `UPDATE Accounts_table SET balance=? WHERE account_id=?`,
                    [newBalance,accountid]
                );

                await con.query(
                    `INSERT INTO Transactions_table
                    (account_id, transaction_type, amount, description, balance)
                    VALUES(?,?,?,?,?)`,
                    [accountid,d.TransactionType,d.Amount,d.Description,newBalance]
                );

                res.status(200).send({
                    message:"Transaction Added Successfully"
                });

            }

        }

    }
    catch(error){
        res.status(500).send({message: error.message});
    }

}

async function getTransactions(req, res){

    try{

        const accountid = req.params.accountid;

        const [result] = await con.query(
            `SELECT * FROM Transactions_table
            WHERE account_id=?
            ORDER BY transaction_date DESC`,
            [accountid]
        );

        res.status(200).send(result);

    }
    catch(error){
        res.status(500).send({message: error.message});
    }

}

module.exports = {addTransaction, getTransactions};