// src/services/dashboardService.js

import axios from "axios";

const API_URL = "http://localhost:9000";

async function getDashboardData(){

    const response = await axios.get(
        `${API_URL}/getdashboard`
    );

    return response.data;

}

export {
    getDashboardData
};