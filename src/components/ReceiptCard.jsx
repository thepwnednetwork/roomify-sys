
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/utils/formatters';
import { formatDateForDisplay } from '@/utils/dateUtils';
import { calculateBookingTotal, getHotelInfo } from '@/lib/localStorageUtils';
import { Printer } from 'lucide-react';

export const ReceiptCard = ({ booking }) => {
  const printRef = useRef();
  
  if (!booking) return null;
  
  const hotelInfo = getHotelInfo();
  const { subtotal, tax, total, nights } = calculateBookingTotal(booking);
  
  const handlePrint = () => {
    const content = printRef.current;
    const printWindow = window.open('', '_blank');
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Hotel Receipt - ${booking.guestName}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; color: #333; }
            .receipt { max-width: 800px; margin: 0 auto; border: 1px solid #eee; padding: 20px; }
            .header { text-align: center; margin-bottom: 20px; }
            .hotel-name { font-size: 24px; font-weight: bold; margin-bottom: 5px; }
            .hotel-details { font-size: 14px; color: #666; margin-bottom: 5px; }
            .receipt-title { text-align: center; font-size: 18px; margin: 20px 0; font-weight: bold; }
            .section { margin-bottom: 20px; }
            .section-title { font-weight: bold; border-bottom: 1px solid #eee; padding-bottom: 5px; margin-bottom: 10px; }
            .row { display: flex; justify-content: space-between; margin-bottom: 5px; }
            .label { color: #666; }
            .value { font-weight: 500; }
            .total-row { font-weight: bold; border-top: 1px solid #eee; padding-top: 5px; margin-top: 10px; }
            .footer { text-align: center; margin-top: 30px; font-size: 14px; color: #666; }
          </style>
        </head>
        <body>
          <div class="receipt">
            <div class="header">
              <div class="hotel-name">${hotelInfo.name}</div>
              <div class="hotel-details">${hotelInfo.address}</div>
              <div class="hotel-details">Phone: ${hotelInfo.phone} | Email: ${hotelInfo.email}</div>
            </div>
            
            <div class="receipt-title">RECEIPT</div>
            
            <div class="section">
              <div class="section-title">Guest Information</div>
              <div class="row">
                <span class="label">Name:</span>
                <span class="value">${booking.guestName}</span>
              </div>
              <div class="row">
                <span class="label">Email:</span>
                <span class="value">${booking.guestEmail}</span>
              </div>
              ${booking.guestPhone ? `
              <div class="row">
                <span class="label">Phone:</span>
                <span class="value">${booking.guestPhone}</span>
              </div>` : ''}
            </div>
            
            <div class="section">
              <div class="section-title">Booking Details</div>
              <div class="row">
                <span class="label">Booking ID:</span>
                <span class="value">${booking.id}</span>
              </div>
              <div class="row">
                <span class="label">Room Number:</span>
                <span class="value">${booking.roomNumber} (${booking.roomType})</span>
              </div>
              <div class="row">
                <span class="label">Check-in:</span>
                <span class="value">${formatDateForDisplay(booking.checkIn)}</span>
              </div>
              <div class="row">
                <span class="label">Check-out:</span>
                <span class="value">${formatDateForDisplay(booking.checkOut)}</span>
              </div>
              <div class="row">
                <span class="label">Duration:</span>
                <span class="value">${nights} night${nights > 1 ? 's' : ''}</span>
              </div>
            </div>
            
            <div class="section">
              <div class="section-title">Charges</div>
              <div class="row">
                <span class="label">Room Rate (per night):</span>
                <span class="value">${formatCurrency(booking.pricePerNight)}</span>
              </div>
              <div class="row">
                <span class="label">Room Charges (${nights} night${nights > 1 ? 's' : ''}):</span>
                <span class="value">${formatCurrency(subtotal)}</span>
              </div>
              <div class="row">
                <span class="label">Tax (${(hotelInfo.taxRate * 100).toFixed(0)}%):</span>
                <span class="value">${formatCurrency(tax)}</span>
              </div>
              <div class="row total-row">
                <span class="label">Total Amount:</span>
                <span class="value">${formatCurrency(total)}</span>
              </div>
            </div>
            
            <div class="footer">
              <p>Thank you for choosing ${hotelInfo.name}!</p>
              <p>We hope to see you again soon.</p>
            </div>
          </div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };
  
  return (
    <Card className="overflow-hidden border-border">
      <CardHeader className="p-6 pb-4">
        <CardTitle className="text-xl flex items-center justify-between">
          <span>Receipt</span>
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer size={16} className="mr-2" />
            Print Receipt
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-0" ref={printRef}>
        <div className="mb-6 text-center">
          <h2 className="text-xl font-bold">{hotelInfo.name}</h2>
          <p className="text-sm text-muted-foreground">{hotelInfo.address}</p>
          <p className="text-sm text-muted-foreground">
            {hotelInfo.phone} | {hotelInfo.email}
          </p>
        </div>
        
        <div className="mb-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            Guest Information
          </h3>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Name</span>
              <span>{booking.guestName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email</span>
              <span>{booking.guestEmail}</span>
            </div>
            {booking.guestPhone && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Phone</span>
                <span>{booking.guestPhone}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            Booking Details
          </h3>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Booking ID</span>
              <span>{booking.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Room</span>
              <span>{booking.roomNumber} ({booking.roomType})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Check-in</span>
              <span>{formatDateForDisplay(booking.checkIn)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Check-out</span>
              <span>{formatDateForDisplay(booking.checkOut)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Duration</span>
              <span>{nights} night{nights > 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            Charges
          </h3>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Room Rate (per night)</span>
              <span>{formatCurrency(booking.pricePerNight)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Room Charges ({nights} night{nights > 1 ? 's' : ''})</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax ({(hotelInfo.taxRate * 100).toFixed(0)}%)</span>
              <span>{formatCurrency(tax)}</span>
            </div>
            <div className="flex justify-between font-bold border-t border-border pt-2 mt-2">
              <span>Total Amount</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0 border-t border-border mt-4">
        <div className="w-full text-center text-sm text-muted-foreground">
          <p>Thank you for choosing {hotelInfo.name}!</p>
          <p>We hope to see you again soon.</p>
        </div>
      </CardFooter>
    </Card>
  );
};
