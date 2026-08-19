// src/components/layout/MainLayout.jsx

import { useState } from "react";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const MainLayout = ({ children }) => {

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleOpenSidebar = () => {

        setIsSidebarOpen(true);

    };

    const handleCloseSidebar = () => {

        setIsSidebarOpen(false);

    };

    return (

        <div className="min-h-screen bg-gray-50">

            <div className="flex min-h-screen">

                <Sidebar
                    isOpen={isSidebarOpen}
                    onClose={handleCloseSidebar}
                />

                <div className="min-w-0 flex-1">

                    <Navbar
                        onMenuClick={handleOpenSidebar}
                    />

                    <main className="p-4 sm:p-6 lg:p-8">
                        {children}
                    </main>

                </div>

            </div>

        </div>

    );

};

export default MainLayout;