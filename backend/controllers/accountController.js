const con = require("../Config/db");

async function addAccount(req, res){

    try{
        
        const d= req.body;

        const [result] = await con.query(
            `SELECT * FROM Accounts_table
            WHERE account_number=?`,[d.AccountNumber]
        );

        if(result.length > 0){
            res.status(409).send({message: "Account Already Exists"});
        }
        else if(d.Balance < 0){
            res.status(400).send({message: "Balance Cannot Be Negative"});
        }
        else{
            await con.query(
                `INSERT INTO Accounts_table
                (account_number, customer_name, account_type, branch, ifsc_code, balance, email, mobile, status)
                VALUES(?,?,?,?,?,?,?,?,?)`,
                [d.AccountNumber,d.CustomerName,d.AccountType,d.Branch,d.IfscCode,d.Balance,d.Email,d.Mobile,d.Status]
            );

            res.status(200).send({message:"Account Added Successfully"});
        }

    }
    catch(error){
        res.status(500).send({message: error.message});
    }
}

async function getAccounts(req, res){

    try{

        const [result] = await con.query(`SELECT * FROM Accounts_table ORDER BY created_date DESC`);

        res.status(200).send(result);

    }
    catch(error){
        res.status(500).send({message: error.message});
    }
}

async function getAccountById(req, res){

    try{

        const accountid = req.params.accountid;

        const [result] = await con.query(
            `SELECT * FROM Accounts_table WHERE account_id=?`,[accountid]
        );

        if(result.length === 0){
            res.status(404).send({message: "Account Not Found"});
        }
        else{
            res.status(200).send(result[0]);
        }

    }
    catch(error){
        res.status(500).send({message: error.message});
    }
}

async function updateAccount(req, res){

    try{
        
        const d = req.body;

        const accountid = req.params.accountid;

        const [result] = await con.query(
            `SELECT * FROM Accounts_table
            WHERE account_number=? AND account_id!=?`,
            [d.AccountNumber,accountid]
        );

        if(result.length > 0){
            res.status(409).send({message: "Account Already Exists"});
        }
        else if(d.Balance < 0){
            res.status(400).send({message: "Balance Cannot Be Negative"});
        }
        else{

            await con.query(
                `UPDATE Accounts_table SET
                account_number=?,
                customer_name=?,
                account_type=?,
                branch=?,
                ifsc_code=?,
                balance=?,
                email=?,
                mobile=?,
                status=?
                WHERE account_id=?`,
                [d.AccountNumber,d.CustomerName,d.AccountType,d.Branch,d.IfscCode,d.Balance,d.Email,d.Mobile,d.Status,accountid]
            );

            res.status(200).send({
                message: "Account Updated Successfully"
            });

        }

    }
    catch(error){
        res.status(500).send({message: error.message});
    }

}

async function deleteAccount(req, res){

    try{

        const accountid = req.params.accountid;

        const [result] = await con.query(
            `DELETE FROM Accounts_table WHERE account_id=?`,[accountid]
        );

        if(result.affectedRows === 0){
            res.status(404).send({message: "Account Not Found"});
        }
        else{
            res.status(200).send({message: "Account Deleted Successfully"});
        }

    }
    catch(error){
        res.status(500).send({message: error.message});
    }

}

module.exports = {addAccount, getAccounts, getAccountById, updateAccount, deleteAccount};