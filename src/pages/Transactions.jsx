// src/pages/Transactions.jsx

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    getAccountById
} from "../services/accountService";
import {
    getTransactions,
    createTransaction
} from "../services/transactionService";

const Transactions = () => {

    const { id } = useParams();
    const navigate = useNavigate();

    const [account,setAccount] = useState(null);
    const [transactions,setTransactions] = useState([]);

    const [formData,setFormData] = useState({
        transactionType: "Deposit",
        amount: "",
        description: ""
    });

    const [loading,setLoading] = useState(true);
    const [submitting,setSubmitting] = useState(false);
    const [error,setError] = useState("");
    const [success,setSuccess] = useState("");

    useEffect(() => {

        loadData();

    },[id]);

    const loadData = async () => {

        try{

            setLoading(true);
            setError("");

            const accountResponse = await getAccountById(id);

            const accountData =
                accountResponse?.data ||
                accountResponse?.account ||
                accountResponse;

            setAccount(accountData);

            const transactionResponse = await getTransactions(id);

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
                    "Unable to load transaction data"
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

    const handleChange = (e) => {

        const { name,value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });

        setError("");
        setSuccess("");

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");

        const amount = Number(formData.amount);
        const currentBalance = Number(account?.balance || 0);

        if(!account){

            setError("Account information is unavailable");
            return;

        }

        if(String(account.status).toLowerCase() !== "active"){

            setError("Inactive accounts cannot perform transactions");
            return;

        }

        if(!formData.amount || amount <= 0){

            setError("Transaction amount must be greater than 0");
            return;

        }

        if(
            formData.transactionType === "Withdrawal" &&
            amount > currentBalance
        ){

            setError("Withdrawal amount cannot exceed the current balance");
            return;

        }

        try{

            setSubmitting(true);

            const data = {
                accountid: id,
                transaction_type: formData.transactionType,
                amount: amount,
                description: formData.description.trim()
            };

            const response = await createTransaction(data);

            const newTransaction =
                response?.data ||
                response?.transaction ||
                response;

            if(newTransaction && typeof newTransaction === "object"){

                setTransactions((previousTransactions) => [
                    newTransaction,
                    ...previousTransactions
                ]);

            }

            const updatedBalance =
                formData.transactionType === "Deposit"
                    ? currentBalance + amount
                    : currentBalance - amount;

            setAccount({
                ...account,
                balance: updatedBalance
            });

            setFormData({
                transactionType: "Deposit",
                amount: "",
                description: ""
            });

            setSuccess(
                `${formData.transactionType} completed successfully`
            );

            await loadData();

        }
        catch(error){

            if(error.response){

                setError(
                    error.response.data?.message ||
                    "Transaction failed"
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

            setSubmitting(false);

        }

    };

    if(loading){

        return(

            <div className="flex min-h-100 items-center justify-center">

                <p className="text-sm text-gray-500">
                    Loading Transactions...
                </p>

            </div>

        );

    }

    return(

        <div>

            <div className="mb-6">

                <button
                    type="button"
                    onClick={() => navigate(`/accounts/${id}`)}
                    className="mb-3 text-sm font-medium text-blue-600 hover:underline"
                >
                    ← Back to Account
                </button>

                <h1 className="text-2xl font-semibold text-gray-800">
                    Transactions
                </h1>

                <p className="mt-1 text-sm text-gray-600">
                    Manage deposits and withdrawals
                </p>

            </div>

            {error && (

                <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3">

                    <p className="text-sm text-red-700">
                        {error}
                    </p>

                </div>

            )}

            {success && (

                <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3">

                    <p className="text-sm text-green-700">
                        {success}
                    </p>

                </div>

            )}

            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

                <div className="rounded-xl border bg-white p-5">

                    <p className="text-sm text-gray-500">
                        Account Number
                    </p>

                    <p className="mt-2 font-semibold text-gray-800">
                        {account?.account_number || "-"}
                    </p>

                </div>

                <div className="rounded-xl border bg-white p-5">

                    <p className="text-sm text-gray-500">
                        Account Holder
                    </p>

                    <p className="mt-2 font-semibold text-gray-800">
                        {account?.customer_name || "-"}
                    </p>

                </div>

                <div className="rounded-xl border bg-white p-5">

                    <p className="text-sm text-gray-500">
                        Current Balance
                    </p>

                    <p className="mt-2 text-xl font-semibold text-gray-800">
                        ₹ {Number(account?.balance || 0).toLocaleString("en-IN")}
                    </p>

                </div>

            </div>

            <div className="mb-6 rounded-xl border bg-white p-5 shadow-sm sm:p-6">

                <h2 className="mb-5 text-lg font-semibold text-gray-800">
                    New Transaction
                </h2>

                <form onSubmit={handleSubmit}>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

                        <div>

                            <label
                                htmlFor="transactionType"
                                className="mb-1 block text-sm font-medium text-gray-700"
                            >
                                Transaction Type
                            </label>

                            <select
                                id="transactionType"
                                name="transactionType"
                                value={formData.transactionType}
                                onChange={handleChange}
                                disabled={
                                    submitting ||
                                    String(account?.status).toLowerCase() !== "active"
                                }
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 disabled:bg-gray-100"
                            >

                                <option value="Deposit">
                                    Deposit
                                </option>

                                <option value="Withdrawal">
                                    Withdrawal
                                </option>

                            </select>

                        </div>

                        <div>

                            <label
                                htmlFor="amount"
                                className="mb-1 block text-sm font-medium text-gray-700"
                            >
                                Amount
                            </label>

                            <input
                                id="amount"
                                name="amount"
                                type="number"
                                min="0.01"
                                step="0.01"
                                value={formData.amount}
                                onChange={handleChange}
                                disabled={
                                    submitting ||
                                    String(account?.status).toLowerCase() !== "active"
                                }
                                placeholder="Enter amount"
                                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 disabled:bg-gray-100"
                            />

                        </div>

                        <div>

                            <label
                                htmlFor="description"
                                className="mb-1 block text-sm font-medium text-gray-700"
                            >
                                Description
                            </label>

                            <input
                                id="description"
                                name="description"
                                type="text"
                                value={formData.description}
                                onChange={handleChange}
                                disabled={
                                    submitting ||
                                    String(account?.status).toLowerCase() !== "active"
                                }
                                placeholder="Enter description"
                                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 disabled:bg-gray-100"
                            />

                        </div>

                    </div>

                    {String(account?.status).toLowerCase() !== "active" && (

                        <div className="mt-4 rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3">

                            <p className="text-sm text-yellow-700">
                                This account is inactive. Transactions are disabled.
                            </p>

                        </div>

                    )}

                    <div className="mt-5 flex justify-end">

                        <button
                            type="submit"
                            disabled={
                                submitting ||
                                String(account?.status).toLowerCase() !== "active"
                            }
                            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {submitting
                                ? "Processing..."
                                : formData.transactionType === "Deposit"
                                    ? "Deposit"
                                    : "Withdraw"}
                        </button>

                    </div>

                </form>

            </div>

            <div className="overflow-hidden rounded-xl border bg-white shadow-sm">

                <div className="border-b px-5 py-4">

                    <h2 className="text-lg font-semibold text-gray-800">
                        Transaction History
                    </h2>

                </div>

                {transactions.length === 0 ? (

                    <div className="px-6 py-12 text-center">

                        <p className="text-sm text-gray-500">
                            No transactions found.
                        </p>

                    </div>

                ) : (

                    <div className="overflow-x-auto">

                        <table className="w-full min-w-200">

                            <thead className="bg-gray-50">

                                <tr>

                                    <th className="px-5 py-3 text-left text-sm font-semibold text-gray-600">
                                        Date
                                    </th>

                                    <th className="px-5 py-3 text-left text-sm font-semibold text-gray-600">
                                        Transaction ID
                                    </th>

                                    <th className="px-5 py-3 text-left text-sm font-semibold text-gray-600">
                                        Type
                                    </th>

                                    <th className="px-5 py-3 text-left text-sm font-semibold text-gray-600">
                                        Description
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

                                {transactions.map((transaction) => {

                                    const type =
                                        transaction.transaction_type ||
                                        transaction.transactionType ||
                                        transaction.type ||
                                        "-";

                                    const isDeposit =
                                        String(type).toLowerCase() === "deposit";

                                    const date =
                                        transaction.transaction_date ||
                                        transaction.transactionDate ||
                                        transaction.date ||
                                        transaction.created_at ||
                                        transaction.createdAt ||
                                        "";

                                    const transactionId =
                                        transaction.transactionid ||
                                        transaction.transaction_id ||
                                        transaction.transactionId ||
                                        transaction.id;

                                    const amount =
                                        Number(transaction.amount || 0);

                                    const balance =
                                        Number(
                                            transaction.balance ||
                                            transaction.running_balance ||
                                            transaction.runningBalance ||
                                            0
                                        );

                                    return(

                                        <tr
                                            key={transactionId}
                                            className="border-t border-gray-200"
                                        >

                                            <td className="px-5 py-3 text-sm text-gray-700">
                                                {date
                                                    ? new Date(date).toLocaleDateString("en-IN")
                                                    : "-"}
                                            </td>

                                            <td className="px-5 py-3 text-sm font-medium text-gray-800">
                                                {transactionId || "-"}
                                            </td>

                                            <td className="px-5 py-3">

                                                <span
                                                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                                                        isDeposit
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-red-100 text-red-700"
                                                    }`}
                                                >
                                                    {type}
                                                </span>

                                            </td>

                                            <td className="px-5 py-3 text-sm text-gray-700">
                                                {transaction.description || "-"}
                                            </td>

                                            <td
                                                className={`px-5 py-3 text-right text-sm font-semibold ${
                                                    isDeposit
                                                        ? "text-green-600"
                                                        : "text-red-600"
                                                }`}
                                            >
                                                {isDeposit ? "+" : "-"} ₹{" "}
                                                {amount.toLocaleString("en-IN")}
                                            </td>

                                            <td className="px-5 py-3 text-right text-sm font-medium text-gray-800">
                                                ₹ {balance.toLocaleString("en-IN")}
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

export default Transactions;