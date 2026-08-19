// src/pages/AccountForm.jsx

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    getAccounts,
    getAccountById,
    addAccount,
    updateAccount
} from "../services/accountService";

const AccountForm = () => {

    const { id } = useParams();
    const navigate = useNavigate();

    const isEdit = Boolean(id);

    const [formData,setFormData] = useState({
        customer_name: "",
        account_number: "",
        account_type: "",
        branch: "",
        ifsc_code: "",
        balance: "",
        email: "",
        mobile_number: "",
        status: "Active"
    });

    const [accounts,setAccounts] = useState([]);

    const [errors,setErrors] = useState({});
    const [loading,setLoading] = useState(false);
    const [pageLoading,setPageLoading] = useState(isEdit);
    const [error,setError] = useState("");
    const [success,setSuccess] = useState("");

    useEffect(() => {

        loadForm();

    },[id]);

    const loadForm = async () => {

        try{

            setPageLoading(true);

            const accountsResponse = await getAccounts();

            const accountsData =
                Array.isArray(accountsResponse)
                    ? accountsResponse
                    : Array.isArray(accountsResponse?.data)
                        ? accountsResponse.data
                        : Array.isArray(accountsResponse?.accounts)
                            ? accountsResponse.accounts
                            : [];

            setAccounts(accountsData);

            if(isEdit){

                const response = await getAccountById(id);

                const account =
                    response?.data ||
                    response?.account ||
                    response;

                setFormData({
                    customer_name: account.customer_name || "",
                    account_number: account.account_number || "",
                    account_type: account.account_type || "",
                    branch: account.branch || account.branch_name || "",
                    ifsc_code: account.ifsc_code || account.ifscCode || "",
                    balance: account.balance ?? "",
                    email: account.email || "",
                    mobile_number:
                        account.mobile_number ||
                        account.mobileNumber ||
                        "",
                    status: account.status || "Active"
                });

            }

        }
        catch(error){

            setError(
                error.response?.data?.message ||
                "Unable to load account"
            );

        }
        finally{

            setPageLoading(false);

        }

    };

    const handleChange = (e) => {

        const { name,value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });

        setErrors({
            ...errors,
            [name]: ""
        });

        setError("");
        setSuccess("");

    };

    const validate = () => {

        const newErrors = {};

        if(!formData.customer_name.trim()){

            newErrors.customer_name =
                "Customer name is required";

        }

        if(!formData.account_number.trim()){

            newErrors.account_number =
                "Account number is required";

        }
        else{

            const duplicate = accounts.some((account) => {

                const accountId =
                    account.id ||
                    account.accountid ||
                    account.account_id;

                return (
                    String(account.account_number).trim().toLowerCase() ===
                    formData.account_number.trim().toLowerCase() &&
                    String(accountId) !== String(id)
                );

            });

            if(duplicate){

                newErrors.account_number =
                    "Account number already exists";

            }

        }

        if(!formData.account_type){

            newErrors.account_type =
                "Account type is required";

        }

        if(!formData.branch.trim()){

            newErrors.branch =
                "Branch is required";

        }

        if(!formData.ifsc_code.trim()){

            newErrors.ifsc_code =
                "IFSC code is required";

        }

        if(formData.balance === ""){

            newErrors.balance =
                "Initial balance is required";

        }
        else if(Number(formData.balance) < 0){

            newErrors.balance =
                "Initial balance cannot be negative";

        }

        if(!formData.email.trim()){

            newErrors.email =
                "Email is required";

        }
        else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)){

            newErrors.email =
                "Enter a valid email address";

        }

        if(!formData.mobile_number.trim()){

            newErrors.mobile_number =
                "Mobile number is required";

        }
        else if(!/^[0-9]{10}$/.test(formData.mobile_number)){

            newErrors.mobile_number =
                "Mobile number must contain exactly 10 digits";

        }

        if(!formData.status){

            newErrors.status =
                "Status is required";

        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");

        if(!validate()){

            return;

        }

        try{

            setLoading(true);

            const data = {
                customer_name: formData.customer_name.trim(),
                account_number: formData.account_number.trim(),
                account_type: formData.account_type,
                branch: formData.branch.trim(),
                ifsc_code: formData.ifsc_code.trim().toUpperCase(),
                balance: Number(formData.balance),
                email: formData.email.trim(),
                mobile_number: formData.mobile_number.trim(),
                status: formData.status
            };

            if(isEdit){

                await updateAccount(id,data);

                setSuccess("Account updated successfully");

            }
            else{

                await addAccount(data);

                setSuccess("Account created successfully");

            }

            setTimeout(() => {

                navigate("/accounts");

            },800);

        }
        catch(error){

            if(error.response){

                setError(
                    error.response.data?.message ||
                    "Unable to save account"
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

    const ErrorMessage = ({ name }) => {

        if(!errors[name]){

            return null;

        }

        return(

            <p className="mt-1 text-xs text-red-600">
                {errors[name]}
            </p>

        );

    };

    if(pageLoading){

        return(

            <div className="flex min-h-100 items-center justify-center">

                <p className="text-sm text-gray-500">
                    Loading Account...
                </p>

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

                <h1 className="text-2xl font-semibold text-gray-800">
                    {isEdit ? "Edit Account" : "Add Account"}
                </h1>

                <p className="mt-1 text-sm text-gray-600">
                    {isEdit
                        ? "Update account information"
                        : "Create a new bank account"}
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

            <form
                onSubmit={handleSubmit}
                className="rounded-xl border bg-white p-5 shadow-sm sm:p-6"
            >

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                    <div>

                        <label
                            htmlFor="customer_name"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
                            Customer Name
                        </label>

                        <input
                            id="customer_name"
                            name="customer_name"
                            type="text"
                            value={formData.customer_name}
                            onChange={handleChange}
                            placeholder="Enter customer name"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                        />

                        <ErrorMessage name="customer_name" />

                    </div>

                    <div>

                        <label
                            htmlFor="account_number"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
                            Account Number
                        </label>

                        <input
                            id="account_number"
                            name="account_number"
                            type="text"
                            value={formData.account_number}
                            onChange={handleChange}
                            placeholder="Enter unique account number"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                        />

                        <ErrorMessage name="account_number" />

                    </div>

                    <div>

                        <label
                            htmlFor="account_type"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
                            Account Type
                        </label>

                        <select
                            id="account_type"
                            name="account_type"
                            value={formData.account_type}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                        >

                            <option value="">
                                Select Account Type
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

                        <ErrorMessage name="account_type" />

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
                            name="branch"
                            type="text"
                            value={formData.branch}
                            onChange={handleChange}
                            placeholder="Enter branch name"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                        />

                        <ErrorMessage name="branch" />

                    </div>

                    <div>

                        <label
                            htmlFor="ifsc_code"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
                            IFSC Code
                        </label>

                        <input
                            id="ifsc_code"
                            name="ifsc_code"
                            type="text"
                            value={formData.ifsc_code}
                            onChange={handleChange}
                            placeholder="Enter IFSC code"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm uppercase outline-none focus:border-blue-500"
                        />

                        <ErrorMessage name="ifsc_code" />

                    </div>

                    <div>

                        <label
                            htmlFor="balance"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
                            Initial Balance
                        </label>

                        <input
                            id="balance"
                            name="balance"
                            type="number"
                            min="0"
                            step="0.01"
                            value={formData.balance}
                            onChange={handleChange}
                            placeholder="Enter initial balance"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                        />

                        <ErrorMessage name="balance" />

                    </div>

                    <div>

                        <label
                            htmlFor="email"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
                            Email
                        </label>

                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="customer@example.com"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                        />

                        <ErrorMessage name="email" />

                    </div>

                    <div>

                        <label
                            htmlFor="mobile_number"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
                            Mobile Number
                        </label>

                        <input
                            id="mobile_number"
                            name="mobile_number"
                            type="tel"
                            maxLength="10"
                            value={formData.mobile_number}
                            onChange={handleChange}
                            placeholder="10-digit mobile number"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                        />

                        <ErrorMessage name="mobile_number" />

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
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                        >

                            <option value="Active">
                                Active
                            </option>

                            <option value="Inactive">
                                Inactive
                            </option>

                        </select>

                        <ErrorMessage name="status" />

                    </div>

                </div>

                <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                    <button
                        type="button"
                        onClick={() => navigate("/accounts")}
                        disabled={loading}
                        className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={loading}
                        className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {loading
                            ? "Saving..."
                            : isEdit
                                ? "Update Account"
                                : "Create Account"}
                    </button>

                </div>

            </form>

        </div>

    );

};

export default AccountForm;