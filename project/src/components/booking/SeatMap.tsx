import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Armchair } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Seat, useBooking } from '@/contexts/BookingContext';

export const SeatMap = () => {
  const { selectedSeats, setSelectedSeats, selectedTicketType } = useBooking();
  const [seats, setSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (selectedTicketType) {
      fetchSeats();
    }
  }, [selectedTicketType]);

  const fetchSeats = async () => {
    try {
      const { data, error } = await supabase
        .from('seats')
        .select('*')
        .eq('ticket_type_id', selectedTicketType?.id)
        .order('row')
        .order('position');

      if (error) throw error;
      setSeats(data || []);
    } catch (error) {
      console.error('Error fetching seats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSeatClick = (seat: Seat) => {
    if (!seat.is_available) return;

    const isSelected = selectedSeats.find((s) => s.id === seat.id);
    if (isSelected) {
      setSelectedSeats(selectedSeats.filter((s) => s.id !== seat.id));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const getSeatColor = (seat: Seat) => {
    if (!seat.is_available) return 'bg-red-500/20 border-red-500/50 cursor-not-allowed';
    if (selectedSeats.find((s) => s.id === seat.id)) return 'bg-blue-500 border-blue-400 shadow-lg shadow-blue-500/50';
    if (selectedTicketType?.name === 'VIP') return 'bg-amber-500/20 border-amber-500/50 hover:bg-amber-500/40';
    return 'bg-green-500/20 border-green-500/50 hover:bg-green-500/40';
  };

  const groupedSeats = seats.reduce((acc, seat) => {
    if (!acc[seat.row]) acc[seat.row] = [];
    acc[seat.row].push(seat);
    return acc;
  }, {} as Record<string, Seat[]>);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-indigo-500/20 via-rose-500/20 to-amber-500/20 rounded-2xl p-4 text-center border border-neutral-800">
        <p className="text-sm text-neutral-300">STAGE</p>
      </div>

      <div className="space-y-4">
        {Object.entries(groupedSeats).map(([row, rowSeats]) => (
          <motion.div
            key={row}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <div className="w-8 h-8 flex items-center justify-center font-bold text-neutral-400">
              {row}
            </div>
            <div className="flex gap-2 flex-wrap">
              {rowSeats.map((seat) => (
                <motion.button
                  key={seat.id}
                  whileHover={{ scale: seat.is_available ? 1.1 : 1 }}
                  whileTap={{ scale: seat.is_available ? 0.95 : 1 }}
                  onClick={() => handleSeatClick(seat)}
                  className={`w-10 h-10 rounded-lg border-2 transition-all duration-200 flex items-center justify-center ${getSeatColor(
                    seat
                  )}`}
                  title={`Seat ${seat.seat_number}`}
                  disabled={!seat.is_available}
                >
                  <Armchair className="w-5 h-5" />
                </motion.button>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex flex-wrap gap-6 justify-center pt-8 border-t border-neutral-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-green-500/20 border-2 border-green-500/50" />
          <span className="text-sm text-neutral-400">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-500 border-2 border-blue-400" />
          <span className="text-sm text-neutral-400">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-red-500/20 border-2 border-red-500/50" />
          <span className="text-sm text-neutral-400">Booked</span>
        </div>
        {selectedTicketType?.name === 'VIP' && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border-2 border-amber-500/50" />
            <span className="text-sm text-neutral-400">VIP</span>
          </div>
        )}
      </div>
    </div>
  );
};
