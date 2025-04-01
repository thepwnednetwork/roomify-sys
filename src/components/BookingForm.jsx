
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatCurrency } from '@/utils/formatters';
import { addBooking } from '@/lib/localStorageUtils';
import { getCurrentDate, getOffsetDate } from '@/utils/dateUtils';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export const BookingForm = ({ room, onClose }) => {
  const [formData, setFormData] = useState({
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    checkIn: getCurrentDate(),
    checkOut: getOffsetDate(1)
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate form
    if (!formData.guestName || !formData.guestEmail || !formData.checkIn || !formData.checkOut) {
      toast({
        title: "Error",
        description: "Please fill out all required fields",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    // Validate dates
    const checkIn = new Date(formData.checkIn);
    const checkOut = new Date(formData.checkOut);
    
    if (checkIn >= checkOut) {
      toast({
        title: "Invalid Dates",
        description: "Check-out date must be after check-in date",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    // Calculate nights and total price
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    const totalPrice = room.price * nights;

    // Create the booking
    const newBooking = {
      roomId: room.id,
      roomNumber: room.number,
      roomType: room.type,
      pricePerNight: room.price,
      ...formData,
      nights,
      totalPrice,
      status: 'confirmed'
    };

    // Add booking to local storage
    const savedBooking = addBooking(newBooking);

    // Show success toast
    toast({
      title: "Booking Confirmed!",
      description: `Room ${room.number} has been booked for ${nights} nights.`
    });

    // Navigate to the receipt page
    setTimeout(() => {
      navigate(`/receipt/${savedBooking.id}`);
    }, 1000);
  };

  // Calculate price preview
  const checkIn = new Date(formData.checkIn);
  const checkOut = new Date(formData.checkOut);
  const nights = Math.max(1, Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24)));
  const totalPrice = room.price * nights;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Book Room {room.number}</CardTitle>
        <CardDescription>
          {room.type} - {formatCurrency(room.price)}/night
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="guestName">Guest Name *</Label>
            <Input 
              id="guestName" 
              name="guestName" 
              value={formData.guestName} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="guestEmail">Email Address *</Label>
            <Input 
              id="guestEmail" 
              name="guestEmail" 
              type="email" 
              value={formData.guestEmail} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="guestPhone">Phone Number</Label>
            <Input 
              id="guestPhone" 
              name="guestPhone" 
              value={formData.guestPhone} 
              onChange={handleChange} 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="checkIn">Check-in Date *</Label>
              <Input 
                id="checkIn" 
                name="checkIn" 
                type="date" 
                value={formData.checkIn}
                min={getCurrentDate()}
                onChange={handleChange} 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="checkOut">Check-out Date *</Label>
              <Input 
                id="checkOut" 
                name="checkOut" 
                type="date" 
                value={formData.checkOut}
                min={formData.checkIn} 
                onChange={handleChange} 
                required 
              />
            </div>
          </div>
          <div className="mt-4 p-4 bg-secondary/20 rounded-md">
            <div className="flex justify-between mb-2">
              <span>Price per night</span>
              <span>{formatCurrency(room.price)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Number of nights</span>
              <span>{nights}</span>
            </div>
            <div className="flex justify-between font-bold border-t border-border pt-2 mt-2">
              <span>Total</span>
              <span>{formatCurrency(totalPrice)}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Processing...' : 'Confirm Booking'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
