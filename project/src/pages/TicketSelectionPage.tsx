import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check, Crown, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import { useBooking, TicketType } from '@/contexts/BookingContext';
import { supabase } from '@/lib/supabase';

export const TicketSelectionPage = () => {
  const navigate = useNavigate();
  const { selectedTicketType, setSelectedTicketType } = useBooking();
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTicketTypes();
  }, []);

  const fetchTicketTypes = async () => {
    try {
      const { data, error } = await supabase
        .from('ticket_types')
        .select('*')
        .order('price', { ascending: false });

      if (error) throw error;
      setTicketTypes(data || []);
    } catch (error) {
      console.error('Error fetching ticket types:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTicket = (ticket: TicketType) => {
    setSelectedTicketType(ticket);
  };

  const handleContinue = () => {
    if (selectedTicketType) {
      navigate('/booking');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full" />
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
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-indigo-400 to-rose-400 bg-clip-text text-transparent">
              Choose Your Experience
            </h1>
            <p className="text-neutral-400 text-lg">
              Select the ticket type that best fits your experience
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {ticketTypes.map((ticket, index) => {
              const isSelected = selectedTicketType?.id === ticket.id;
              const isVIP = ticket.name === 'VIP';

              return (
                <motion.div
                  key={ticket.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                >
                  <Card
                    className={`relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 ${
                      isSelected
                        ? 'border-2 shadow-xl bg-gradient-to-br from-neutral-900 to-neutral-800'
                        : 'border bg-neutral-900/50 backdrop-blur-lg hover:border-neutral-700'
                    }`}
                    style={{
                      borderColor: isSelected ? ticket.color : undefined,
                      boxShadow: isSelected ? `0 0 30px ${ticket.color}40` : undefined,
                    }}
                    onClick={() => handleSelectTicket(ticket)}
                  >
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: ticket.color }}
                      >
                        <Check className="w-6 h-6 text-white" />
                      </motion.div>
                    )}

                    {isVIP && (
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400" />
                    )}

                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-3 mb-4">
                        {isVIP ? (
                          <Crown className="w-8 h-8 text-amber-400" />
                        ) : (
                          <Sparkles className="w-8 h-8 text-indigo-400" />
                        )}
                        <CardTitle className="text-3xl">{ticket.name}</CardTitle>
                      </div>

                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold" style={{ color: ticket.color }}>
                          {formatPrice(ticket.price)}
                        </span>
                        <span className="text-neutral-400">/ person</span>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <div className="space-y-3">
                        {ticket.benefits.map((benefit, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 + idx * 0.1 }}
                            className="flex items-start gap-3"
                          >
                            <div
                              className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                              style={{ backgroundColor: `${ticket.color}20` }}
                            >
                              <Check className="w-3 h-3" style={{ color: ticket.color }} />
                            </div>
                            <span className="text-neutral-300 text-sm">{benefit}</span>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center"
          >
            <Button
              size="lg"
              disabled={!selectedTicketType}
              onClick={handleContinue}
              className="bg-gradient-to-r from-indigo-500 to-rose-500 hover:from-indigo-600 hover:to-rose-600 text-white rounded-2xl px-8 py-6 text-lg shadow-lg shadow-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue to Booking <ArrowRight className="ml-2" />
            </Button>

            {!selectedTicketType && (
              <p className="text-neutral-500 text-sm mt-4">
                Please select a ticket type to continue
              </p>
            )}
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};
