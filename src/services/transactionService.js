// src/services/transactionService.js

import axios from "axios";

const API_URL = "http://localhost:9000";

async function getTransactions(accountid){

    const response = await axios.get(
        `${API_URL}/gettransactions/${accountid}`
    );

    return response.data;

}

async function getTransactionById(transactionid){

    const response = await axios.get(
        `${API_URL}/gettransaction/${transactionid}`
    );

    return response.data;

}

async function createTransaction(data){

    const response = await axios.post(
        `${API_URL}/addtransaction`,
        data
    );

    return response.data;

}

async function deposit(accountid,data){

    const response = await axios.post(
        `${API_URL}/deposit/${accountid}`,
        data
    );

    return response.data;

}

async function withdraw(accountid,data){

    const response = await axios.post(
        `${API_URL}/withdraw/${accountid}`,
        data
    );

    return response.data;

}

export {
    getTransactions,
    getTransactionById,
    createTransaction,
    deposit,
    withdraw
};