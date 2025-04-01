
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getBookings } from '@/lib/localStorageUtils';
import { formatCurrency } from '@/utils/formatters';
import { formatDateForDisplay } from '@/utils/dateUtils';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Eye } from 'lucide-react';

const ReceiptsPage = () => {
  const [receipts, setReceipts] = useState([]);
  const [filteredReceipts, setFilteredReceipts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Get all bookings that are either confirmed or cancelled
    const bookings = getBookings().filter(
      booking => booking.status === 'confirmed' || booking.status === 'cancelled'
    );
    setReceipts(bookings);
    setFilteredReceipts(bookings);
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const filtered = receipts.filter(
        receipt => 
          receipt.guestName.toLowerCase().includes(query) ||
          receipt.guestEmail.toLowerCase().includes(query) ||
          receipt.roomNumber.includes(query)
      );
      setFilteredReceipts(filtered);
    } else {
      setFilteredReceipts(receipts);
    }
  }, [searchQuery, receipts]);

  const viewReceipt = (id) => {
    navigate(`/receipt/${id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Receipts</h1>
      </div>
      
      <div className="relative">
        <Input
          placeholder="Search by guest name, email, or room number..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>

      {filteredReceipts.length > 0 ? (
        <div className="space-y-4">
          {filteredReceipts.map((receipt) => (
            <Card key={receipt.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  <div className="p-6 flex-1">
                    <div className="flex justify-between mb-4">
                      <div>
                        <h3 className="font-semibold">{receipt.guestName}</h3>
                        <p className="text-sm text-muted-foreground">{receipt.guestEmail}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">Room {receipt.roomNumber}</p>
                        <p className="text-sm text-muted-foreground">{receipt.roomType}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Check-in</p>
                        <p>{formatDateForDisplay(receipt.checkIn)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Check-out</p>
                        <p>{formatDateForDisplay(receipt.checkOut)}</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-sm text-muted-foreground">Status</p>
                        <p className={`font-medium ${receipt.status === 'confirmed' ? 'text-green-500' : 'text-red-500'}`}>
                          {receipt.status.charAt(0).toUpperCase() + receipt.status.slice(1)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Total Amount</p>
                        <p className="text-xl font-bold">{formatCurrency(receipt.totalPrice)}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-secondary p-6 flex items-center justify-center md:w-48">
                    <Button 
                      variant="secondary"
                      onClick={() => viewReceipt(receipt.id)}
                      className="flex items-center gap-2"
                    >
                      <Eye size={16} />
                      View Receipt
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">No receipts found.</p>
          {searchQuery && (
            <Button 
              variant="link" 
              onClick={() => setSearchQuery('')}
            >
              Clear search
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default ReceiptsPage;
