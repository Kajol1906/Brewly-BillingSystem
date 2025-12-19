import { motion } from 'motion/react';
import type { Event } from './EventBooking';

interface EventCalendarProps {
  currentDate: Date;
  events: Event[];
  onDateClick: (date: Date) => void;
  selectedDate: Date | null;
}

const eventColors = {
  birthday: '#FFB3D9',
  corporate: '#A8D8FF',
  family: '#C9B3FF',
  anniversary: '#FFD700',
};

export default function EventCalendar({ currentDate, events, onDateClick, selectedDate }: EventCalendarProps) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Get first day of month and number of days
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const days = [];
  
  // Previous month days
  for (let i = firstDay - 1; i >= 0; i--) {
    days.push({
      date: new Date(year, month - 1, daysInPrevMonth - i),
      isCurrentMonth: false,
    });
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({
      date: new Date(year, month, i),
      isCurrentMonth: true,
    });
  }

  // Next month days to fill grid
  const remainingDays = 42 - days.length;
  for (let i = 1; i <= remainingDays; i++) {
    days.push({
      date: new Date(year, month + 1, i),
      isCurrentMonth: false,
    });
  }

  const getEventsForDate = (date: Date) => {
    return events.filter(e => e.date.toDateString() === date.toDateString());
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div>
      {/* Week day headers */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {weekDays.map(day => (
          <div key={day} className="text-center text-sm text-muted-foreground py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, index) => {
          const dayEvents = getEventsForDate(day.date);
          const isSelected = selectedDate?.toDateString() === day.date.toDateString();
          const isToday = day.date.toDateString() === new Date().toDateString();

          return (
            <motion.button
              key={index}
              onClick={() => onDateClick(day.date)}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className={`
                relative aspect-square p-2 rounded-xl transition-all
                ${day.isCurrentMonth 
                  ? 'bg-white border-2 border-border hover:border-[#6C63FF]/30' 
                  : 'bg-muted/30 border-2 border-transparent text-muted-foreground'
                }
                ${isSelected ? 'border-[#6C63FF] bg-[#6C63FF]/5' : ''}
                ${isToday ? 'ring-2 ring-[#6C63FF]/30' : ''}
              `}
            >
              {/* Date number */}
              <div className={`text-sm mb-1 ${isToday ? 'text-[#6C63FF]' : ''}`}>
                {day.date.getDate()}
              </div>

              {/* Event indicators */}
              {dayEvents.length > 0 && (
                <div className="flex flex-wrap gap-1 justify-center">
                  {dayEvents.slice(0, 3).map((event, i) => (
                    <motion.div
                      key={event.id}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: eventColors[event.type] }}
                    />
                  ))}
                  {dayEvents.length > 3 && (
                    <span className="text-xs text-muted-foreground">+{dayEvents.length - 3}</span>
                  )}
                </div>
              )}

              {/* Hover popup */}
              {dayEvents.length > 0 && (
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block z-10">
                  <div className="bg-white border border-border rounded-lg p-2 shadow-lg min-w-[150px]">
                    {dayEvents.map(event => (
                      <div key={event.id} className="text-xs mb-1 last:mb-0">
                        <span style={{ color: eventColors[event.type] }}>●</span> {event.title}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
