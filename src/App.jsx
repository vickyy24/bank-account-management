// src/App.jsx

import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import MainLayout from "./components/layout/MainLayout";

import Dashboard from "./pages/Dashboard";
import Accounts from "./pages/Accounts";
import AddAccount from "./pages/AddAccount";
import AccountDetails from "./pages/AccountDetails";
import Transactions from "./pages/Transactions";

function App() {

    return (

        <BrowserRouter>

            <MainLayout>

                <Routes>

                    <Route
                        path="/"
                        element={
                            <Navigate
                                to="/dashboard"
                                replace
                            />
                        }
                    />

                    <Route
                        path="/dashboard"
                        element={<Dashboard />}
                    />

                    <Route
                        path="/accounts"
                        element={<Accounts />}
                    />

                    <Route
                        path="/accounts/add"
                        element={<AddAccount />}
                    />

                    <Route
                        path="/accounts/:id"
                        element={<AccountDetails />}
                    />

                    <Route
                        path="/accounts/:id/edit"
                        element={<AddAccount />}
                    />

                    <Route
                        path="/accounts/:id/transactions"
                        element={<Transactions />}
                    />

                    <Route
                        path="*"
                        element={
                            <Navigate
                                to="/dashboard"
                                replace
                            />
                        }
                    />

                </Routes>

            </MainLayout>

        </BrowserRouter>

    );

}

export default App;