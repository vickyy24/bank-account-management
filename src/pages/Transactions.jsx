import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAccounts } from "../services/accountService";
import { getTransactions } from "../services/transactionService";

function Transactions(){

    const navigate = useNavigate();

    const [accounts,setAccounts] = useState([]);
    const [transactions,setTransactions] = useState([]);
    const [accountId,setAccountId] = useState("");
    const [transactionType,setTransactionType] = useState("");
    const [searchInput,setSearchInput] = useState("");
    const [search,setSearch] = useState("");
    const [loading,setLoading] = useState(false);
    const [accountsLoading,setAccountsLoading] = useState(true);
    const [error,setError] = useState("");
    const [currentPage,setCurrentPage] = useState(1);

    const recordsPerPage = 5;

    useEffect(() => {

        loadAccounts();

    },[]);

    useEffect(() => {

        const timer = setTimeout(() => {

            setSearch(searchInput.trim().toLowerCase());
            setCurrentPage(1);

        },400);

        return () => clearTimeout(timer);

    },[searchInput]);

    useEffect(() => {

        if(accountId){

            loadTransactions();

        }
        else{

            setTransactions([]);

        }

    },[accountId]);

    async function loadAccounts(){

        try{

            setAccountsLoading(true);
            setError("");

            const data = await getAccounts();

            setAccounts(Array.isArray(data) ? data : []);

        }
        catch(error){

            if(error.response){

                setError(
                    error.response.data?.message ||
                    "Unable to load accounts"
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

            setAccountsLoading(false);

        }

    }

    async function loadTransactions(){

        try{

            setLoading(true);
            setError("");

            const data = await getTransactions(accountId);

            setTransactions(Array.isArray(data) ? data : []);
            setCurrentPage(1);

        }
        catch(error){

            if(error.response){

                setError(
                    error.response.data?.message ||
                    "Unable to load transactions"
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

    }

    function handleAccountChange(e){

        setAccountId(e.target.value);
        setTransactionType("");
        setSearchInput("");
        setSearch("");
        setCurrentPage(1);
        setError("");

    }

    function handleTransactionTypeChange(e){

        setTransactionType(e.target.value);
        setCurrentPage(1);

    }

    const filteredTransactions = transactions.filter((transaction) => {

        const matchesType =
            transactionType === "" ||
            transaction.transaction_type === transactionType;

        const matchesSearch =
            String(transaction.transaction_id)
                .toLowerCase()
                .includes(search) ||
            transaction.transaction_type
                ?.toLowerCase()
                .includes(search) ||
            transaction.description
                ?.toLowerCase()
                .includes(search) ||
            String(transaction.amount)
                .toLowerCase()
                .includes(search);

        return matchesType && matchesSearch;

    });

    const totalPages = Math.ceil(
        filteredTransactions.length / recordsPerPage
    );

    const startIndex =
        (currentPage - 1) * recordsPerPage;

    const currentTransactions =
        filteredTransactions.slice(
            startIndex,
            startIndex + recordsPerPage
        );

    function goToPreviousPage(){

        if(currentPage > 1){

            setCurrentPage(currentPage - 1);

        }

    }

    function goToNextPage(){

        if(currentPage < totalPages){

            setCurrentPage(currentPage + 1);

        }

    }

    return(

        <div className="min-h-screen bg-gray-100 p-4 sm:p-6">

            <div className="mx-auto max-w-7xl">

                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div>

                        <h1 className="text-2xl font-semibold text-gray-800">
                            Transactions
                        </h1>

                        <p className="mt-1 text-sm text-gray-500">
                            View and manage account transactions
                        </p>

                    </div>

                    <button
                        type="button"
                        onClick={() => navigate("/transactions/add")}
                        className="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 sm:w-auto"
                    >
                        Add Transaction
                    </button>

                </div>

                {error && (

                    <div className="mb-5 flex flex-col gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">

                        <p className="text-sm text-red-700">
                            {error}
                        </p>

                        <button
                            type="button"
                            onClick={() => {

                                if(accountId){

                                    loadTransactions();

                                }
                                else{

                                    loadAccounts();

                                }

                            }}
                            className="text-sm font-medium text-red-700 underline"
                        >
                            Retry
                        </button>

                    </div>

                )}

                <div className="mb-5 rounded-xl bg-white p-4 shadow-sm sm:p-5">

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

                        <div>

                            <label
                                htmlFor="account"
                                className="mb-1 block text-sm font-medium text-gray-700"
                            >
                                Account
                            </label>

                            <select
                                id="account"
                                value={accountId}
                                onChange={handleAccountChange}
                                disabled={accountsLoading}
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100"
                            >

                                <option value="">
                                    {accountsLoading
                                        ? "Loading Accounts..."
                                        : "Select Account"}
                                </option>

                                {accounts.map((account) => (

                                    <option
                                        key={account.account_id}
                                        value={account.account_id}
                                    >
                                        {account.account_number} - {account.customer_name}
                                    </option>

                                ))}

                            </select>

                        </div>

                        <div>

                            <label
                                htmlFor="transactionType"
                                className="mb-1 block text-sm font-medium text-gray-700"
                            >
                                Transaction Type
                            </label>

                            <select
                                id="transactionType"
                                value={transactionType}
                                onChange={handleTransactionTypeChange}
                                disabled={!accountId}
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100"
                            >

                                <option value="">
                                    All Transactions
                                </option>

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
                                htmlFor="search"
                                className="mb-1 block text-sm font-medium text-gray-700"
                            >
                                Search
                            </label>

                            <input
                                id="search"
                                type="text"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                disabled={!accountId}
                                placeholder="Search transactions"
                                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100"
                            />

                        </div>

                    </div>

                </div>

                <div className="overflow-hidden rounded-xl bg-white shadow-sm">

                    {!accountId ? (

                        <div className="flex min-h-64 items-center justify-center p-5">

                            <p className="text-center text-sm text-gray-500">
                                Select an account to view transactions
                            </p>

                        </div>

                    ) : loading ? (

                        <div className="flex min-h-64 items-center justify-center">

                            <p className="text-sm text-gray-500">
                                Loading Transactions...
                            </p>

                        </div>

                    ) : currentTransactions.length === 0 ? (

                        <div className="flex min-h-64 items-center justify-center p-5">

                            <p className="text-center text-sm text-gray-500">
                                No Transactions Found
                            </p>

                        </div>

                    ) : (

                        <div className="overflow-x-auto">

                            <table className="w-full min-w-225">

                                <thead className="bg-gray-50">

                                    <tr>

                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                                            Transaction ID
                                        </th>

                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                                            Type
                                        </th>

                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                                            Amount
                                        </th>

                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                                            Description
                                        </th>

                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                                            Balance
                                        </th>

                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                                            Date
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {currentTransactions.map((transaction) => (

                                        <tr
                                            key={transaction.transaction_id}
                                            className="border-t border-gray-200 hover:bg-gray-50"
                                        >

                                            <td className="px-4 py-3 text-sm text-gray-800">
                                                {transaction.transaction_id}
                                            </td>

                                            <td className="px-4 py-3 text-sm">

                                                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                                                    transaction.transaction_type === "Deposit"
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-700"
                                                }`}>
                                                    {transaction.transaction_type}
                                                </span>

                                            </td>

                                            <td className="px-4 py-3 text-sm font-medium text-gray-800">
                                                ₹ {Number(transaction.amount).toLocaleString("en-IN", {
                                                    minimumFractionDigits:2,
                                                    maximumFractionDigits:2
                                                })}
                                            </td>

                                            <td className="max-w-xs wrap-break-word px-4 py-3 text-sm text-gray-700">
                                                {transaction.description || "-"}
                                            </td>

                                            <td className="px-4 py-3 text-sm text-gray-800">
                                                ₹ {Number(transaction.balance).toLocaleString("en-IN", {
                                                    minimumFractionDigits:2,
                                                    maximumFractionDigits:2
                                                })}
                                            </td>

                                            <td className="px-4 py-3 text-sm text-gray-700">
                                                {new Date(transaction.transaction_date).toLocaleString("en-IN")}
                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                    )}

                    {accountId && !loading && filteredTransactions.length > 0 && (

                        <div className="flex flex-col gap-3 border-t border-gray-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">

                            <p className="text-sm text-gray-500">

                                Showing {startIndex + 1} to{" "}
                                {Math.min(
                                    startIndex + recordsPerPage,
                                    filteredTransactions.length
                                )}{" "}
                                of {filteredTransactions.length}

                            </p>

                            <div className="flex items-center justify-between gap-2 sm:justify-end">

                                <button
                                    type="button"
                                    disabled={currentPage === 1}
                                    onClick={goToPreviousPage}
                                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    Previous
                                </button>

                                <span className="whitespace-nowrap text-sm text-gray-600">
                                    Page {currentPage} of {totalPages}
                                </span>

                                <button
                                    type="button"
                                    disabled={currentPage === totalPages}
                                    onClick={goToNextPage}
                                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    Next
                                </button>

                            </div>

                        </div>

                    )}

                </div>

            </div>

        </div>

    );

}

export default Transactions;