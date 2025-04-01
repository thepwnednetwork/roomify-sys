
// Local storage keys
const STORAGE_KEYS = {
  ROOMS: 'roomify-rooms',
  BOOKINGS: 'roomify-bookings',
  HOTEL_INFO: 'roomify-hotel-info'
};

// Initialize local storage with default data if it doesn't exist
export const initializeLocalStorage = () => {
  // Default hotel information
  if (!localStorage.getItem(STORAGE_KEYS.HOTEL_INFO)) {
    const defaultHotelInfo = {
      name: 'Roomify Suites',
      address: '123 Luxury Lane, Cityville',
      phone: '+1 (555) 123-4567',
      email: 'info@roomifysuites.com',
      taxRate: 0.12
    };
    localStorage.setItem(STORAGE_KEYS.HOTEL_INFO, JSON.stringify(defaultHotelInfo));
  }

  // Default rooms
  if (!localStorage.getItem(STORAGE_KEYS.ROOMS)) {
    const defaultRooms = [
      {
        id: 1,
        number: '101',
        type: 'Standard',
        capacity: 2,
        price: 120,
        amenities: ['WiFi', 'TV', 'Air Conditioning'],
        status: 'available',
        image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=2070'
      },
      {
        id: 2,
        number: '102',
        type: 'Standard',
        capacity: 2,
        price: 120,
        amenities: ['WiFi', 'TV', 'Air Conditioning'],
        status: 'available',
        image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=2070'
      },
      {
        id: 3,
        number: '201',
        type: 'Deluxe',
        capacity: 3,
        price: 180,
        amenities: ['WiFi', 'TV', 'Air Conditioning', 'Mini Bar', 'Balcony'],
        status: 'available',
        image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=2070'
      },
      {
        id: 4,
        number: '202',
        type: 'Deluxe',
        capacity: 3,
        price: 180,
        amenities: ['WiFi', 'TV', 'Air Conditioning', 'Mini Bar', 'Balcony'],
        status: 'available',
        image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=2070'
      },
      {
        id: 5,
        number: '301',
        type: 'Suite',
        capacity: 4,
        price: 250,
        amenities: ['WiFi', 'TV', 'Air Conditioning', 'Mini Bar', 'Balcony', 'Jacuzzi'],
        status: 'available',
        image: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?q=80&w=2067'
      },
      {
        id: 6,
        number: '302',
        type: 'Suite',
        capacity: 4,
        price: 250,
        amenities: ['WiFi', 'TV', 'Air Conditioning', 'Mini Bar', 'Balcony', 'Jacuzzi'],
        status: 'available',
        image: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?q=80&w=2067'
      },
      {
        id: 7,
        number: '401',
        type: 'Presidential Suite',
        capacity: 6,
        price: 500,
        amenities: ['WiFi', 'TV', 'Air Conditioning', 'Mini Bar', 'Balcony', 'Jacuzzi', 'Kitchen', 'Private Pool'],
        status: 'available',
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070'
      }
    ];
    localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(defaultRooms));
  }

  // Default bookings (empty array)
  if (!localStorage.getItem(STORAGE_KEYS.BOOKINGS)) {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify([]));
  }
};

// Room management
export const getRooms = () => {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.ROOMS) || '[]');
};

export const updateRoom = (updatedRoom) => {
  const rooms = getRooms();
  const index = rooms.findIndex(room => room.id === updatedRoom.id);
  
  if (index !== -1) {
    rooms[index] = { ...rooms[index], ...updatedRoom };
    localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(rooms));
    return true;
  }
  return false;
};

// Booking management
export const getBookings = () => {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKINGS) || '[]');
};

export const addBooking = (booking) => {
  const bookings = getBookings();
  const newBooking = {
    ...booking,
    id: Date.now(), // Simple ID generation
    createdAt: new Date().toISOString()
  };
  
  bookings.push(newBooking);
  localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
  
  // Update room status
  const room = getRooms().find(room => room.id === booking.roomId);
  if (room) {
    updateRoom({ ...room, status: 'booked' });
  }
  
  return newBooking;
};

export const cancelBooking = (bookingId) => {
  const bookings = getBookings();
  const bookingIndex = bookings.findIndex(b => b.id === bookingId);
  
  if (bookingIndex === -1) return false;
  
  const booking = bookings[bookingIndex];
  
  // Update the booking status
  bookings[bookingIndex] = { ...booking, status: 'cancelled', cancelledAt: new Date().toISOString() };
  localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
  
  // Update room status back to available
  const room = getRooms().find(room => room.id === booking.roomId);
  if (room) {
    updateRoom({ ...room, status: 'available' });
  }
  
  return true;
};

// Hotel information
export const getHotelInfo = () => {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.HOTEL_INFO) || '{}');
};

// Calculate booking total
export const calculateBookingTotal = (booking) => {
  const hotelInfo = getHotelInfo();
  const room = getRooms().find(r => r.id === booking.roomId);
  
  if (!room) return { subtotal: 0, tax: 0, total: 0 };
  
  const checkIn = new Date(booking.checkIn);
  const checkOut = new Date(booking.checkOut);
  const nights = Math.max(1, Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24)));
  
  const subtotal = room.price * nights;
  const tax = subtotal * hotelInfo.taxRate;
  const total = subtotal + tax;
  
  return { subtotal, tax, total, nights };
};
