import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/public/Header';
import Footer from '../components/public/Footer';

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-600 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* 1. Sticky Header */}
      <Header />

      {/* Main Content Area (Home, Services, etc. render here) */}
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>

      {/* 7. Minimal Footer */}
      <Footer />
    </div>
  );
}