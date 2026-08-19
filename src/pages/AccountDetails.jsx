// src/pages/AccountDetails.jsx

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getAccountById } from "../services/accountService";
import {
    getTransactions
} from "../services/transactionService";

const AccountDetails = () => {

    const { id } = useParams();
    const navigate = useNavigate();

    const [account,setAccount] = useState(null);
    const [transactions,setTransactions] = useState([]);

    const [loading,setLoading] = useState(true);
    const [error,setError] = useState("");

    useEffect(() => {

        loadAccountDetails();

    },[id]);

    const loadAccountDetails = async () => {

        try{

            setLoading(true);
            setError("");

            const accountResponse =
                await getAccountById(id);

            const accountData =
                accountResponse?.data ||
                accountResponse?.account ||
                accountResponse;

            setAccount(accountData);

            const transactionResponse =
                await getTransactions(id);

            const transactionData =
                Array.isArray(transactionResponse)
                    ? transactionResponse
                    : Array.isArray(transactionResponse?.data)
                        ? transactionResponse.data
                        : Array.isArray(transactionResponse?.transactions)
                            ? transactionResponse.transactions
                            : [];

            setTransactions(transactionData);

        }
        catch(error){

            if(error.response){

                setError(
                    error.response.data?.message ||
                    "Unable to load account details"
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

    const formatDate = (value) => {

        if(!value){

            return "-";

        }

        return new Date(value).toLocaleDateString(
            "en-IN"
        );

    };

    if(loading){

        return(

            <div className="flex min-h-100 items-center justify-center">

                <p className="text-sm text-gray-500">
                    Loading Account Details...
                </p>

            </div>

        );

    }

    if(error){

        return(

            <div>

                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3">

                    <p className="text-sm text-red-700">
                        {error}
                    </p>

                </div>

                <button
                    type="button"
                    onClick={loadAccountDetails}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white"
                >
                    Retry
                </button>

            </div>

        );

    }

    if(!account){

        return(

            <div className="rounded-lg border bg-white p-8 text-center">

                <p className="text-gray-600">
                    Account not found.
                </p>

                <button
                    type="button"
                    onClick={() => navigate("/accounts")}
                    className="mt-4 text-sm font-medium text-blue-600 hover:underline"
                >
                    Back to Accounts
                </button>

            </div>

        );

    }

    return(

        <div>

            <div className="mb-6">

                <button
                    type="button"
                    onClick={() => navigate("/accounts")}
                    className="mb-3 text-sm font-medium text-blue-600 hover:underline"
                >
                    ← Back to Accounts
                </button>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                    <div>

                        <h1 className="text-2xl font-semibold text-gray-800">
                            Account Details
                        </h1>

                        <p className="mt-1 text-sm text-gray-600">
                            {account.customer_name || "-"}
                        </p>

                    </div>

                    <div className="flex gap-3">

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    `/accounts/${id}/edit`
                                )
                            }
                            className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Edit Account
                        </button>

                        {String(account.status).toLowerCase() === "active" && (

                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        `/accounts/${id}/transactions`
                                    )
                                }
                                className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
                            >
                                New Transaction
                            </button>

                        )}

                    </div>

                </div>

            </div>

            <div className="rounded-xl border bg-white p-5 shadow-sm sm:p-6">

                <h2 className="mb-5 text-lg font-semibold text-gray-800">
                    Account Information
                </h2>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">

                    <div>

                        <p className="text-xs font-medium uppercase text-gray-500">
                            Account Number
                        </p>

                        <p className="mt-1 text-sm font-medium text-gray-800">
                            {account.account_number || "-"}
                        </p>

                    </div>

                    <div>

                        <p className="text-xs font-medium uppercase text-gray-500">
                            Customer Name
                        </p>

                        <p className="mt-1 text-sm font-medium text-gray-800">
                            {account.customer_name || "-"}
                        </p>

                    </div>

                    <div>

                        <p className="text-xs font-medium uppercase text-gray-500">
                            Account Type
                        </p>

                        <p className="mt-1 text-sm font-medium text-gray-800">
                            {account.account_type || "-"}
                        </p>

                    </div>

                    <div>

                        <p className="text-xs font-medium uppercase text-gray-500">
                            Branch
                        </p>

                        <p className="mt-1 text-sm font-medium text-gray-800">
                            {account.branch ||
                                account.branch_name ||
                                "-"}
                        </p>

                    </div>

                    <div>

                        <p className="text-xs font-medium uppercase text-gray-500">
                            IFSC Code
                        </p>

                        <p className="mt-1 text-sm font-medium text-gray-800">
                            {account.ifsc_code ||
                                account.ifscCode ||
                                "-"}
                        </p>

                    </div>

                    <div>

                        <p className="text-xs font-medium uppercase text-gray-500">
                            Balance
                        </p>

                        <p className="mt-1 text-lg font-semibold text-gray-800">
                            ₹{" "}
                            {Number(
                                account.balance || 0
                            ).toLocaleString("en-IN")}
                        </p>

                    </div>

                    <div>

                        <p className="text-xs font-medium uppercase text-gray-500">
                            Email
                        </p>

                        <p className="mt-1 break-all text-sm text-gray-800">
                            {account.email || "-"}
                        </p>

                    </div>

                    <div>

                        <p className="text-xs font-medium uppercase text-gray-500">
                            Mobile Number
                        </p>

                        <p className="mt-1 text-sm text-gray-800">
                            {account.mobile_number ||
                                account.mobileNumber ||
                                "-"}
                        </p>

                    </div>

                    <div>

                        <p className="text-xs font-medium uppercase text-gray-500">
                            Status
                        </p>

                        <p
                            className={`mt-1 inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                                String(account.status).toLowerCase() === "active"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                            }`}
                        >
                            {account.status || "-"}
                        </p>

                    </div>

                    <div>

                        <p className="text-xs font-medium uppercase text-gray-500">
                            Created Date
                        </p>

                        <p className="mt-1 text-sm text-gray-800">
                            {formatDate(
                                account.created_date ||
                                account.createdDate ||
                                account.created_at
                            )}
                        </p>

                    </div>

                </div>

            </div>

            <div className="mt-6 overflow-hidden rounded-xl border bg-white shadow-sm">

                <div className="border-b px-5 py-4">

                    <h2 className="text-lg font-semibold text-gray-800">
                        Transaction History
                    </h2>

                </div>

                {transactions.length === 0 ? (

                    <div className="px-5 py-10 text-center">

                        <p className="text-sm text-gray-500">
                            No transactions found for this account.
                        </p>

                    </div>

                ) : (

                    <div className="overflow-x-auto">

                        <table className="w-full min-w-175">

                            <thead className="bg-gray-50">

                                <tr>

                                    <th className="px-5 py-3 text-left text-sm font-semibold text-gray-600">
                                        Date
                                    </th>

                                    <th className="px-5 py-3 text-left text-sm font-semibold text-gray-600">
                                        Transaction ID
                                    </th>

                                    <th className="px-5 py-3 text-left text-sm font-semibold text-gray-600">
                                        Transaction Type
                                    </th>

                                    <th className="px-5 py-3 text-right text-sm font-semibold text-gray-600">
                                        Amount
                                    </th>

                                    <th className="px-5 py-3 text-right text-sm font-semibold text-gray-600">
                                        Balance
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {transactions.map((transaction,index) => {

                                    const transactionId =
                                        transaction.transaction_id ||
                                        transaction.transactionid ||
                                        transaction.id ||
                                        index;

                                    const type =
                                        transaction.transaction_type ||
                                        transaction.type ||
                                        "-";

                                    const amount =
                                        Number(
                                            transaction.amount || 0
                                        );

                                    const balance =
                                        Number(
                                            transaction.balance || 0
                                        );

                                    const isDeposit =
                                        String(type).toLowerCase() ===
                                        "deposit";

                                    return(

                                        <tr
                                            key={transactionId}
                                            className="border-t border-gray-200"
                                        >

                                            <td className="px-5 py-4 text-sm text-gray-700">
                                                {formatDate(
                                                    transaction.date ||
                                                    transaction.transaction_date ||
                                                    transaction.created_at
                                                )}
                                            </td>

                                            <td className="px-5 py-4 text-sm font-medium text-gray-800">
                                                {transactionId}
                                            </td>

                                            <td className="px-5 py-4">

                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                                                        isDeposit
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-red-100 text-red-700"
                                                    }`}
                                                >
                                                    {type}
                                                </span>

                                            </td>

                                            <td className={`px-5 py-4 text-right text-sm font-medium ${
                                                isDeposit
                                                    ? "text-green-600"
                                                    : "text-red-600"
                                            }`}>
                                                {isDeposit ? "+" : "-"} ₹{" "}
                                                {amount.toLocaleString(
                                                    "en-IN"
                                                )}
                                            </td>

                                            <td className="px-5 py-4 text-right text-sm font-medium text-gray-800">
                                                ₹{" "}
                                                {balance.toLocaleString(
                                                    "en-IN"
                                                )}
                                            </td>

                                        </tr>

                                    );

                                })}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>

    );

};

export default AccountDetails;