
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ReceiptCard } from '@/components/ReceiptCard';
import { getBookings } from '@/lib/localStorageUtils';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ReceiptPage = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const bookingId = parseInt(id, 10);
      const bookings = getBookings();
      const selectedBooking = bookings.find(b => b.id === bookingId);
      
      if (selectedBooking) {
        setBooking(selectedBooking);
      } else {
        setError("Booking not found");
      }
    } catch (err) {
      setError("Error loading the receipt");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-muted-foreground">Loading receipt...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-lg text-destructive mb-4">{error}</p>
          <Link to="/bookings">
            <Button variant="link">Go back to bookings</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Link to="/bookings" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Bookings
        </Link>
      </div>
      
      <ReceiptCard booking={booking} />
    </div>
  );
};

export default ReceiptPage;
