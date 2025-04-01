
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/utils/formatters';
import { formatDateForDisplay } from '@/utils/dateUtils';
import { Calendar, User, Hotel } from 'lucide-react';

export const BookingCard = ({ booking, onCancel, onViewReceipt }) => {
  const statusColors = {
    confirmed: 'bg-green-500',
    cancelled: 'bg-red-500',
    completed: 'bg-blue-500'
  };

  const statusBadgeVariant = booking.status === 'confirmed' ? 'default' : 
                            booking.status === 'cancelled' ? 'destructive' : 'secondary';

  return (
    <Card className="overflow-hidden border-border">
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg flex items-center gap-2">
            <Hotel size={18} className="text-primary" />
            Room {booking.roomNumber}
          </CardTitle>
          <Badge variant={statusBadgeVariant}>
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{booking.roomType}</p>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <User size={16} className="text-muted-foreground" />
            <span className="text-sm">{booking.guestName}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-muted-foreground" />
            <span className="text-sm">
              {formatDateForDisplay(booking.checkIn)} - {formatDateForDisplay(booking.checkOut)}
            </span>
          </div>
          <div className="flex justify-between mt-2 pt-2 border-t border-border">
            <div>
              <p className="text-sm text-muted-foreground">Price per night</p>
              <p>{formatCurrency(booking.pricePerNight)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Total ({booking.nights} nights)</p>
              <p className="font-bold">{formatCurrency(booking.totalPrice)}</p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={() => onViewReceipt(booking)}
        >
          View Receipt
        </Button>
        {booking.status === 'confirmed' && (
          <Button 
            variant="destructive" 
            className="flex-1"
            onClick={() => onCancel(booking.id)}
          >
            Cancel Booking
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
