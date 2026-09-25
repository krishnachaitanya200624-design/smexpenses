import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const pageTitles = {
  '/dashboard': 'Financial Dashboard',
  '/expenses': 'Expenses Manager',
  '/income': 'Income Streams',
  '/budgets': 'Category Budgets',
  '/goals': 'Savings Goals',
  '/splitter': 'Expense Splitter & Settlements',
  '/planning': 'Wealth Planning & Calculator',
  '/analytics': 'Financial Analytics & Trends',
  '/insights': 'AI Financial Insights',
  '/settings': 'Account Settings & Preferences',
};

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const currentTitle = pageTitles[location.pathname] || 'SmartWealth';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      {/* Fixed/Collapsible Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <Navbar
          onOpenSidebar={() => setSidebarOpen(true)}
          pageTitle={currentTitle}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
