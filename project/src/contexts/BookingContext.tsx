import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface TicketType {
  id: string;
  name: string;
  price: number;
  benefits: string[];
  color: string;
}

export interface Seat {
  id: string;
  seat_number: string;
  ticket_type_id: string;
  row: string;
  position: number;
  is_available: boolean;
}

export interface UserData {
  full_name: string;
  phone_number: string;
}

interface BookingContextType {
  selectedTicketType: TicketType | null;
  setSelectedTicketType: (ticket: TicketType | null) => void;
  selectedSeats: Seat[];
  setSelectedSeats: (seats: Seat[]) => void;
  userData: UserData;
  setUserData: (data: UserData) => void;
  totalPrice: number;
  paymentProof: File | null;
  setPaymentProof: (file: File | null) => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedTicketType, setSelectedTicketType] = useState<TicketType | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [userData, setUserData] = useState<UserData>({ full_name: '', phone_number: '' });
  const [paymentProof, setPaymentProof] = useState<File | null>(null);

  const totalPrice = selectedSeats.length * (selectedTicketType?.price || 0);

  return (
    <BookingContext.Provider
      value={{
        selectedTicketType,
        setSelectedTicketType,
        selectedSeats,
        setSelectedSeats,
        userData,
        setUserData,
        totalPrice,
        paymentProof,
        setPaymentProof,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within BookingProvider');
  }
  return context;
};
