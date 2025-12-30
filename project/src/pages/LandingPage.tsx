import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Users, Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';

export const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <Navbar />

      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-neutral-950 to-rose-900/20" />
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3617457/pexels-photo-3617457.jpeg?auto=compress&cs=tinysrgb&w=1920')] bg-cover bg-center opacity-20" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-4 max-w-4xl"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500/20 to-rose-500/20 border border-indigo-500/30 mb-6"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-sm text-neutral-300">Traditional Indonesian Performance</span>
          </motion.div>

          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-indigo-400 via-rose-400 to-amber-400 bg-clip-text text-transparent">
            Sendratari
          </h1>

          <p className="text-xl md:text-2xl text-neutral-300 mb-8 max-w-2xl mx-auto">
            Experience the epic tale of Ramayana through mesmerizing dance, music, and theatrical performance
          </p>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              size="lg"
              onClick={() => navigate('/tickets')}
              className="bg-gradient-to-r from-indigo-500 to-rose-500 hover:from-indigo-600 hover:to-rose-600 text-white rounded-2xl px-8 py-6 text-lg shadow-lg shadow-indigo-500/30"
            >
              Get Your Tickets <ArrowRight className="ml-2" />
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-neutral-600 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-neutral-400 rounded-full mt-2" />
          </div>
        </motion.div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">What is Sendratari?</h2>
            <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
              A blend of "seni" (art), "drama" (drama), and "tari" (dance) - telling the ancient story of Ramayana without dialogue
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="bg-neutral-900/50 border-neutral-800 backdrop-blur-lg rounded-2xl overflow-hidden hover:border-indigo-500/50 transition-all duration-300">
                <div className="h-64 bg-gradient-to-br from-indigo-500/20 to-rose-500/20 flex items-center justify-center">
                  <img
                    src="https://images.pexels.com/photos/3617457/pexels-photo-3617457.jpeg?auto=compress&cs=tinysrgb&w=800"
                    alt="Sendratari Performance"
                    className="w-full h-full object-cover opacity-70"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-2xl">The Story</CardTitle>
                  <CardDescription className="text-neutral-400">
                    Witness the legendary tale of Rama's quest to rescue Sita from the demon king Ravana, featuring over 200 performers bringing this epic to life.
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="bg-neutral-900/50 border-neutral-800 backdrop-blur-lg rounded-2xl overflow-hidden hover:border-rose-500/50 transition-all duration-300">
                <div className="h-64 bg-gradient-to-br from-rose-500/20 to-amber-500/20 flex items-center justify-center">
                  <img
                    src="https://images.pexels.com/photos/3401920/pexels-photo-3401920.jpeg?auto=compress&cs=tinysrgb&w=800"
                    alt="Cultural Dance"
                    className="w-full h-full object-cover opacity-70"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-2xl">The Experience</CardTitle>
                  <CardDescription className="text-neutral-400">
                    Immerse yourself in traditional Javanese gamelan music, intricate choreography, and stunning costumes under the starlit sky.
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-6"
          >
            <Card className="bg-gradient-to-br from-neutral-900 to-neutral-900/50 border-neutral-800 rounded-2xl hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300">
              <CardHeader className="text-center">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-indigo-400" />
                <CardTitle>Every Weekend</CardTitle>
                <CardDescription className="text-neutral-400">
                  Saturday & Sunday performances at 7:00 PM
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-gradient-to-br from-neutral-900 to-neutral-900/50 border-neutral-800 rounded-2xl hover:shadow-xl hover:shadow-rose-500/10 transition-all duration-300">
              <CardHeader className="text-center">
                <MapPin className="w-12 h-12 mx-auto mb-4 text-rose-400" />
                <CardTitle>Prambanan Temple</CardTitle>
                <CardDescription className="text-neutral-400">
                  Authentic setting at the historic temple complex
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-gradient-to-br from-neutral-900 to-neutral-900/50 border-neutral-800 rounded-2xl hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300">
              <CardHeader className="text-center">
                <Users className="w-12 h-12 mx-auto mb-4 text-amber-400" />
                <CardTitle>200+ Performers</CardTitle>
                <CardDescription className="text-neutral-400">
                  World-class artists bringing the story to life
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-b from-transparent to-neutral-900/50">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready for an Unforgettable Night?
            </h2>
            <p className="text-neutral-400 text-lg mb-8">
              Book your tickets now and be part of this magical cultural experience
            </p>
            <Button
              size="lg"
              onClick={() => navigate('/tickets')}
              className="bg-gradient-to-r from-indigo-500 to-rose-500 hover:from-indigo-600 hover:to-rose-600 text-white rounded-2xl px-8 py-6 text-lg shadow-lg shadow-indigo-500/30"
            >
              Choose Your Seats <ArrowRight className="ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
