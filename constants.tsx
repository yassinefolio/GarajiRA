
import { Garage } from './types';

export const COLORS = {
  background: '#F7F8FA',
  card: '#FFFFFF',
  primary: '#FF6B4A', // Orange
  secondary: '#3A6EA5', // Blue
  success: '#2ED3B7', // Green
  textMain: '#1F2933',
  textSecondary: '#6B7280',
  star: '#F5B942',
  error: '#EF4444'
};

export const MOCK_GARAGES: Garage[] = [
  {
    id: '1',
    name: 'Safe Haven Moto Space',
    category: 'Motorcycle',
    distance: '0.4 km',
    pricePerHour: 4.5,
    rating: 4.9,
    reviewsCount: 124,
    available: true,
    image: 'https://picsum.photos/seed/garage1/600/400',
    description: 'A clean, well-lit garage specifically designed for expensive motorcycles. Located in a secure gated community with 24/7 surveillance.',
    owner: {
      name: 'Alex Rivera',
      rating: 5.0,
      image: 'https://picsum.photos/seed/owner1/100/100'
    },
    features: {
      groundAnchor: true,
      groundType: 'Polished Concrete',
      height: '2.1m',
      size: '6 sqm',
      security: 'High'
    }
  },
  {
    id: '2',
    name: 'Urban Storage Unit B',
    category: 'Storage',
    distance: '1.2 km',
    pricePerHour: 8.0,
    rating: 4.7,
    reviewsCount: 45,
    available: true,
    image: 'https://picsum.photos/seed/garage2/600/400',
    description: 'Spacious storage unit perfect for household items or a small project vehicle. Easy access from the main road.',
    owner: {
      name: 'Sarah Chen',
      rating: 4.8,
      image: 'https://picsum.photos/seed/owner2/100/100'
    },
    features: {
      groundAnchor: false,
      groundType: 'Standard Concrete',
      height: '3.0m',
      size: '15 sqm',
      security: 'Standard'
    }
  },
  {
    id: '3',
    name: 'The Bike Vault',
    category: 'Bike',
    distance: '0.2 km',
    pricePerHour: 2.0,
    rating: 4.8,
    reviewsCount: 89,
    available: false,
    image: 'https://picsum.photos/seed/garage3/600/400',
    description: 'Perfect spot for your high-end road or mountain bike. Includes tool station for minor repairs.',
    owner: {
      name: 'Mark Benson',
      rating: 4.9,
      image: 'https://picsum.photos/seed/owner3/100/100'
    },
    features: {
      groundAnchor: true,
      groundType: 'Rubber Matting',
      height: '2.0m',
      size: '3 sqm',
      security: 'Premium'
    }
  },
  {
    id: '4',
    name: 'Central Private Garage',
    category: 'Private Garage',
    distance: '2.5 km',
    pricePerHour: 12.0,
    rating: 4.6,
    reviewsCount: 12,
    available: true,
    image: 'https://picsum.photos/seed/garage4/600/400',
    description: 'Full sized private garage with automatic door. Great for long term parking or car detailing.',
    owner: {
      name: 'Elena Gilbert',
      rating: 4.7,
      image: 'https://picsum.photos/seed/owner4/100/100'
    },
    features: {
      groundAnchor: false,
      groundType: 'Asphalt',
      height: '2.5m',
      size: '20 sqm',
      security: 'Standard'
    }
  }
];
