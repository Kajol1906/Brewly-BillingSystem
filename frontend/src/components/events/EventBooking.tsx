import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import EventCalendar from './EventCalendar';
import EventSidebar from './EventSidebar';

export interface Event {
  id: number;
  date: Date;
  title: string;
  type: 'birthday' | 'corporate' | 'family' | 'anniversary';
  guestCount: number;
  time: string;
  package: string;
}

const mockEvents: Event[] = [
  { id: 1, date: new Date(2025, 11, 15), title: 'Birthday Party', type: 'birthday', guestCount: 25, time: '18:00', package: 'Gold' },
  { id: 2, date: new Date(2025, 11, 18), title: 'Team Meeting', type: 'corporate', guestCount: 15, time: '14:00', package: 'Silver' },
  { id: 3, date: new Date(2025, 11, 20), title: 'Family Dinner', type: 'family', guestCount: 12, time: '19:00', package: 'Platinum' },
  { id: 4, date: new Date(2025, 11, 22), title: 'Anniversary', type: 'anniversary', guestCount: 30, time: '20:00', package: 'Platinum' },
  { id: 5, date: new Date(2025, 11, 25), title: 'Birthday Celebration', type: 'birthday', guestCount: 20, time: '17:00', package: 'Gold' },
];

export default function EventBooking() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 11, 1)); // December 2025
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events] = useState<Event[]>(mockEvents);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="p-8">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-6"
      >
        <h1>Event Booking</h1>
        <p className="text-muted-foreground mt-1">
          Manage café events and reservations
        </p>
      </motion.div>

      <div className="flex gap-6">
        {/* Calendar */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex-1"
        >
          <div className="bg-white rounded-2xl p-6 border border-border shadow-soft">
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-6">
              <h3>{monthName}</h3>
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handlePrevMonth}
                  className="w-10 h-10 rounded-lg bg-muted/50 hover:bg-muted flex items-center justify-center transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleNextMonth}
                  className="w-10 h-10 rounded-lg bg-muted/50 hover:bg-muted flex items-center justify-center transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </motion.button>
              </div>
            </div>

            {/* Event Type Legend */}
            <div className="flex flex-wrap gap-4 mb-6 pb-6 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#FFB3D9]" />
                <span className="text-sm text-muted-foreground">Birthday</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#A8D8FF]" />
                <span className="text-sm text-muted-foreground">Corporate</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#C9B3FF]" />
                <span className="text-sm text-muted-foreground">Family</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#FFD700]" />
                <span className="text-sm text-muted-foreground">Anniversary</span>
              </div>
            </div>

            {/* Calendar Grid */}
            <EventCalendar
              currentDate={currentDate}
              events={events}
              onDateClick={setSelectedDate}
              selectedDate={selectedDate}
            />
          </div>
        </motion.div>

        {/* Event Sidebar */}
        <AnimatePresence mode="wait">
          {selectedDate && (
            <EventSidebar
              selectedDate={selectedDate}
              events={events.filter(e => 
                e.date.toDateString() === selectedDate.toDateString()
              )}
              onClose={() => setSelectedDate(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
