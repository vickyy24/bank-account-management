import axios from "axios";

const API_URL = "http://localhost:9000";

async function getAccounts(){

    const response = await axios.get(`${API_URL}/getaccounts`);

    return response.data;

}

async function getAccountById(accountid){

    const response = await axios.get(`${API_URL}/getaccount/${accountid}`);

    return response.data;

}

async function addAccount(data){

    const response = await axios.post(`${API_URL}/addaccount`, data);

    return response.data;

}

async function updateAccount(accountid, data){

    const response = await axios.put(`${API_URL}/updateaccount/${accountid}`, data);

    return response.data;

}

async function deleteAccount(accountid){

    const response = await axios.delete(`${API_URL}/deleteaccount/${accountid}`);

    return response.data;

}

export {
    getAccounts,
    getAccountById,
    addAccount,
    updateAccount,
    deleteAccount
};