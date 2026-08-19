// src/pages/Dashboard.jsx

import { useEffect, useState } from "react";
import { getDashboardData } from "../services/dashboardService";

const Dashboard = () => {

    const [dashboardData,setDashboardData] = useState({
        totalAccounts: 0,
        activeAccounts: 0,
        inactiveAccounts: 0,
        totalBalance: 0,
        savingsAccounts: 0,
        currentAccounts: 0,
        salaryAccounts: 0
    });

    const [loading,setLoading] = useState(true);
    const [error,setError] = useState("");

    useEffect(() => {

        loadDashboard();

    },[]);

    const loadDashboard = async () => {

        try{

            setLoading(true);
            setError("");

            const data = await getDashboardData();

            setDashboardData({
                totalAccounts: data?.totalAccounts || 0,
                activeAccounts: data?.activeAccounts || 0,
                inactiveAccounts: data?.inactiveAccounts || 0,
                totalBalance: Number(data?.totalBalance) || 0,
                savingsAccounts: data?.savingsAccounts || 0,
                currentAccounts: data?.currentAccounts || 0,
                salaryAccounts: data?.salaryAccounts || 0
            });

        }
        catch(error){

            if(error.response){

                setError(
                    error.response.data?.message ||
                    "Unable to load dashboard data"
                );

            }
            else if(error.request){

                setError("Server is not responding");

            }
            else{

                setError("Something went wrong");

            }

        }
        finally{

            setLoading(false);

        }

    };

    if(loading){

        return(

            <div className="flex min-h-100 items-center justify-center">

                <p className="text-sm text-gray-500">
                    Loading Dashboard...
                </p>

            </div>

        );

    }

    return(

        <div>

            <div className="mb-6">

                <h1 className="text-2xl font-semibold text-gray-800">
                    Dashboard
                </h1>

                <p className="mt-1 text-gray-600">
                    Overview of bank accounts
                </p>

            </div>

            {error && (

                <div className="mb-6 flex flex-col gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">

                    <p className="text-sm text-red-700">
                        {error}
                    </p>

                    <button type="button" onClick={loadDashboard} className="text-sm font-medium text-red-700 underline">
                        Retry
                    </button>

                </div>

            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

                <div className="rounded-lg border bg-white p-5">

                    <p className="text-sm text-gray-500">
                        Total Accounts
                    </p>

                    <h2 className="mt-2 text-2xl font-semibold text-gray-800">
                        {dashboardData.totalAccounts}
                    </h2>

                </div>

                <div className="rounded-lg border bg-white p-5">

                    <p className="text-sm text-gray-500">
                        Active Accounts
                    </p>

                    <h2 className="mt-2 text-2xl font-semibold text-green-600">
                        {dashboardData.activeAccounts}
                    </h2>

                </div>

                <div className="rounded-lg border bg-white p-5">

                    <p className="text-sm text-gray-500">
                        Inactive Accounts
                    </p>

                    <h2 className="mt-2 text-2xl font-semibold text-red-600">
                        {dashboardData.inactiveAccounts}
                    </h2>

                </div>

                <div className="rounded-lg border bg-white p-5">

                    <p className="text-sm text-gray-500">
                        Total Account Balance
                    </p>

                    <h2 className="mt-2 text-2xl font-semibold text-gray-800">
                        ₹ {dashboardData.totalBalance.toLocaleString("en-IN")}
                    </h2>

                </div>

            </div>

            <div className="mt-6 rounded-lg border bg-white p-5">

                <h2 className="mb-4 text-lg font-semibold text-gray-800">
                    Account Types
                </h2>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

                    <div className="rounded-lg border p-4">

                        <p className="text-sm text-gray-500">
                            Savings
                        </p>

                        <p className="mt-2 text-xl font-semibold text-gray-800">
                            {dashboardData.savingsAccounts}
                        </p>

                    </div>

                    <div className="rounded-lg border p-4">

                        <p className="text-sm text-gray-500">
                            Current
                        </p>

                        <p className="mt-2 text-xl font-semibold text-gray-800">
                            {dashboardData.currentAccounts}
                        </p>

                    </div>

                    <div className="rounded-lg border p-4">

                        <p className="text-sm text-gray-500">
                            Salary
                        </p>

                        <p className="mt-2 text-xl font-semibold text-gray-800">
                            {dashboardData.salaryAccounts}
                        </p>

                    </div>

                </div>

            </div>

        </div>

    );

};

export default Dashboard;