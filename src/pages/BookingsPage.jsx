
import React, { useState, useEffect } from 'react';
import { BookingCard } from '@/components/BookingCard';
import { getBookings, cancelBooking } from '@/lib/localStorageUtils';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Search } from 'lucide-react';

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [cancelId, setCancelId] = useState(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const loadedBookings = getBookings();
    setBookings(loadedBookings);
    setFilteredBookings(loadedBookings);
  }, []);

  useEffect(() => {
    let result = bookings;
    
    // Apply status filter
    if (filter !== 'all') {
      result = result.filter(booking => booking.status === filter);
    }
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(booking => 
        booking.guestName.toLowerCase().includes(query) ||
        booking.roomNumber.toLowerCase().includes(query) ||
        booking.guestEmail.toLowerCase().includes(query)
      );
    }
    
    setFilteredBookings(result);
  }, [bookings, filter, searchQuery]);

  const handleCancelBooking = (id) => {
    setCancelId(id);
  };

  const confirmCancel = () => {
    if (cancelId) {
      const success = cancelBooking(cancelId);
      
      if (success) {
        toast({
          title: "Booking Cancelled",
          description: "The booking has been successfully cancelled."
        });
        
        // Refresh the bookings list
        const updatedBookings = getBookings();
        setBookings(updatedBookings);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not cancel the booking. Please try again."
        });
      }
      
      setCancelId(null);
    }
  };

  const handleViewReceipt = (booking) => {
    navigate(`/receipt/${booking.id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by guest, room number, or email..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div>
          <ToggleGroup type="single" value={filter} onValueChange={(value) => value && setFilter(value)}>
            <ToggleGroupItem value="all">All</ToggleGroupItem>
            <ToggleGroupItem value="confirmed">Active</ToggleGroupItem>
            <ToggleGroupItem value="cancelled">Cancelled</ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>

      {filteredBookings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onCancel={handleCancelBooking}
              onViewReceipt={handleViewReceipt}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">No bookings found.</p>
          {(searchQuery || filter !== 'all') && (
            <Button 
              variant="link" 
              onClick={() => {
                setSearchQuery('');
                setFilter('all');
              }}
            >
              Clear filters
            </Button>
          )}
        </div>
      )}

      <AlertDialog open={!!cancelId} onOpenChange={(isOpen) => !isOpen && setCancelId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this booking? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No, keep booking</AlertDialogCancel>
            <AlertDialogAction onClick={confirmCancel}>
              Yes, cancel booking
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BookingsPage;
