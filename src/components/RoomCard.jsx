
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/utils/formatters';

export const RoomCard = ({ room, onSelect, actionLabel = "Select Room" }) => {
  const statusColors = {
    available: 'bg-green-500',
    booked: 'bg-red-500',
    maintenance: 'bg-yellow-500'
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg border-border h-full flex flex-col">
      <div className="aspect-video w-full overflow-hidden">
        <img 
          src={room.image} 
          alt={`Room ${room.number}`} 
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
      </div>
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold">Room {room.number}</CardTitle>
          <Badge variant={room.status === 'available' ? 'default' : 'destructive'}>
            {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{room.type}</p>
      </CardHeader>
      <CardContent className="p-4 pt-0 flex-grow">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xl font-bold text-accent">{formatCurrency(room.price)}<span className="text-xs text-muted-foreground">/night</span></p>
          <p className="text-sm flex items-center gap-1">
            <span className="text-muted-foreground">Capacity:</span> {room.capacity} <span className="text-muted-foreground">persons</span>
          </p>
        </div>
        <div className="mt-2">
          <p className="text-sm text-muted-foreground mb-1">Amenities:</p>
          <div className="flex flex-wrap gap-1">
            {room.amenities.slice(0, 3).map((amenity, index) => (
              <Badge key={index} variant="outline" className="text-xs bg-secondary/20">
                {amenity}
              </Badge>
            ))}
            {room.amenities.length > 3 && (
              <Badge variant="outline" className="text-xs bg-secondary/20">
                +{room.amenities.length - 3} more
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button 
          className="w-full"
          onClick={() => onSelect(room)}
          disabled={room.status !== 'available'}
          variant={room.status === 'available' ? 'default' : 'outline'}
        >
          {room.status === 'available' ? actionLabel : 'Not Available'}
        </Button>
      </CardFooter>
    </Card>
  );
};
