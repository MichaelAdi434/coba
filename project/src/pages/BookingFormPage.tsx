import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, User, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import { useBooking } from '@/contexts/BookingContext';
import { SeatMap } from '@/components/booking/SeatMap';

export const BookingFormPage = () => {
  const navigate = useNavigate();
  const { selectedTicketType, selectedSeats, userData, setUserData } = useBooking();
  const [errors, setErrors] = useState<{ full_name?: string; phone_number?: string }>({});

  if (!selectedTicketType) {
    navigate('/tickets');
    return null;
  }

  const validateForm = () => {
    const newErrors: { full_name?: string; phone_number?: string } = {};

    if (!userData.full_name.trim()) {
      newErrors.full_name = 'Full name is required';
    }

    if (!userData.phone_number.trim()) {
      newErrors.phone_number = 'Phone number is required';
    } else if (!/^[0-9]{10,13}$/.test(userData.phone_number.replace(/[^0-9]/g, ''))) {
      newErrors.phone_number = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validateForm() && selectedSeats.length > 0) {
      navigate('/payment');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <Navbar />

      <div className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-indigo-400 to-rose-400 bg-clip-text text-transparent">
              Complete Your Booking
            </h1>
            <p className="text-neutral-400 text-lg">
              Fill in your details and select your preferred seats
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2"
            >
              <Card className="bg-neutral-900/50 border-neutral-800 rounded-2xl backdrop-blur-lg mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <User className="w-6 h-6 text-indigo-400" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="full_name" className="text-neutral-300">
                      Full Name *
                    </Label>
                    <Input
                      id="full_name"
                      value={userData.full_name}
                      onChange={(e) => setUserData({ ...userData, full_name: e.target.value })}
                      placeholder="Enter your full name"
                      className="bg-neutral-800/50 border-neutral-700 rounded-xl h-12 text-neutral-100 focus:border-indigo-500"
                    />
                    {errors.full_name && (
                      <p className="text-red-400 text-sm">{errors.full_name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone_number" className="text-neutral-300">
                      Phone Number *
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                      <Input
                        id="phone_number"
                        value={userData.phone_number}
                        onChange={(e) => setUserData({ ...userData, phone_number: e.target.value })}
                        placeholder="e.g., 081234567890"
                        className="bg-neutral-800/50 border-neutral-700 rounded-xl h-12 pl-11 text-neutral-100 focus:border-indigo-500"
                      />
                    </div>
                    {errors.phone_number && (
                      <p className="text-red-400 text-sm">{errors.phone_number}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-neutral-900/50 border-neutral-800 rounded-2xl backdrop-blur-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <MapPin className="w-6 h-6 text-rose-400" />
                    Select Your Seats
                  </CardTitle>
                  <p className="text-neutral-400 text-sm">
                    Click on available seats to select them
                  </p>
                </CardHeader>
                <CardContent>
                  <SeatMap />
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <Card className="bg-gradient-to-br from-neutral-900 to-neutral-900/50 border-neutral-800 rounded-2xl backdrop-blur-lg sticky top-24">
                <CardHeader>
                  <CardTitle className="text-2xl">Booking Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-400">Ticket Type</span>
                      <span className="font-medium">{selectedTicketType.name}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-400">Price per Seat</span>
                      <span className="font-medium">{formatPrice(selectedTicketType.price)}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-400">Selected Seats</span>
                      <span className="font-medium">{selectedSeats.length}</span>
                    </div>

                    {selectedSeats.length > 0 && (
                      <div className="pt-2 border-t border-neutral-800">
                        <p className="text-xs text-neutral-500 mb-2">Seats:</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedSeats.map((seat) => (
                            <span
                              key={seat.id}
                              className="px-2 py-1 bg-blue-500/20 border border-blue-500/50 rounded-lg text-xs text-blue-300"
                            >
                              {seat.seat_number}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-neutral-800">
                    <div className="flex justify-between items-baseline mb-6">
                      <span className="text-neutral-400">Total Amount</span>
                      <span className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-rose-400 bg-clip-text text-transparent">
                        {formatPrice(selectedSeats.length * selectedTicketType.price)}
                      </span>
                    </div>

                    <Button
                      size="lg"
                      disabled={selectedSeats.length === 0 || !userData.full_name || !userData.phone_number}
                      onClick={handleContinue}
                      className="w-full bg-gradient-to-r from-indigo-500 to-rose-500 hover:from-indigo-600 hover:to-rose-600 text-white rounded-xl py-6 text-lg shadow-lg shadow-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Continue to Payment <ArrowRight className="ml-2" />
                    </Button>

                    {selectedSeats.length === 0 && (
                      <p className="text-neutral-500 text-xs text-center mt-4">
                        Please select at least one seat
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};
