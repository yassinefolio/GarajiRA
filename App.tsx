
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  MapPin, 
  Star, 
  Clock, 
  ChevronLeft, 
  Shield, 
  Maximize2, 
  ArrowRight,
  Home as HomeIcon,
  Plus,
  MessageCircle,
  User,
  Filter,
  CheckCircle2,
  Calendar,
  Lock,
  Unlock,
  X,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { Screen, Garage, Category, Booking } from './types';
import { COLORS, MOCK_GARAGES } from './constants';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [selectedGarage, setSelectedGarage] = useState<Garage | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All');
  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  const [revealedCodes, setRevealedCodes] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (currentScreen === 'splash') {
      const timer = setTimeout(() => setCurrentScreen('home'), 2500);
      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  const handleBooking = () => {
    if (!selectedGarage) return;
    setCurrentScreen('payment');
  };

  const confirmPayment = () => {
    const now = new Date();
    // For demo purposes, we create an "active" booking that starts now
    const newBooking: Booking = {
      id: Math.random().toString(36).substr(2, 9),
      garageId: selectedGarage!.id,
      garageName: selectedGarage!.name,
      garageImage: selectedGarage!.image,
      date: now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      startTime: `${now.getHours()}:00`,
      endTime: `${now.getHours() + 2}:00`,
      accessCode: Math.floor(1000 + Math.random() * 9000).toString(),
      status: 'active',
      timestamp: now.getTime()
    };
    setBookings(prev => [newBooking, ...prev]);
    setCurrentScreen('success');
  };

  const generateCode = (bookingId: string) => {
    setIsGenerating(bookingId);
    setTimeout(() => {
      setRevealedCodes(prev => ({ ...prev, [bookingId]: true }));
      setIsGenerating(null);
    }, 1500);
  };

  // --- Helpers ---
  const isAccessible = (booking: Booking) => {
    // In a real app, we'd check real time. 
    // Here, we treat 'active' status as accessible.
    return booking.status === 'active';
  };

  // --- UI Components ---

  const SplashScreen = () => (
    <div className="fixed inset-0 bg-[#F7F8FA] flex flex-col items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="flex flex-col items-center"
      >
        <h1 className="text-5xl font-bold tracking-tighter text-[#3A6EA5] mb-2">GARAJI</h1>
        <p className="text-[#6B7280] font-light tracking-widest uppercase text-sm">Store. Park. Access.</p>
      </motion.div>
    </div>
  );

  const BottomNav = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex justify-around items-center px-6 py-4 z-40">
      <NavButton icon={<HomeIcon size={24} />} label="Home" active={currentScreen === 'home'} onClick={() => setCurrentScreen('home')} />
      <NavButton icon={<Lock size={24} />} label="Access" active={currentScreen === 'access'} onClick={() => setCurrentScreen('access')} />
      <div 
        onClick={() => setCurrentScreen('add')}
        className="w-12 h-12 bg-[#3A6EA5] rounded-full flex items-center justify-center text-white -mt-10 shadow-lg"
      >
        <Plus size={28} />
      </div>
     <NavButton icon={<User size={24} />} label="Profile" active={currentScreen === 'profile'} onClick={() => setCurrentScreen('profile')} />
    </div>
  );

  const NavButton = ({ icon, label, active, onClick }: any) => (
    <button onClick={onClick} className="flex flex-col items-center space-y-1">
      <div className={`${active ? 'text-[#3A6EA5]' : 'text-[#6B7280]'}`}>{icon}</div>
      <span className={`text-[10px] font-medium ${active ? 'text-[#3A6EA5]' : 'text-[#6B7280]'}`}>{label}</span>
    </button>
  );

  const HomeScreen = () => (
    <div className="pb-24 pt-6 px-4">
      <div className="sticky top-2 z-30 mb-6">
        <div className="bg-white shadow-md rounded-2xl flex items-center px-4 py-3 border border-gray-50">
          <Search size={20} className="text-[#6B7280] mr-3" />
          <input 
            type="text" 
            placeholder="Find a garage near you" 
            className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-[#6B7280]"
          />
          <Filter size={18} className="text-[#3A6EA5]" />
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4 px-1 text-[#1F2933]">Categories</h2>
        <div className="flex space-x-3 overflow-x-auto hide-scrollbar pb-2">
          {['All', 'Motorcycle', 'Bike', 'Storage', 'Private Garage'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat as any)}
              className={`whitespace-nowrap px-5 py-2.5 rounded-2xl text-sm font-medium transition-all ${
                activeCategory === cat 
                  ? 'bg-[#3A6EA5] text-white shadow-md' 
                  : 'bg-white text-[#6B7280] shadow-sm'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4 px-1">
          <h2 className="text-lg font-semibold text-[#1F2933]">Nearby Garages</h2>
          <button className="text-[#3A6EA5] text-sm font-medium">See All</button>
        </div>
        <div className="space-y-4">
          {MOCK_GARAGES
            .filter(g => activeCategory === 'All' || g.category === activeCategory)
            .map((garage) => (
            <motion.div
              layoutId={garage.id}
              key={garage.id}
              onClick={() => {
                setSelectedGarage(garage);
                setCurrentScreen('details');
              }}
              className="bg-white rounded-3xl p-3 shadow-sm flex space-x-4 cursor-pointer active:scale-95 transition-transform"
            >
              <div className="relative w-28 h-28 flex-shrink-0">
                <img src={garage.image} className="w-full h-full object-cover rounded-2xl" alt={garage.name} />
                {!garage.available && (
                  <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center">
                    <span className="text-white text-[10px] font-bold uppercase tracking-wider">Booked</span>
                  </div>
                )}
              </div>
              <div className="flex-1 py-1 pr-2 relative">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-semibold text-base leading-tight text-[#1F2933]">{garage.name}</h3>
                </div>
                <div className="flex items-center text-[#6B7280] text-xs mb-2">
                  <MapPin size={12} className="mr-1" />
                  <span>{garage.distance}</span>
                </div>
                <div className="flex items-center space-x-1 mb-2">
                  <Star size={12} className="text-[#F5B942] fill-[#F5B942]" />
                  <span className="text-xs font-bold text-[#1F2933]">{garage.rating}</span>
                  <span className="text-[#6B7280] text-[10px]">({garage.reviewsCount})</span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <div className="flex items-baseline">
                    <span className="text-[#3A6EA5] font-bold text-lg">${garage.pricePerHour}</span>
                    <span className="text-[#6B7280] text-[10px] ml-1">/hr</span>
                  </div>
                  {garage.available && (
                    <div className="bg-[#2ED3B7]/10 text-[#2ED3B7] text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Available
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  const AccessScreen = () => (
    <div className="pb-24 pt-12 px-6 bg-[#F7F8FA] min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1F2933]">Access & Keys</h1>
        <p className="text-[#6B7280] text-sm mt-1">Generate your codes when you arrive.</p>
      </div>

      {bookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-300 mb-4">
            <Lock size={40} />
          </div>
          <p className="text-[#6B7280] max-w-[200px]">You have no active or upcoming rentals.</p>
          <button onClick={() => setCurrentScreen('home')} className="mt-6 px-6 py-3 bg-[#3A6EA5] text-white rounded-2xl font-bold shadow-md">Find a Space</button>
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => {
            const accessible = isAccessible(booking);
            const revealed = revealedCodes[booking.id];
            const generating = isGenerating === booking.id;

            return (
              <motion.div 
                key={booking.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl p-5 shadow-sm border border-gray-50"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <img src={booking.garageImage} className="w-12 h-12 rounded-xl object-cover" alt="" />
                    <div>
                      <h3 className="font-bold text-[#1F2933] text-sm">{booking.garageName}</h3>
                      <p className="text-[10px] text-[#6B7280]">{booking.date} • {booking.startTime} - {booking.endTime}</p>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${accessible ? 'bg-[#2ED3B7]/10 text-[#2ED3B7]' : 'bg-amber-100 text-amber-600'}`}>
                    {accessible ? 'Accessible Now' : 'Upcoming'}
                  </div>
                </div>

                {!revealed ? (
                  <div className={`p-6 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-colors ${accessible ? 'bg-[#3A6EA5]/5 border-[#3A6EA5]/20' : 'bg-gray-50 border-gray-100 opacity-60'}`}>
                    {generating ? (
                      <div className="flex flex-col items-center">
                        <RefreshCw size={32} className="text-[#3A6EA5] animate-spin mb-3" />
                        <span className="text-xs font-bold text-[#3A6EA5]">Generating Secure Key...</span>
                      </div>
                    ) : accessible ? (
                      <>
                        <Unlock size={32} className="text-[#3A6EA5] mb-3" />
                        <button 
                          onClick={() => generateCode(booking.id)}
                          className="px-6 py-3 bg-[#FF6B4A] text-white rounded-xl font-bold text-sm shadow-md active:scale-95 transition-all"
                        >
                          Generate Access Code
                        </button>
                        <p className="text-[10px] text-[#6B7280] mt-3">Only visible while you have access</p>
                      </>
                    ) : (
                      <>
                        <Lock size={32} className="text-gray-300 mb-3" />
                        <span className="text-sm font-bold text-gray-400">Locked</span>
                        <p className="text-[10px] text-[#6B7280] mt-2">Available at {booking.startTime}</p>
                      </>
                    )}
                  </div>
                ) : (
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-[#3A6EA5] p-6 rounded-2xl flex flex-col items-center relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12" />
                    <p className="text-[10px] text-white/60 font-bold uppercase tracking-widest mb-4">Your Dynamic Key</p>
                    <div className="flex space-x-3 mb-4">
                      {booking.accessCode.split('').map((char, i) => (
                        <div key={i} className="w-10 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center text-2xl font-bold text-white">
                          {char}
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center text-white/80 text-[10px] font-medium">
                      <Clock size={12} className="mr-1" />
                      <span>Expires in 1:45:02</span>
                    </div>
                  </motion.div>
                )}
                
                <div className="mt-4 flex items-center justify-between">
                  <button className="text-[11px] font-bold text-[#3A6EA5] flex items-center">
                    <MapPin size={12} className="mr-1" /> View Directions
                  </button>
                  <button className="text-[11px] font-bold text-[#6B7280] flex items-center">
                    <AlertCircle size={12} className="mr-1" /> Need Help?
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );

  const SuccessScreen = () => (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-8 text-center">
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="w-24 h-24 bg-[#2ED3B7] rounded-full flex items-center justify-center text-white mb-8 shadow-xl shadow-[#2ED3B7]/20"
      >
        <CheckCircle2 size={48} />
      </motion.div>
      
      <h1 className="text-3xl font-bold mb-3 text-[#1F2933]">Booking Confirmed!</h1>
      <p className="text-[#6B7280] mb-12">Your space is reserved. You can generate your access code on the Access screen when your session starts.</p>

      <button 
        onClick={() => setCurrentScreen('access')}
        className="w-full py-5 bg-[#3A6EA5] text-white rounded-2xl font-bold shadow-lg active:scale-95 transition-all mb-4"
      >
        Go to Access Keys
      </button>
      <button 
        onClick={() => setCurrentScreen('home')}
        className="text-[#6B7280] font-bold text-sm"
      >
        Back to Home
      </button>
    </div>
  );

  const DetailsScreen = () => {
    if (!selectedGarage) return null;
    return (
      <div className="pb-32 bg-white min-h-screen">
        <div className="relative h-80">
          <img src={selectedGarage.image} className="w-full h-full object-cover" alt="" />
          <div className="absolute top-6 left-4 right-4 flex justify-between items-center">
            <button onClick={() => setCurrentScreen('home')} className="p-2 bg-white/20 backdrop-blur-md rounded-2xl text-white">
              <ChevronLeft size={24} />
            </button>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent" />
        </div>

        <div className="px-6 -mt-4 relative bg-white rounded-t-3xl pt-8">
          <div className="flex justify-between items-start mb-2">
            <div>
              <div className="bg-[#3A6EA5]/10 text-[#3A6EA5] text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mb-2">
                {selectedGarage.category}
              </div>
              <h1 className="text-2xl font-bold text-[#1F2933]">{selectedGarage.name}</h1>
            </div>
            <div className="text-right">
              <div className="flex items-center justify-end space-x-1">
                <Star size={16} className="text-[#F5B942] fill-[#F5B942]" />
                <span className="font-bold text-[#1F2933]">{selectedGarage.rating}</span>
              </div>
              <p className="text-[#6B7280] text-xs">{selectedGarage.reviewsCount} reviews</p>
            </div>
          </div>

          <div className="flex items-center text-[#6B7280] text-sm mb-6">
            <MapPin size={14} className="mr-1" />
            <span>22 Baker Street • {selectedGarage.distance} away</span>
          </div>

          <div className="flex items-center p-3 bg-[#F7F8FA] rounded-2xl mb-8">
            <img src={selectedGarage.owner.image} className="w-10 h-10 rounded-xl mr-3" alt="" />
            <div className="flex-1">
              <h4 className="font-semibold text-sm text-[#1F2933]">{selectedGarage.owner.name}</h4>
              <p className="text-[10px] text-[#6B7280]">Owner • Verified</p>
            </div>
            <button className="p-2 bg-white rounded-xl shadow-sm"><MessageCircle size={18} className="text-[#3A6EA5]" /></button>
          </div>

          <div className="mb-8">
            <h3 className="font-bold text-lg mb-2 text-[#1F2933]">About this space</h3>
            <p className="text-[#6B7280] text-sm leading-relaxed">{selectedGarage.description}</p>
          </div>

          <div className="mb-8">
            <h3 className="font-bold text-lg mb-4 text-[#1F2933]">Features</h3>
            <div className="grid grid-cols-2 gap-3">
              <FeatureItem icon={<Shield size={18} />} label="Security" value={selectedGarage.features.security} />
              <FeatureItem icon={<Maximize2 size={18} />} label="Size" value={selectedGarage.features.size} />
              <FeatureItem icon={<Clock size={18} />} label="Height" value={selectedGarage.features.height} />
              <FeatureItem icon={<CheckCircle2 size={18} />} label="Anchor" value={selectedGarage.features.groundAnchor ? 'Yes' : 'No'} />
            </div>
          </div>

          <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100 flex items-center justify-between z-50">
            <div>
              <p className="text-[#6B7280] text-xs">Price per hour</p>
              <div className="flex items-baseline">
                <span className="text-2xl font-bold text-[#3A6EA5]">${selectedGarage.pricePerHour}</span>
                <span className="text-[#6B7280] text-sm ml-1">/hr</span>
              </div>
            </div>
            <button 
              onClick={handleBooking}
              disabled={!selectedGarage.available}
              className={`px-10 py-4 rounded-2xl font-bold text-white shadow-lg transition-all active:scale-95 ${
                selectedGarage.available ? 'bg-[#FF6B4A]' : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              Book Space
            </button>
          </div>
        </div>
      </div>
    );
  };

  const FeatureItem = ({ icon, label, value }: any) => (
    <div className="flex items-center p-3 bg-[#F7F8FA] rounded-2xl">
      <div className="text-[#3A6EA5] mr-3">{icon}</div>
      <div>
        <p className="text-[10px] text-[#6B7280] leading-none mb-1">{label}</p>
        <p className="text-xs font-bold leading-none text-[#1F2933]">{value}</p>
      </div>
    </div>
  );

  const PaymentScreen = () => (
    <div className="min-h-screen bg-[#F7F8FA] px-6 pt-12 pb-12">
      <div className="flex items-center mb-8">
        <button onClick={() => setCurrentScreen('details')} className="mr-4 p-2 bg-white rounded-xl shadow-sm">
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-xl font-bold text-[#1F2933]">Review Booking</h1>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm mb-6">
        <div className="flex items-center mb-4 pb-4 border-b border-gray-50">
          <img src={selectedGarage?.image} className="w-16 h-16 rounded-2xl object-cover mr-4" alt="" />
          <div>
            <h3 className="font-bold text-[#1F2933]">{selectedGarage?.name}</h3>
            <p className="text-xs text-[#6B7280]">{selectedGarage?.distance} from you</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center text-sm text-[#6B7280]">
              <Calendar size={16} className="mr-2" />
              <span>Date</span>
            </div>
            <span className="text-sm font-bold text-[#1F2933]">Today</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center text-sm text-[#6B7280]">
              <Clock size={16} className="mr-2" />
              <span>Duration</span>
            </div>
            <span className="text-sm font-bold text-[#1F2933]">2 Hours (Immediate)</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm mb-12">
        <h3 className="font-bold mb-4 text-[#1F2933]">Order Total</h3>
        <div className="space-y-3 mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-[#6B7280]">Garage Rental</span>
            <span className="font-medium text-[#1F2933]">${(selectedGarage?.pricePerHour || 0) * 2}.00</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#6B7280]">Service Fee</span>
            <span className="font-medium text-[#1F2933]">$1.50</span>
          </div>
          <div className="flex justify-between text-base font-bold pt-3 border-t border-gray-50">
            <span>Total to Pay</span>
            <span className="text-[#3A6EA5]">${(selectedGarage?.pricePerHour || 0) * 2 + 1.50}</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center p-4 border border-[#3A6EA5] rounded-2xl bg-[#3A6EA5]/5">
            <div className="w-10 h-6 bg-blue-600 rounded flex items-center justify-center text-[8px] text-white font-bold mr-3">VISA</div>
            <span className="flex-1 font-bold text-sm text-[#1F2933]">•••• •••• •••• 4242</span>
            <div className="w-5 h-5 rounded-full bg-[#3A6EA5] flex items-center justify-center">
              <CheckCircle2 size={12} className="text-white" />
            </div>
          </div>
        </div>
      </div>

      <button 
        onClick={confirmPayment}
        className="w-full py-5 bg-[#FF6B4A] text-white rounded-2xl font-bold shadow-xl shadow-orange-100 active:scale-95 transition-all"
      >
        Pay & Confirm
      </button>
    </div>
  );

  const ProfileScreen = () => (
    <div className="pb-24 pt-12 px-6">
      <div className="flex items-center mb-8">
        <img src="https://picsum.photos/seed/user123/150/150" className="w-20 h-20 rounded-3xl mr-4 border-4 border-white shadow-sm" alt="" />
        <div>
          <h2 className="text-xl font-bold text-[#1F2933]">John Doe</h2>
          <p className="text-[#6B7280] text-sm">GARAJI Explorer • Since 2024</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-8">
        <div className="bg-white rounded-2xl p-4 text-center shadow-sm">
          <p className="text-lg font-bold text-[#3A6EA5]">{bookings.length}</p>
          <p className="text-[10px] text-[#6B7280]">Rentals</p>
        </div>
        <div className="bg-white rounded-2xl p-4 text-center shadow-sm">
          <p className="text-lg font-bold text-[#3A6EA5]">4.9</p>
          <p className="text-[10px] text-[#6B7280]">Trust Rating</p>
        </div>
      </div>

      <h3 className="font-bold mb-4 text-[#1F2933]">Account Settings</h3>
      <div className="bg-white rounded-3xl overflow-hidden shadow-sm">
        <MenuItem label="Payment Methods" icon={<Plus size={18} />} />
        <MenuItem label="Security & Verification" icon={<Shield size={18} />} />
        <MenuItem label="Support Center" icon={<MessageCircle size={18} />} />
        <MenuItem label="Log Out" icon={<X size={18} />} color="text-[#EF4444]" />
      </div>
    </div>
  );

  const MenuItem = ({ label, icon, color = 'text-[#1F2933]' }: any) => (
    <div className="flex items-center px-6 py-4 border-b border-gray-50 last:border-0 cursor-pointer active:bg-gray-50">
      <div className={`${color} mr-4`}>{icon}</div>
      <span className={`text-sm font-medium flex-1 ${color}`}>{label}</span>
      <ArrowRight size={16} className="text-gray-300" />
    </div>
  );

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#F7F8FA] select-none shadow-2xl">
      <AnimatePresence mode="wait">
        {currentScreen === 'splash' && <SplashScreen key="splash" />}
        {currentScreen === 'home' && (
          <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <HomeScreen />
            <BottomNav />
          </motion.div>
        )}
        {currentScreen === 'access' && (
          <motion.div key="access" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <AccessScreen />
            <BottomNav />
          </motion.div>
        )}
        {currentScreen === 'details' && (
          <motion.div key="details" initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ opacity: 0 }}>
            <DetailsScreen />
          </motion.div>
        )}
        {currentScreen === 'payment' && (
          <motion.div key="payment" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ opacity: 0 }}>
            <PaymentScreen />
          </motion.div>
        )}
        {currentScreen === 'success' && (
          <motion.div key="success" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }}>
            <SuccessScreen />
          </motion.div>
        )}
        {currentScreen === 'profile' && (
          <motion.div key="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ProfileScreen />
            <BottomNav />
          </motion.div>
        )}
        {currentScreen === 'add' && (
          <motion.div key="add" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 20 }}>
            <div className="min-h-screen bg-white pt-12 px-6">
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold">List Your Space</h1>
                <button onClick={() => setCurrentScreen('home')} className="p-2 bg-[#F7F8FA] rounded-xl"><X size={20} /></button>
              </div>
              <p className="text-[#6B7280] mb-8">Register your garage and start earning today.</p>
              <button className="w-full py-5 bg-[#3A6EA5] text-white rounded-2xl font-bold">Get Started</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
