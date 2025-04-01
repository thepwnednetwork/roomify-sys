
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Hotel, Calendar, Book, Receipt, Home } from 'lucide-react';

export const Sidebar = () => {
  const navItems = [
    { path: '/', title: 'Dashboard', icon: <Home size={20} /> },
    { path: '/rooms', title: 'Rooms', icon: <Hotel size={20} /> },
    { path: '/bookings', title: 'Bookings', icon: <Calendar size={20} /> },
    { path: '/receipts', title: 'Receipts', icon: <Receipt size={20} /> },
  ];

  return (
    <aside className="w-64 bg-sidebar border-r border-border flex flex-col h-screen">
      <div className="p-4 border-b border-border">
        <h1 className="text-xl font-bold flex items-center gap-2 text-white">
          <Hotel className="text-primary" />
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Roomify
          </span>
        </h1>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-md transition-all ${
                    isActive
                      ? 'bg-secondary text-white'
                      : 'text-muted-foreground hover:bg-secondary/50 hover:text-white'
                  }`
                }
              >
                {item.icon}
                <span>{item.title}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-border">
        <div className="text-xs text-muted-foreground">
          <p>© 2023 Roomify</p>
          <p>Hotel Management System</p>
        </div>
      </div>
    </aside>
  );
};
