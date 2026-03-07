import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'motion/react';
import { X, Clock, Users, Package, Plus, Check, Armchair, Pencil, Trash2 } from 'lucide-react';
import type { Event } from './EventBooking';

import { createEvent, updateEvent, deleteEvent } from '../../services/eventService';
import { getTablesForDate, TableWithReservation } from '../../services/tableService';

interface EventSidebarProps {
  selectedDate: Date;
  events: Event[];
  onClose: () => void;
  onEventCreated: () => void;
}

const packages = ['Silver', 'Gold', 'Platinum'];
const eventTypes = ['birthday', 'corporate', 'family', 'anniversary'] as const;
const timeSlots = ['10:00', '12:00', '14:00', '16:00', '18:00', '20:00'];

export default function EventSidebar({ selectedDate, events, onClose, onEventCreated }: EventSidebarProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Event | null>(null);
  const [timeConflictMsg, setTimeConflictMsg] = useState('');
  const [allTables, setAllTables] = useState<TableWithReservation[]>([]);
  const [formData, setFormData] = useState({
    customerName: '',
    eventType: 'corporate' as string,
    time: '',
    guestCount: '',
    package: 'Gold',
    addOns: [] as string[],
    selectedTables: [] as number[],
  });

  useEffect(() => {
    if (isCreating || editingEvent) {
      fetchAllTables();
    }
  }, [isCreating, editingEvent]);

  // Refetch tables when time changes so overlap check uses the selected time
  useEffect(() => {
    if ((isCreating || editingEvent) && formData.time) {
      fetchAllTables();
    }
  }, [formData.time]);

  const fetchAllTables = async () => {
    const dateStr = selectedDate.getFullYear() + '-' +
      String(selectedDate.getMonth() + 1).padStart(2, '0') + '-' +
      String(selectedDate.getDate()).padStart(2, '0');
    const tables = await getTablesForDate(dateStr, formData.time || undefined);
    setAllTables(tables);
  };

  const freeTables = allTables.filter(t => t.status === 'FREE');
  const reservedTables = allTables.filter(t => t.status === 'RESERVED');

  const autoSuggestTables = () => {
    const guestCount = Number(formData.guestCount);
    if (!guestCount || freeTables.length === 0) return;

    const sorted = [...freeTables].sort((a, b) => b.seats - a.seats);
    const selected: number[] = [];
    let remaining = guestCount;

    for (const table of sorted) {
      if (remaining <= 0) break;
      selected.push(table.id);
      remaining -= table.seats;
    }

    setFormData(prev => ({ ...prev, selectedTables: selected }));
  };

  const selectedSeats = freeTables
    .filter(t => formData.selectedTables.includes(t.id))
    .reduce((sum, t) => sum + t.seats, 0);

  const resetForm = () => {
    setFormData({
      customerName: '',
      eventType: 'corporate',
      time: '',
      guestCount: '',
      package: 'Gold',
      addOns: [],
      selectedTables: [],
    });
    setTimeConflictMsg('');
  };

  const startEditing = (event: Event) => {
    setIsCreating(false);
    setEditingEvent(event);
    setTimeConflictMsg('');
    setFormData({
      customerName: event.title,
      eventType: event.type || 'corporate',
      time: event.time,
      guestCount: String(event.guestCount),
      package: (event as any).package || (event as any).packageType || 'Gold',
      addOns: [],
      selectedTables: [],
    });
  };

  const handleCreate = async () => {
    setTimeConflictMsg('');
    try {
      await createEvent({
        title: formData.customerName,
        date: selectedDate,
        type: formData.eventType,
        guestCount: Number(formData.guestCount),
        time: formData.time,
        packageType: formData.package,
        tableIds: formData.selectedTables
      });
      setIsCreating(false);
      resetForm();
      onEventCreated();
    } catch (e: any) {
      const msg = e?.response?.data?.error;
      if (msg && msg.includes('already scheduled')) {
        setTimeConflictMsg(msg);
      } else {
        console.error(e);
        alert("Failed to create event");
      }
    }
  };

  const handleUpdate = async () => {
    if (!editingEvent) return;
    setTimeConflictMsg('');
    try {
      await updateEvent(editingEvent.id, {
        title: formData.customerName,
        date: selectedDate,
        type: formData.eventType,
        guestCount: Number(formData.guestCount),
        time: formData.time,
        packageType: formData.package,
        tableIds: formData.selectedTables
      });
      setEditingEvent(null);
      resetForm();
      onEventCreated();
    } catch (e: any) {
      const msg = e?.response?.data?.error;
      if (msg && msg.includes('already scheduled')) {
        setTimeConflictMsg(msg);
      } else {
        console.error(e);
        alert("Failed to update event");
      }
    }
  };

  const handleDelete = async (event: Event) => {
    try {
      await deleteEvent(event.id);
      setDeleteConfirm(null);
      onEventCreated();
    } catch (e) {
      console.error(e);
      alert("Failed to delete event");
    }
  };

  const toggleTable = (id: number) => {
    setFormData(prev => ({
      ...prev,
      selectedTables: prev.selectedTables.includes(id)
        ? prev.selectedTables.filter(tId => tId !== id)
        : [...prev.selectedTables, id]
    }));
  };

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
      className="w-96 bg-card rounded-2xl border border-border shadow-soft-lg p-6 max-h-[calc(100vh-200px)] overflow-y-auto"
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
                className={`p-4 rounded-xl bg-gradient-to-br ${colors[event.type as keyof typeof colors || 'corporate']} bg-opacity-10 border border-border`}
              >
                <div className="flex items-start justify-between mb-2">
                  <p>{event.title}</p>
                  <div className="flex gap-1">
                    <button
                      onClick={() => startEditing(event)}
                      className="w-7 h-7 rounded-md hover:bg-black/10 flex items-center justify-center transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(event)}
                      className="w-7 h-7 rounded-md hover:bg-red-500/20 flex items-center justify-center transition-colors text-red-500"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
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
      {!isCreating && !editingEvent ? (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => { resetForm(); setIsCreating(true); }}
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
          <h4>{editingEvent ? 'Edit Event' : 'New Event Details'}</h4>

          {/* Time Conflict Warning */}
          {timeConflictMsg && (
            <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-500 text-xs">
              {timeConflictMsg}
            </div>
          )}

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

          {/* Event Type */}
          <div>
            <label className="text-sm mb-2 block">Event Type</label>
            <div className="grid grid-cols-2 gap-2">
              {eventTypes.map(type => (
                <motion.button
                  key={type}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFormData({ ...formData, eventType: type })}
                  className={`
                    h-10 rounded-lg border-2 transition-all capitalize
                    ${formData.eventType === type
                      ? 'border-[#6C63FF] bg-[#6C63FF]/10 text-[#6C63FF]'
                      : 'border-border hover:border-[#6C63FF]/30'
                    }
                  `}
                >
                  {type}
                </motion.button>
              ))}
            </div>
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
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs text-muted-foreground">or</span>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="flex-1 h-9 px-3 bg-muted/30 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/30 transition-all"
              />
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

          {/* Table Selection */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm">Reserve Tables</label>
              {Number(formData.guestCount) > 0 && freeTables.length > 0 && (
                <button
                  onClick={autoSuggestTables}
                  className="text-xs text-[#6C63FF] hover:underline"
                >
                  Auto-suggest
                </button>
              )}
            </div>
            {allTables.length === 0 ? (
              <p className="text-xs text-muted-foreground">No tables found.</p>
            ) : (
              <>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {/* Free tables - selectable */}
                  {freeTables.map(table => (
                    <div
                      key={table.id}
                      onClick={() => toggleTable(table.id)}
                      className={`flex items-center justify-between p-2 rounded-lg border cursor-pointer transition-all ${formData.selectedTables.includes(table.id)
                          ? 'border-[#6C63FF] bg-[#6C63FF]/5'
                          : 'border-border hover:bg-muted'
                        }`}
                    >
                      <div className="flex items-center gap-2 text-sm">
                        <Armchair className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Table {table.tableNumber}</p>
                          <p className="text-xs text-muted-foreground">{table.seats} seats</p>
                        </div>
                      </div>
                      {formData.selectedTables.includes(table.id) && (
                        <div className="w-5 h-5 bg-[#6C63FF] rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                  ))}
                  {/* Reserved tables - dimmed */}
                  {reservedTables.map(table => (
                    <div
                      key={table.id}
                      className="flex items-center justify-between p-2 rounded-lg border border-border opacity-40 cursor-not-allowed"
                    >
                      <div className="flex items-center gap-2 text-sm">
                        <Armchair className="w-4 h-4 text-[#FFD66C]" />
                        <div>
                          <p className="font-medium">Table {table.tableNumber}</p>
                          <p className="text-xs text-[#FFD66C]">
                            Reserved for {table.reservedForEvent || 'event'} &middot; {table.reservedForDate || ''}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-2 text-xs text-muted-foreground flex justify-between">
                  <span>{formData.selectedTables.length} table(s) selected</span>
                  <span className={selectedSeats < Number(formData.guestCount || 0) ? 'text-red-500' : 'text-green-500'}>
                    {selectedSeats} / {formData.guestCount || 0} seats
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { setIsCreating(false); setEditingEvent(null); resetForm(); }}
              className="flex-1 h-10 border border-border rounded-lg hover:bg-muted/50 transition-colors"
            >
              Cancel
            </motion.button>
            <motion.button
              onClick={editingEvent ? handleUpdate : handleCreate}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 h-10 bg-gradient-to-r from-[#6C63FF] to-[#93E5AB] text-white rounded-lg shadow-soft hover:shadow-hover transition-all"
            >
              {editingEvent ? 'Update Event' : 'Create Event'}
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirm && createPortal(
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 9999
        }}>
          <div style={{
            backgroundColor: 'white', borderRadius: '16px', padding: '24px',
            width: '360px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
          }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>Delete Event</h3>
            <p style={{ margin: '0 0 20px 0', color: '#666', fontSize: '14px' }}>
              Are you sure you want to delete <strong>{deleteConfirm.title}</strong>? This will free all reserved tables and vendors.
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setDeleteConfirm(null)}
                style={{
                  flex: 1, height: '40px', border: '1px solid #e0e0e0',
                  borderRadius: '8px', background: 'white', cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                style={{
                  flex: 1, height: '40px', border: 'none', borderRadius: '8px',
                  background: '#ef4444', color: 'white', cursor: 'pointer'
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </motion.div>
  );
}



