
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Hotel, Calendar, Receipt, Home, ChevronRight } from 'lucide-react';

export const Sidebar = () => {
  const navItems = [
    { path: '/', title: 'Dashboard', icon: <Home size={18} /> },
    { path: '/rooms', title: 'Rooms', icon: <Hotel size={18} /> },
    { path: '/bookings', title: 'Bookings', icon: <Calendar size={18} /> },
    { path: '/receipts', title: 'Receipts', icon: <Receipt size={18} /> },
  ];

  return (
    <aside className="w-64 bg-sidebar border-r border-border flex flex-col h-screen shadow-sm">
      <div className="p-4 border-b border-border">
        <h1 className="text-xl font-semibold flex items-center gap-2 text-primary">
          <Hotel className="text-accent" />
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Roomify
          </span>
        </h1>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                  }`
                }
              >
                {item.icon}
                <span>{item.title}</span>
                {item.path !== '/' && <ChevronRight size={16} className="ml-auto opacity-50" />}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-border">
        <div className="rounded-lg bg-accent/10 p-4 text-sm">
          <p className="font-medium text-accent">Hotel Management System</p>
          <p className="text-muted-foreground mt-1">© 2023 Roomify</p>
        </div>
      </div>
    </aside>
  );
};
