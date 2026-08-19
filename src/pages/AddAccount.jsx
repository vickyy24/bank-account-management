// src/pages/AddAccount.jsx

import { useEffect,useState } from "react";
import { useNavigate,useParams } from "react-router-dom";
import {
    addAccount,
    getAccountById,
    updateAccount
} from "../services/accountService";

const AddAccount = () => {

    const navigate = useNavigate();
    const { id } = useParams();

    const isEditMode = Boolean(id);

    const [formData,setFormData] = useState({
        customer_name: "",
        account_number: "",
        email: "",
        phone: "",
        account_type: "",
        balance: "",
        status: "Active",
        opening_date: ""
    });

    const [loading,setLoading] = useState(false);
    const [pageLoading,setPageLoading] = useState(false);
    const [error,setError] = useState("");
    const [success,setSuccess] = useState("");

    useEffect(() => {

        if(isEditMode){

            loadAccount();

        }

    },[id]);

    const loadAccount = async () => {

        try{

            setPageLoading(true);
            setError("");

            const data = await getAccountById(id);

            const account =
                data?.data ||
                data?.account ||
                data;

            setFormData({
                customer_name: account?.customer_name || "",
                account_number: account?.account_number || "",
                email: account?.email || "",
                phone: account?.phone || account?.mobile || "",
                account_type: account?.account_type || "",
                balance: account?.balance ?? "",
                status: account?.status || "Active",
                opening_date: account?.opening_date
                    ? String(account.opening_date).split("T")[0]
                    : ""
            });

        }
        catch(error){

            if(error.response){

                setError(
                    error.response.data?.message ||
                    "Unable to load account"
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

            setPageLoading(false);

        }

    };

    const handleChange = (e) => {

        const { name,value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");

        if(!formData.customer_name.trim()){

            setError("Customer name is required");
            return;

        }

        if(!formData.account_number.trim()){

            setError("Account number is required");
            return;

        }

        if(!formData.email.trim()){

            setError("Email is required");
            return;

        }

        if(!formData.phone.trim()){

            setError("Phone number is required");
            return;

        }

        if(!formData.account_type){

            setError("Account type is required");
            return;

        }

        if(formData.balance === "" || Number(formData.balance) < 0){

            setError("Enter a valid balance");
            return;

        }

        if(!formData.opening_date){

            setError("Opening date is required");
            return;

        }

        try{

            setLoading(true);

            const data = {
                customer_name: formData.customer_name.trim(),
                account_number: formData.account_number.trim(),
                email: formData.email.trim(),
                phone: formData.phone.trim(),
                account_type: formData.account_type,
                balance: Number(formData.balance),
                status: formData.status,
                opening_date: formData.opening_date
            };

            if(isEditMode){

                await updateAccount(id,data);

                setSuccess("Account updated successfully");

            }
            else{

                await addAccount(data);

                setSuccess("Account created successfully");

            }

            setTimeout(() => {

                navigate("/accounts");

            },1000);

        }
        catch(error){

            if(error.response){

                setError(
                    error.response.data?.message ||
                    (isEditMode
                        ? "Unable to update account"
                        : "Unable to create account")
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

    const handleCancel = () => {

        navigate("/accounts");

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

                <button type="button" onClick={handleCancel} className="mb-3 text-sm font-medium text-blue-600 hover:underline">
                    ← Back to Accounts
                </button>

                <h1 className="text-2xl font-semibold text-gray-800">
                    {isEditMode ? "Edit Account" : "Add Account"}
                </h1>

                <p className="mt-1 text-sm text-gray-600">
                    {isEditMode
                        ? "Update bank account information"
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

            <form onSubmit={handleSubmit} className="rounded-xl border bg-white p-5 shadow-sm sm:p-6">

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                    <div>

                        <label htmlFor="customer_name" className="mb-1 block text-sm font-medium text-gray-700">
                            Customer Name
                        </label>

                        <input id="customer_name" name="customer_name" type="text" value={formData.customer_name} onChange={handleChange} autoComplete="name" placeholder="Enter customer name" className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500" />

                    </div>

                    <div>

                        <label htmlFor="account_number" className="mb-1 block text-sm font-medium text-gray-700">
                            Account Number
                        </label>

                        <input id="account_number" name="account_number" type="text" value={formData.account_number} onChange={handleChange} autoComplete="off" placeholder="Enter account number" className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500" />

                    </div>

                    <div>

                        <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
                            Email
                        </label>

                        <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} autoComplete="email" placeholder="Enter email address" className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500" />

                    </div>

                    <div>

                        <label htmlFor="phone" className="mb-1 block text-sm font-medium text-gray-700">
                            Phone Number
                        </label>

                        <input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} autoComplete="tel" placeholder="Enter phone number" className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500" />

                    </div>

                    <div>

                        <label htmlFor="account_type" className="mb-1 block text-sm font-medium text-gray-700">
                            Account Type
                        </label>

                        <select id="account_type" name="account_type" value={formData.account_type} onChange={handleChange} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500">

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

                    </div>

                    <div>

                        <label htmlFor="balance" className="mb-1 block text-sm font-medium text-gray-700">
                            Balance
                        </label>

                        <input id="balance" name="balance" type="number" min="0" step="0.01" value={formData.balance} onChange={handleChange} placeholder="Enter balance" className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500" />

                    </div>

                    <div>

                        <label htmlFor="status" className="mb-1 block text-sm font-medium text-gray-700">
                            Status
                        </label>

                        <select id="status" name="status" value={formData.status} onChange={handleChange} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500">

                            <option value="Active">
                                Active
                            </option>

                            <option value="Inactive">
                                Inactive
                            </option>

                        </select>

                    </div>

                    <div>

                        <label htmlFor="opening_date" className="mb-1 block text-sm font-medium text-gray-700">
                            Opening Date
                        </label>

                        <input id="opening_date" name="opening_date" type="date" value={formData.opening_date} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500" />

                    </div>

                </div>

                <div className="mt-6 flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:justify-end">

                    <button type="button" onClick={handleCancel} disabled={loading} className="w-full rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto">
                        Cancel
                    </button>

                    <button type="submit" disabled={loading} className="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto">
                        {loading
                            ? "Saving..."
                            : isEditMode
                                ? "Update Account"
                                : "Create Account"}
                    </button>

                </div>

            </form>

        </div>

    );

};

export default AddAccount;