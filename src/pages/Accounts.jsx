// src/pages/Accounts.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    getAccounts,
    deleteAccount
} from "../services/accountService";

const Accounts = () => {

    const navigate = useNavigate();

    const [accounts,setAccounts] = useState([]);

    const [search,setSearch] = useState("");
    const [accountType,setAccountType] = useState("");
    const [branch,setBranch] = useState("");
    const [status,setStatus] = useState("");
    const [minBalance,setMinBalance] = useState("");
    const [maxBalance,setMaxBalance] = useState("");
    const [createdDate,setCreatedDate] = useState("");

    const [sortField,setSortField] = useState("");
    const [sortDirection,setSortDirection] = useState("asc");

    const [currentPage,setCurrentPage] = useState(1);

    const [loading,setLoading] = useState(true);
    const [error,setError] = useState("");
    const [deleteLoading,setDeleteLoading] = useState(false);

    const itemsPerPage = 8;

    useEffect(() => {

        loadAccounts();

    }, []);

    const loadAccounts = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await getAccounts();

            const data =
                Array.isArray(response)
                    ? response
                    : Array.isArray(response?.data)
                        ? response.data
                        : Array.isArray(response?.accounts)
                            ? response.accounts
                            : [];

            setAccounts(data);

        }
        catch(error) {

            setError(
                error.response?.data?.message ||
                "Unable to load accounts"
            );

        }
        finally {

            setLoading(false);

        }

    };

    const getValue = (account,keys) => {

        for(const key of keys) {

            if(
                account[key] !== undefined &&
                account[key] !== null
            ) {

                return account[key];

            }

        }

        return "";

    };

    const getAccountNumber = (account) => {

        return getValue(account,[
            "account_number",
            "accountNumber"
        ]);

    };

    const getCustomerName = (account) => {

        return getValue(account,[
            "customer_name",
            "customerName"
        ]);

    };

    const getAccountType = (account) => {

        return getValue(account,[
            "account_type",
            "accountType"
        ]);

    };

    const getBranch = (account) => {

        return getValue(account,[
            "branch",
            "branch_name",
            "branchName"
        ]);

    };

    const getBalance = (account) => {

        return Number(
            getValue(account,[
                "balance",
                "current_balance",
                "currentBalance"
            ]) || 0
        );

    };

    const getStatus = (account) => {

        return getValue(account,[
            "status"
        ]);

    };

    const getCreatedDate = (account) => {

        return getValue(account,[
            "created_date",
            "createdDate",
            "created_at"
        ]);

    };

    const handleSort = (field) => {

        if(sortField === field) {

            setSortDirection(
                sortDirection === "asc"
                    ? "desc"
                    : "asc"
            );

        }
        else {

            setSortField(field);
            setSortDirection("asc");

        }

    };

    const clearFilters = () => {

        setSearch("");
        setAccountType("");
        setBranch("");
        setStatus("");
        setMinBalance("");
        setMaxBalance("");
        setCreatedDate("");
        setCurrentPage(1);

    };

    const handleDelete = async (account) => {

        const accountId =
            account.id ||
            account.accountid ||
            account.account_id;

        if(!accountId) {

            setError("Account ID is missing");

            return;

        }

        const confirmed = window.confirm(
            `Are you sure you want to delete account ${getAccountNumber(account)}?`
        );

        if(!confirmed) {

            return;

        }

        try {

            setDeleteLoading(true);
            setError("");

            await deleteAccount(accountId);

            setAccounts((previousAccounts) =>
                previousAccounts.filter(
                    (item) =>
                        (item.id ||
                        item.accountid ||
                        item.account_id) !== accountId
                )
            );

        }
        catch(error) {

            setError(
                error.response?.data?.message ||
                "Unable to delete account"
            );

        }
        finally {

            setDeleteLoading(false);

        }

    };

    let filteredAccounts = accounts.filter((account) => {

        const customerName =
            String(getCustomerName(account)).toLowerCase();

        const accountNumber =
            String(getAccountNumber(account)).toLowerCase();

        const accountBranch =
            String(getBranch(account)).toLowerCase();

        const searchValue =
            search.toLowerCase().trim();

        const matchesSearch =
            !searchValue ||
            customerName.includes(searchValue) ||
            accountNumber.includes(searchValue);

        const matchesType =
            !accountType ||
            String(getAccountType(account)).toLowerCase() ===
            accountType.toLowerCase();

        const matchesBranch =
            !branch ||
            accountBranch.includes(branch.toLowerCase());

        const matchesStatus =
            !status ||
            String(getStatus(account)).toLowerCase() ===
            status.toLowerCase();

        const balance = getBalance(account);

        const matchesMinBalance =
            minBalance === "" ||
            balance >= Number(minBalance);

        const matchesMaxBalance =
            maxBalance === "" ||
            balance <= Number(maxBalance);

        const accountDate =
            getCreatedDate(account)
                ? new Date(getCreatedDate(account))
                    .toISOString()
                    .slice(0,10)
                : "";

        const matchesDate =
            !createdDate ||
            accountDate === createdDate;

        return (
            matchesSearch &&
            matchesType &&
            matchesBranch &&
            matchesStatus &&
            matchesMinBalance &&
            matchesMaxBalance &&
            matchesDate
        );

    });

    if(sortField) {

        filteredAccounts.sort((a,b) => {

            let valueA;
            let valueB;

            if(sortField === "customerName") {

                valueA = String(
                    getCustomerName(a)
                ).toLowerCase();

                valueB = String(
                    getCustomerName(b)
                ).toLowerCase();

            }
            else if(sortField === "balance") {

                valueA = getBalance(a);
                valueB = getBalance(b);

            }
            else if(sortField === "createdDate") {

                valueA = new Date(
                    getCreatedDate(a) || 0
                ).getTime();

                valueB = new Date(
                    getCreatedDate(b) || 0
                ).getTime();

            }

            if(valueA < valueB) {

                return sortDirection === "asc"
                    ? -1
                    : 1;

            }

            if(valueA > valueB) {

                return sortDirection === "asc"
                    ? 1
                    : -1;

            }

            return 0;

        });

    }

    const totalPages =
        Math.ceil(
            filteredAccounts.length /
            itemsPerPage
        );

    const safeCurrentPage =
        totalPages === 0
            ? 1
            : Math.min(currentPage,totalPages);

    const startIndex =
        (safeCurrentPage - 1) *
        itemsPerPage;

    const paginatedAccounts =
        filteredAccounts.slice(
            startIndex,
            startIndex + itemsPerPage
        );

    const formatDate = (value) => {

        if(!value) {

            return "-";

        }

        return new Date(value).toLocaleDateString(
            "en-IN"
        );

    };

    const handleFilterChange = (setter,value) => {

        setter(value);
        setCurrentPage(1);

    };

    if(loading) {

        return (

            <div className="flex min-h-100 items-center justify-center">

                <p className="text-sm text-gray-500">
                    Loading Accounts...
                </p>

            </div>

        );

    }

    return (

        <div>

            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>

                    <h1 className="text-2xl font-semibold text-gray-800">
                        Accounts
                    </h1>

                    <p className="mt-1 text-sm text-gray-600">
                        Manage bank accounts
                    </p>

                </div>

                <button
                    type="button"
                    onClick={() => navigate("/accounts/add")}
                    className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
                >
                    + Add Account
                </button>

            </div>

            {error && (

                <div className="mb-5 flex items-center justify-between rounded-lg border border-red-200 bg-red-50 px-4 py-3">

                    <p className="text-sm text-red-700">
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={loadAccounts}
                        className="text-sm font-medium text-red-700 underline"
                    >
                        Retry
                    </button>

                </div>

            )}

            <div className="mb-5 rounded-xl border bg-white p-5 shadow-sm">

                <div className="mb-4 flex items-center justify-between">

                    <h2 className="text-lg font-semibold text-gray-800">
                        Search & Filters
                    </h2>

                    <button
                        type="button"
                        onClick={clearFilters}
                        className="text-sm font-medium text-blue-600 hover:underline"
                    >
                        Clear Filters
                    </button>

                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

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
                            value={search}
                            onChange={(e) =>
                                handleFilterChange(
                                    setSearch,
                                    e.target.value
                                )
                            }
                            placeholder="Account number or customer"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                        />

                    </div>

                    <div>

                        <label
                            htmlFor="accountType"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
                            Account Type
                        </label>

                        <select
                            id="accountType"
                            value={accountType}
                            onChange={(e) =>
                                handleFilterChange(
                                    setAccountType,
                                    e.target.value
                                )
                            }
                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                        >

                            <option value="">
                                All Types
                            </option>

                            <option value="Savings">
                                Savings
                            </option>

                            <option value="Current">
                                Current
                            </option>

                            <option value="Salary">
                                Salary
                            </option>

                        </select>

                    </div>

                    <div>

                        <label
                            htmlFor="branch"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
                            Branch
                        </label>

                        <input
                            id="branch"
                            type="text"
                            value={branch}
                            onChange={(e) =>
                                handleFilterChange(
                                    setBranch,
                                    e.target.value
                                )
                            }
                            placeholder="Branch name"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                        />

                    </div>

                    <div>

                        <label
                            htmlFor="status"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
                            Status
                        </label>

                        <select
                            id="status"
                            value={status}
                            onChange={(e) =>
                                handleFilterChange(
                                    setStatus,
                                    e.target.value
                                )
                            }
                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                        >

                            <option value="">
                                All Statuses
                            </option>

                            <option value="Active">
                                Active
                            </option>

                            <option value="Inactive">
                                Inactive
                            </option>

                        </select>

                    </div>

                    <div>

                        <label
                            htmlFor="minBalance"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
                            Minimum Balance
                        </label>

                        <input
                            id="minBalance"
                            type="number"
                            min="0"
                            value={minBalance}
                            onChange={(e) =>
                                handleFilterChange(
                                    setMinBalance,
                                    e.target.value
                                )
                            }
                            placeholder="0"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                        />

                    </div>

                    <div>

                        <label
                            htmlFor="maxBalance"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
                            Maximum Balance
                        </label>

                        <input
                            id="maxBalance"
                            type="number"
                            min="0"
                            value={maxBalance}
                            onChange={(e) =>
                                handleFilterChange(
                                    setMaxBalance,
                                    e.target.value
                                )
                            }
                            placeholder="No maximum"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                        />

                    </div>

                    <div>

                        <label
                            htmlFor="createdDate"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
                            Created Date
                        </label>

                        <input
                            id="createdDate"
                            type="date"
                            value={createdDate}
                            onChange={(e) =>
                                handleFilterChange(
                                    setCreatedDate,
                                    e.target.value
                                )
                            }
                            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                        />

                    </div>

                </div>

            </div>

            <div className="overflow-hidden rounded-xl border bg-white shadow-sm">

                <div className="flex items-center justify-between border-b px-5 py-4">

                    <div>

                        <h2 className="text-lg font-semibold text-gray-800">
                            Account List
                        </h2>

                        <p className="mt-1 text-xs text-gray-500">
                            {filteredAccounts.length} account(s)
                        </p>

                    </div>

                </div>

                {paginatedAccounts.length === 0 ? (

                    <div className="px-5 py-12 text-center">

                        <p className="text-sm font-medium text-gray-700">
                            No accounts found
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                            Try changing your search or filters.
                        </p>

                    </div>

                ) : (

                    <div className="overflow-x-auto">

                        <table className="w-full min-w-275">

                            <thead className="bg-gray-50">

                                <tr>

                                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                        Account Number
                                    </th>

                                    <th
                                        className="cursor-pointer px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500 hover:bg-gray-100"
                                        onClick={() =>
                                            handleSort("customerName")
                                        }
                                    >
                                        Customer Name
                                        {sortField === "customerName" &&
                                            (sortDirection === "asc"
                                                ? " ↑"
                                                : " ↓")}
                                    </th>

                                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                        Account Type
                                    </th>

                                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                        Branch
                                    </th>

                                    <th
                                        className="cursor-pointer px-5 py-3 text-right text-xs font-semibold uppercase text-gray-500 hover:bg-gray-100"
                                        onClick={() =>
                                            handleSort("balance")
                                        }
                                    >
                                        Balance
                                        {sortField === "balance" &&
                                            (sortDirection === "asc"
                                                ? " ↑"
                                                : " ↓")}
                                    </th>

                                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                        Status
                                    </th>

                                    <th
                                        className="cursor-pointer px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500 hover:bg-gray-100"
                                        onClick={() =>
                                            handleSort("createdDate")
                                        }
                                    >
                                        Created Date
                                        {sortField === "createdDate" &&
                                            (sortDirection === "asc"
                                                ? " ↑"
                                                : " ↓")}
                                    </th>

                                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                        Actions
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {paginatedAccounts.map((account,index) => {

                                    const id =
                                        account.id ||
                                        account.accountid ||
                                        account.account_id;

                                    const statusValue =
                                        String(
                                            getStatus(account)
                                        ).toLowerCase();

                                    return (

                                        <tr
                                            key={
                                                id ||
                                                getAccountNumber(account) ||
                                                index
                                            }
                                            className="border-t border-gray-200 hover:bg-gray-50"
                                        >

                                            <td className="px-5 py-4 text-sm font-medium text-gray-800">
                                                {getAccountNumber(account) || "-"}
                                            </td>

                                            <td className="px-5 py-4 text-sm text-gray-700">
                                                {getCustomerName(account) || "-"}
                                            </td>

                                            <td className="px-5 py-4 text-sm text-gray-700">
                                                {getAccountType(account) || "-"}
                                            </td>

                                            <td className="px-5 py-4 text-sm text-gray-700">
                                                {getBranch(account) || "-"}
                                            </td>

                                            <td className="px-5 py-4 text-right text-sm font-medium text-gray-800">
                                                ₹{" "}
                                                {getBalance(account)
                                                    .toLocaleString("en-IN")}
                                            </td>

                                            <td className="px-5 py-4">

                                                <span
                                                    className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                                                        statusValue === "active"
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-red-100 text-red-700"
                                                    }`}
                                                >
                                                    {getStatus(account) || "-"}
                                                </span>

                                            </td>

                                            <td className="px-5 py-4 text-sm text-gray-700">
                                                {formatDate(
                                                    getCreatedDate(account)
                                                )}
                                            </td>

                                            <td className="px-5 py-4">

                                                <div className="flex items-center gap-3">

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            navigate(
                                                                `/accounts/${id}`
                                                            )
                                                        }
                                                        className="text-sm font-medium text-blue-600 hover:underline"
                                                    >
                                                        View
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            navigate(
                                                                `/accounts/${id}/edit`
                                                            )
                                                        }
                                                        className="text-sm font-medium text-gray-700 hover:underline"
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        type="button"
                                                        disabled={deleteLoading}
                                                        onClick={() =>
                                                            handleDelete(account)
                                                        }
                                                        className="text-sm font-medium text-red-600 hover:underline disabled:opacity-50"
                                                    >
                                                        Delete
                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    );

                                })}

                            </tbody>

                        </table>

                    </div>

                )}

                {totalPages > 1 && (

                    <div className="flex flex-col gap-3 border-t px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

                        <p className="text-sm text-gray-500">

                            Showing{" "}
                            {startIndex + 1}
                            {" "}to{" "}
                            {Math.min(
                                startIndex + itemsPerPage,
                                filteredAccounts.length
                            )}
                            {" "}of{" "}
                            {filteredAccounts.length}

                        </p>

                        <div className="flex items-center gap-2">

                            <button
                                type="button"
                                disabled={safeCurrentPage === 1}
                                onClick={() =>
                                    setCurrentPage(
                                        safeCurrentPage - 1
                                    )
                                }
                                className="rounded-lg border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Previous
                            </button>

                            <span className="px-2 text-sm text-gray-600">
                                Page {safeCurrentPage} of {totalPages}
                            </span>

                            <button
                                type="button"
                                disabled={
                                    safeCurrentPage === totalPages
                                }
                                onClick={() =>
                                    setCurrentPage(
                                        safeCurrentPage + 1
                                    )
                                }
                                className="rounded-lg border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Next
                            </button>

                        </div>

                    </div>

                )}

            </div>

        </div>

    );

};

export default Accounts;