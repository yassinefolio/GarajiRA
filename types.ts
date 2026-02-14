
export type Category = 'Motorcycle' | 'Bike' | 'Storage' | 'Private Garage';

export interface Garage {
  id: string;
  name: string;
  category: Category;
  distance: string;
  pricePerHour: number;
  rating: number;
  reviewsCount: number;
  available: boolean;
  image: string;
  description: string;
  owner: {
    name: string;
    rating: number;
    image: string;
  };
  features: {
    groundAnchor: boolean;
    groundType: string;
    height: string;
    size: string;
    security: 'Standard' | 'High' | 'Premium';
  };
}

export interface Booking {
  id: string;
  garageId: string;
  garageName: string;
  garageImage: string;
  date: string;
  startTime: string; // Format: HH:mm
  endTime: string;   // Format: HH:mm
  accessCode: string;
  status: 'upcoming' | 'active' | 'completed';
  timestamp: number; // For simulation
}

export type Screen = 'splash' | 'home' | 'details' | 'booking' | 'payment' | 'success' | 'access' | 'messages' | 'profile' | 'add';
