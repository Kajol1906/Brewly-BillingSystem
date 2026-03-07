import { useState, useEffect } from 'react';

import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Clock, Users, Package, History, X, CalendarCheck } from 'lucide-react';
import EventCalendar from './EventCalendar';
import EventSidebar from './EventSidebar';

import { getAllEvents } from '../../services/eventService';

export interface Event {
  id: number;
  date: Date;
  title: string;
  type: 'birthday' | 'corporate' | 'family' | 'anniversary';
  guestCount: number;
  time: string;
  package: string;
}

export default function EventBooking() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showAllUpcoming, setShowAllUpcoming] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const data = await getAllEvents();
      setEvents(data as any); // Type assertion if needed or update Import of Event interface
    } catch (err) {
      console.error("Failed to load events", err);
    }
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const pastEvents = events
    .filter(e => {
      const d = e.date instanceof Date ? e.date : new Date(String(e.date) + 'T00:00:00');
      return d.getTime() < today.getTime();
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const colors: Record<string, string> = {
    birthday: 'from-[#FFB3D9] to-[#FFB3D9]/70',
    corporate: 'from-[#A8D8FF] to-[#A8D8FF]/70',
    family: 'from-[#C9B3FF] to-[#C9B3FF]/70',
    anniversary: 'from-[#FFD700] to-[#FFD700]/70',
  };

  return (
    <div className="p-8">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-6 flex items-start justify-between"
      >
        <div>
          <h1>Event Booking</h1>
          <p className="text-muted-foreground mt-1">
            Manage café events and reservations
          </p>
        </div>
        <div className="flex items-center gap-3">
          {(() => {
            const upcomingCount = events.filter(e => {
              const d = e.date instanceof Date ? e.date : new Date(String(e.date) + 'T00:00:00');
              return d.getTime() >= today.getTime();
            }).length;
            return upcomingCount > 0 ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { setShowAllUpcoming(!showAllUpcoming); setShowHistory(false); setSelectedDate(null); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
                  showAllUpcoming
                    ? 'border-[#6C63FF] bg-[#6C63FF]/10 text-[#6C63FF]'
                    : 'border-border hover:border-[#6C63FF]/30 text-muted-foreground hover:text-foreground'
                }`}
              >
                <CalendarCheck className="w-4 h-4" />
                <span className="text-sm font-medium">Upcoming Events</span>
                <span className="text-xs bg-muted/50 px-1.5 py-0.5 rounded-full">{upcomingCount}</span>
              </motion.button>
            ) : null;
          })()}
          {pastEvents.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { setShowHistory(!showHistory); setSelectedDate(null); setShowAllUpcoming(false); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
                showHistory
                  ? 'border-[#6C63FF] bg-[#6C63FF]/10 text-[#6C63FF]'
                  : 'border-border hover:border-[#6C63FF]/30 text-muted-foreground hover:text-foreground'
              }`}
            >
              <History className="w-4 h-4" />
              <span className="text-sm font-medium">Event History</span>
              <span className="text-xs bg-muted/50 px-1.5 py-0.5 rounded-full">{pastEvents.length}</span>
            </motion.button>
          )}
        </div>
      </motion.div>

      <div className="flex gap-6">
        {/* Calendar */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex-1"
        >
          <div className="bg-card rounded-2xl p-6 border border-border shadow-soft">
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
              onDateClick={(date) => { setSelectedDate(date); setShowHistory(false); setShowAllUpcoming(false); }}
              selectedDate={selectedDate}
            />
          </div>
        </motion.div>

        {/* Right Sidebar: Event Sidebar or History */}
        <AnimatePresence mode="wait">
          {selectedDate && !showHistory && !showAllUpcoming && (
            <EventSidebar
              selectedDate={selectedDate}
              events={events.filter(e => {
                const eventDate = e.date instanceof Date ? e.date : new Date(String(e.date) + 'T00:00:00');
                return eventDate.toDateString() === selectedDate.toDateString();
              })}
              onClose={() => setSelectedDate(null)}
              onEventCreated={fetchEvents}
            />
          )}

          {showAllUpcoming && (
            <motion.div
              key="upcoming-sidebar"
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-96 bg-card rounded-2xl border border-border shadow-soft-lg p-6 max-h-[calc(100vh-200px)] overflow-y-auto"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3>Upcoming Events</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {events.filter(e => {
                      const d = e.date instanceof Date ? e.date : new Date(String(e.date) + 'T00:00:00');
                      return d.getTime() >= today.getTime();
                    }).length} upcoming event{events.filter(e => {
                      const d = e.date instanceof Date ? e.date : new Date(String(e.date) + 'T00:00:00');
                      return d.getTime() >= today.getTime();
                    }).length !== 1 ? 's' : ''}
                  </p>
                </div>
                <button
                  onClick={() => setShowAllUpcoming(false)}
                  className="w-8 h-8 rounded-lg hover:bg-muted/50 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                {events
                  .filter(e => {
                    const d = e.date instanceof Date ? e.date : new Date(String(e.date) + 'T00:00:00');
                    return d.getTime() >= today.getTime();
                  })
                  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                  .map(event => {
                    const eventDate = new Date(event.date);
                    const formattedDate = eventDate.toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric'
                    });
                    const gradient = colors[event.type] || 'from-[#A8D8FF] to-[#A8D8FF]/70';

                    return (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.02, y: -2 }}
                        onClick={() => { setSelectedDate(eventDate); setShowAllUpcoming(false); }}
                        className={`p-4 rounded-xl bg-gradient-to-br ${gradient} border border-border relative cursor-pointer`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <p className="font-medium">{event.title}</p>
                          <span className="text-[10px] font-medium px-2 py-0.5 bg-black/10 rounded-full whitespace-nowrap ml-2">
                            Upcoming
                          </span>
                        </div>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{formattedDate} at {event.time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            <span>{event.guestCount} guests</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Package className="w-4 h-4" />
                            <span>{event.package} Package</span>
                          </div>
                        </div>
                        <span className="text-xs font-medium px-2 py-0.5 bg-white/50 rounded-full capitalize inline-block mt-2">
                          {event.type}
                        </span>
                      </motion.div>
                    );
                  })}
              </div>
            </motion.div>
          )}

          {showHistory && (
            <motion.div
              key="history-sidebar"
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-96 bg-card rounded-2xl border border-border shadow-soft-lg p-6 max-h-[calc(100vh-200px)] overflow-y-auto"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3>Event History</h3>
                  <p className="text-sm text-muted-foreground mt-1">{pastEvents.length} past event{pastEvents.length !== 1 ? 's' : ''}</p>
                </div>
                <button
                  onClick={() => setShowHistory(false)}
                  className="w-8 h-8 rounded-lg hover:bg-muted/50 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                {pastEvents.map(event => {
                  const eventDate = new Date(event.date);
                  const formattedDate = eventDate.toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  });
                  const gradient = colors[event.type] || 'from-[#A8D8FF] to-[#A8D8FF]/70';

                  return (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      className={`p-4 rounded-xl bg-gradient-to-br ${gradient} border border-border relative`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <p className="font-medium">{event.title}</p>
                        <span className="text-[10px] font-medium px-2 py-0.5 bg-black/10 rounded-full whitespace-nowrap ml-2">
                          Completed
                        </span>
                      </div>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{formattedDate} at {event.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          <span>{event.guestCount} guests</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4" />
                          <span>{event.package} Package</span>
                        </div>
                      </div>
                      <span className="text-xs font-medium px-2 py-0.5 bg-white/50 rounded-full capitalize inline-block mt-2">
                        {event.type}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>


    </div>
  );
}



