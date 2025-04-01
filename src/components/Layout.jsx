
import React from 'react';
import { Sidebar } from './Sidebar';
import { useToast } from '@/hooks/use-toast';

export const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-background to-secondary/30">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
