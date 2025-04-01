
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RoomCard } from '@/components/RoomCard';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { BookingForm } from '@/components/BookingForm';
import { getRooms } from '@/lib/localStorageUtils';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Hotel, List } from 'lucide-react';

const RoomsPage = () => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const loadedRooms = getRooms();
    setRooms(loadedRooms);
  }, []);

  const handleRoomSelect = (room) => {
    setSelectedRoom(room);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    // Reload rooms to reflect changes
    const updatedRooms = getRooms();
    setRooms(updatedRooms);
  };

  const filteredRooms = rooms.filter(room => {
    if (filter === 'all') return true;
    if (filter === 'available') return room.status === 'available';
    return room.type.toLowerCase() === filter;
  });

  const roomTypes = ['all', 'available', ...new Set(rooms.map(room => room.type.toLowerCase()))];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Rooms</h1>
        <div className="flex flex-col sm:flex-row gap-4">
          <ToggleGroup type="single" value={filter} onValueChange={(value) => value && setFilter(value)}>
            {roomTypes.map(type => (
              <ToggleGroupItem key={type} value={type} className="capitalize">
                {type}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          
          <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value)}>
            <ToggleGroupItem value="grid" aria-label="Grid view">
              <Hotel className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="list" aria-label="List view">
              <List className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>

      {filteredRooms.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRooms.map(room => (
              <RoomCard 
                key={room.id} 
                room={room} 
                onSelect={handleRoomSelect} 
                actionLabel="Book Now"
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRooms.map(room => (
              <div 
                key={room.id} 
                className="flex flex-col md:flex-row gap-4 border border-border rounded-lg overflow-hidden transition-all hover:shadow-md"
              >
                <div className="md:w-1/4 h-48 md:h-auto overflow-hidden">
                  <img 
                    src={room.image} 
                    alt={`Room ${room.number}`} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 p-4 flex flex-col">
                  <div className="flex justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-semibold">Room {room.number}</h3>
                      <p className="text-muted-foreground">{room.type}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">${room.price}</p>
                      <p className="text-sm text-muted-foreground">per night</p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm mb-1">Amenities:</p>
                    <div className="flex flex-wrap gap-1">
                      {room.amenities.map((amenity, idx) => (
                        <span key={idx} className="px-2 py-1 bg-secondary/20 text-xs rounded-md">
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-auto pt-4 flex justify-end">
                    <Button 
                      onClick={() => handleRoomSelect(room)}
                      disabled={room.status !== 'available'}
                    >
                      {room.status === 'available' ? 'Book Now' : 'Not Available'}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">No rooms found matching your filter.</p>
          <Button variant="link" onClick={() => setFilter('all')}>
            Clear filters
          </Button>
        </div>
      )}

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-md">
          <BookingForm room={selectedRoom} onClose={closeForm} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RoomsPage;
