import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Loader2, Receipt, User, Phone, Ticket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import { useBooking } from '@/contexts/BookingContext';
import { UploadPaymentProof } from '@/components/payment/UploadPaymentProof';
import { supabase } from '@/lib/supabase';

export const PaymentPage = () => {
  const navigate = useNavigate();
  const {
    selectedTicketType,
    selectedSeats,
    userData,
    totalPrice,
    paymentProof,
    setSelectedTicketType,
    setSelectedSeats,
    setUserData,
    setPaymentProof,
  } = useBooking();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [bookingId, setBookingId] = useState<string>('');

  if (!selectedTicketType || selectedSeats.length === 0) {
    navigate('/tickets');
    return null;
  }

  const handleSubmit = async () => {
    if (!paymentProof) {
      alert('Please upload payment proof');
      return;
    }

    setLoading(true);

    try {
      const fileExt = paymentProof.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `payment-proofs/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('sendratari-payments')
        .upload(filePath, paymentProof);

      if (uploadError) {
        const { data: publicUrl } = supabase.storage
          .from('sendratari-payments')
          .getPublicUrl(filePath);

        const paymentProofUrl = publicUrl.publicUrl;

        const { data: booking, error: bookingError } = await supabase
          .from('bookings')
          .insert({
            full_name: userData.full_name,
            phone_number: userData.phone_number,
            selected_seats: selectedSeats.map((s) => ({
              id: s.id,
              seat_number: s.seat_number,
            })),
            ticket_type_id: selectedTicketType.id,
            total_price: totalPrice,
            payment_proof_url: paymentProofUrl,
            status: 'pending',
          })
          .select()
          .single();

        if (bookingError) throw bookingError;

        const { error: updateError } = await supabase
          .from('seats')
          .update({ is_available: false })
          .in('id', selectedSeats.map((s) => s.id));

        if (updateError) throw updateError;

        setBookingId(booking.id);
        setSuccess(true);
      } else {
        const { data: publicUrl } = supabase.storage
          .from('sendratari-payments')
          .getPublicUrl(filePath);

        const paymentProofUrl = publicUrl.publicUrl;

        const { data: booking, error: bookingError } = await supabase
          .from('bookings')
          .insert({
            full_name: userData.full_name,
            phone_number: userData.phone_number,
            selected_seats: selectedSeats.map((s) => ({
              id: s.id,
              seat_number: s.seat_number,
            })),
            ticket_type_id: selectedTicketType.id,
            total_price: totalPrice,
            payment_proof_url: paymentProofUrl,
            status: 'pending',
          })
          .select()
          .single();

        if (bookingError) throw bookingError;

        const { error: updateError } = await supabase
          .from('seats')
          .update({ is_available: false })
          .in('id', selectedSeats.map((s) => s.id));

        if (updateError) throw updateError;

        setBookingId(booking.id);
        setSuccess(true);
      }
    } catch (error) {
      console.error('Error submitting booking:', error);
      alert('Failed to submit booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleNewBooking = () => {
    setSelectedTicketType(null);
    setSelectedSeats([]);
    setUserData({ full_name: '', phone_number: '' });
    setPaymentProof(null);
    navigate('/');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full"
        >
          <Card className="bg-neutral-900/50 border-neutral-800 rounded-2xl backdrop-blur-lg text-center">
            <CardContent className="pt-12 pb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="w-24 h-24 rounded-full bg-gradient-to-br from-green-500/20 to-green-500/10 flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle className="w-12 h-12 text-green-500" />
              </motion.div>

              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                Booking Successful!
              </h2>

              <p className="text-neutral-400 mb-8">
                Your booking has been submitted successfully. We'll confirm your payment within 24 hours.
              </p>

              <div className="bg-neutral-800/50 rounded-xl p-6 mb-8 text-left">
                <p className="text-sm text-neutral-500 mb-4">Booking Details:</p>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Booking ID</span>
                    <span className="font-mono text-indigo-400">{bookingId.slice(0, 8)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Name</span>
                    <span className="text-neutral-200">{userData.full_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Seats</span>
                    <span className="text-neutral-200">
                      {selectedSeats.map((s) => s.seat_number).join(', ')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Total</span>
                    <span className="text-xl font-bold text-green-400">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-neutral-500 mb-6">
                We've sent a confirmation to your phone number: {userData.phone_number}
              </p>

              <Button
                size="lg"
                onClick={handleNewBooking}
                className="bg-gradient-to-r from-indigo-500 to-rose-500 hover:from-indigo-600 hover:to-rose-600 text-white rounded-2xl px-8 py-6"
              >
                Book Another Ticket
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <Navbar />

      <div className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-indigo-400 to-rose-400 bg-clip-text text-transparent">
              Complete Payment
            </h1>
            <p className="text-neutral-400 text-lg">
              Upload your payment proof to confirm your booking
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2"
            >
              <Card className="bg-neutral-900/50 border-neutral-800 rounded-2xl backdrop-blur-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <Receipt className="w-6 h-6 text-indigo-400" />
                    Upload Payment Proof
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <UploadPaymentProof />
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
                  <CardTitle className="text-2xl">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-neutral-800/50 rounded-xl">
                      <User className="w-5 h-5 text-indigo-400" />
                      <div className="flex-1">
                        <p className="text-xs text-neutral-500">Name</p>
                        <p className="text-sm font-medium">{userData.full_name}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-neutral-800/50 rounded-xl">
                      <Phone className="w-5 h-5 text-rose-400" />
                      <div className="flex-1">
                        <p className="text-xs text-neutral-500">Phone</p>
                        <p className="text-sm font-medium">{userData.phone_number}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-neutral-800/50 rounded-xl">
                      <Ticket className="w-5 h-5 text-amber-400" />
                      <div className="flex-1">
                        <p className="text-xs text-neutral-500">Ticket Type</p>
                        <p className="text-sm font-medium">{selectedTicketType.name}</p>
                      </div>
                    </div>

                    <div className="p-3 bg-neutral-800/50 rounded-xl">
                      <p className="text-xs text-neutral-500 mb-2">Selected Seats</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedSeats.map((seat) => (
                          <span
                            key={seat.id}
                            className="px-3 py-1 bg-blue-500/20 border border-blue-500/50 rounded-lg text-sm text-blue-300"
                          >
                            {seat.seat_number}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-neutral-800 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-400">Subtotal</span>
                      <span className="font-medium">{formatPrice(totalPrice)}</span>
                    </div>

                    <div className="flex justify-between items-baseline pt-3">
                      <span className="text-neutral-400">Total Amount</span>
                      <span className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-rose-400 bg-clip-text text-transparent">
                        {formatPrice(totalPrice)}
                      </span>
                    </div>
                  </div>

                  <Button
                    size="lg"
                    disabled={!paymentProof || loading}
                    onClick={handleSubmit}
                    className="w-full bg-gradient-to-r from-indigo-500 to-rose-500 hover:from-indigo-600 hover:to-rose-600 text-white rounded-xl py-6 text-lg shadow-lg shadow-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        Submitting...
                      </>
                    ) : (
                      'Confirm Booking'
                    )}
                  </Button>

                  {!paymentProof && (
                    <p className="text-neutral-500 text-xs text-center">
                      Please upload payment proof to continue
                    </p>
                  )}
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
