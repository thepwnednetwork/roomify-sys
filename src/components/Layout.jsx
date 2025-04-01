
import React from 'react';
import { Sidebar } from './Sidebar';
import { useToast } from '@/components/ui/toast';

export const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  );
};
