export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  location: string;
  image: string;
  category: EventCategory;
  price: {
    min: number;
    max: number;
  };
  availableSeats: number;
  totalSeats: number;
}

export interface Seat {
  id: string;
  row: string;
  number: number;
  type: SeatType;
  price: number;
  isAvailable: boolean;
  isSelected: boolean;
}

export interface TicketType {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  color: string;
}

export interface BookingDetails {
  event: Event;
  selectedSeats: Seat[];
  ticketType: TicketType;
  totalPrice: number;
  bookingDate: string;
}

export type EventCategory = 
  | 'concert' 
  | 'sports' 
  | 'theater' 
  | 'comedy' 
  | 'conference' 
  | 'festival';

export type SeatType = 
  | 'premium' 
  | 'standard' 
  | 'economy' 
  | 'vip';

export interface SearchFilters {
  category?: EventCategory;
  dateRange?: {
    start: string;
    end: string;
  };
  priceRange?: {
    min: number;
    max: number;
  };
  location?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface BookingStep {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
  isActive: boolean;
} 