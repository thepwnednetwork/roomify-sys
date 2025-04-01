
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getBookings, getRooms } from '@/lib/localStorageUtils';
import { formatCurrency } from '@/utils/formatters';
import { Hotel, Calendar, Receipt, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalRooms: 0,
    availableRooms: 0,
    totalBookings: 0,
    activeBookings: 0,
    revenue: 0
  });

  useEffect(() => {
    const rooms = getRooms();
    const bookings = getBookings();

    const availableRooms = rooms.filter(room => room.status === 'available').length;
    const activeBookings = bookings.filter(booking => booking.status === 'confirmed').length;
    const revenue = bookings.reduce((total, booking) => {
      return booking.status !== 'cancelled' ? total + booking.totalPrice : total;
    }, 0);

    setStats({
      totalRooms: rooms.length,
      availableRooms,
      totalBookings: bookings.length,
      activeBookings,
      revenue
    });
  }, []);

  // Recent bookings
  const [recentBookings, setRecentBookings] = useState([]);
  useEffect(() => {
    const bookings = getBookings();
    // Sort by creation date (newest first) and take top 5
    const recent = [...bookings]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
    setRecentBookings(recent);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Link to="/rooms">
          <Button>
            Book a Room
            <ArrowUpRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Rooms</CardTitle>
            <Hotel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRooms}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.availableRooms} rooms available
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeBookings}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.totalBookings} total bookings
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
            <Hotel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalRooms ? Math.round(((stats.totalRooms - stats.availableRooms) / stats.totalRooms) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.totalRooms - stats.availableRooms} rooms occupied
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.revenue)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              From {stats.totalBookings} bookings
            </p>
          </CardContent>
        </Card>
      </div>

      <div>
        <Card>
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
            <CardDescription>
              Recently created bookings
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentBookings.length > 0 ? (
              <div className="space-y-2">
                {recentBookings.map(booking => (
                  <div 
                    key={booking.id} 
                    className="flex items-center justify-between p-3 bg-secondary/10 rounded-md"
                  >
                    <div>
                      <p className="font-medium">{booking.guestName}</p>
                      <p className="text-sm text-muted-foreground">Room {booking.roomNumber} - {booking.roomType}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(booking.totalPrice)}</p>
                      <p className="text-sm text-muted-foreground">{new Date(booking.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                No recent bookings found
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
