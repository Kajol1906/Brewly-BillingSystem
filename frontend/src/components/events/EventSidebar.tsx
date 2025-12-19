import { useState } from 'react';
import { motion } from 'motion/react';
import { X, Calendar, Clock, Users, Package, Plus } from 'lucide-react';
import type { Event } from './EventBooking';

interface EventSidebarProps {
  selectedDate: Date;
  events: Event[];
  onClose: () => void;
}

const packages = ['Silver', 'Gold', 'Platinum'];
const timeSlots = ['10:00', '12:00', '14:00', '16:00', '18:00', '20:00'];

export default function EventSidebar({ selectedDate, events, onClose }: EventSidebarProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    time: '',
    guestCount: '',
    package: 'Gold',
    addOns: [] as string[],
  });

  const dateStr = selectedDate.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="w-96 bg-white rounded-2xl border border-border shadow-soft-lg p-6 max-h-[calc(100vh-200px)] overflow-y-auto"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3>Events</h3>
          <p className="text-sm text-muted-foreground mt-1">{dateStr}</p>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-lg hover:bg-muted/50 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Existing Events */}
      {events.length > 0 && (
        <div className="mb-6 space-y-3">
          <h4 className="text-sm text-muted-foreground">Scheduled Events</h4>
          {events.map(event => {
            const colors = {
              birthday: 'from-[#FFB3D9] to-[#FFB3D9]/70',
              corporate: 'from-[#A8D8FF] to-[#A8D8FF]/70',
              family: 'from-[#C9B3FF] to-[#C9B3FF]/70',
              anniversary: 'from-[#FFD700] to-[#FFD700]/70',
            };

            return (
              <motion.div
                key={event.id}
                whileHover={{ scale: 1.02, y: -2 }}
                className={`p-4 rounded-xl bg-gradient-to-br ${colors[event.type]} bg-opacity-10 border border-border`}
              >
                <p className="mb-2">{event.title}</p>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{event.time}</span>
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
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Create New Event Form */}
      {!isCreating ? (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsCreating(true)}
          className="w-full h-12 bg-gradient-to-r from-[#6C63FF] to-[#93E5AB] text-white rounded-xl flex items-center justify-center gap-2 shadow-soft hover:shadow-hover transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>Create New Event</span>
        </motion.button>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h4>New Event Details</h4>

          {/* Customer Name */}
          <div>
            <label className="text-sm mb-2 block">Customer Name</label>
            <input
              type="text"
              placeholder="Enter name"
              value={formData.customerName}
              onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
              className="w-full h-10 px-4 bg-muted/30 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/30 transition-all"
            />
          </div>

          {/* Time Slot */}
          <div>
            <label className="text-sm mb-2 block">Time Slot</label>
            <div className="grid grid-cols-3 gap-2">
              {timeSlots.map(time => (
                <motion.button
                  key={time}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFormData({ ...formData, time })}
                  className={`
                    h-10 rounded-lg border-2 transition-all
                    ${formData.time === time
                      ? 'border-[#6C63FF] bg-[#6C63FF]/10 text-[#6C63FF]'
                      : 'border-border hover:border-[#6C63FF]/30'
                    }
                  `}
                >
                  {time}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Guest Count */}
          <div>
            <label className="text-sm mb-2 block">Guest Count</label>
            <input
              type="number"
              placeholder="Number of guests"
              value={formData.guestCount}
              onChange={(e) => setFormData({ ...formData, guestCount: e.target.value })}
              className="w-full h-10 px-4 bg-muted/30 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/30 transition-all"
            />
          </div>

          {/* Package Selection */}
          <div>
            <label className="text-sm mb-2 block">Package</label>
            <div className="grid grid-cols-3 gap-2">
              {packages.map(pkg => (
                <motion.button
                  key={pkg}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFormData({ ...formData, package: pkg })}
                  className={`
                    h-10 rounded-lg border-2 transition-all
                    ${formData.package === pkg
                      ? 'border-[#6C63FF] bg-[#6C63FF]/10 text-[#6C63FF]'
                      : 'border-border hover:border-[#6C63FF]/30'
                    }
                  `}
                >
                  {pkg}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Add-ons */}
          <div>
            <label className="text-sm mb-2 block">Add-ons</label>
            <div className="space-y-2">
              {['Live Music', 'Photography', 'Decoration', 'Custom Cake'].map(addon => (
                <label key={addon} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-border text-[#6C63FF] focus:ring-[#6C63FF]/30"
                    checked={formData.addOns.includes(addon)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({ ...formData, addOns: [...formData.addOns, addon] });
                      } else {
                        setFormData({ ...formData, addOns: formData.addOns.filter(a => a !== addon) });
                      }
                    }}
                  />
                  <span className="text-sm">{addon}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsCreating(false)}
              className="flex-1 h-10 border border-border rounded-lg hover:bg-muted/50 transition-colors"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 h-10 bg-gradient-to-r from-[#6C63FF] to-[#93E5AB] text-white rounded-lg shadow-soft hover:shadow-hover transition-all"
            >
              Create Event
            </motion.button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
