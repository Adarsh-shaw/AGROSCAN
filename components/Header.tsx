
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-emerald-100 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="bg-emerald-600 p-2 rounded-lg">
            <i className="fas fa-leaf text-white text-xl"></i>
          </div>
          <h1 className="text-xl font-bold text-gray-800">AgroScan <span className="text-emerald-600">Pro</span></h1>
        </div>
        <div className="hidden md:flex items-center space-x-6">
          <a href="#" className="text-sm font-medium text-gray-600 hover:text-emerald-600">Dashboard</a>
          <a href="#" className="text-sm font-medium text-gray-600 hover:text-emerald-600">History</a>
          <a href="#" className="bg-emerald-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-emerald-700 transition">Expert Help</a>
        </div>
      </div>
    </header>
  );
};

export default Header;
