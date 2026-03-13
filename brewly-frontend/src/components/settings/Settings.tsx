import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
    Store,
    Save,
    CheckCircle2,
    Lock,
    Mail,
    Phone,
    MapPin,
    Moon,
    Sun,
    Eye,
    EyeOff,
    Pencil,
    Check,
    X,
    ShieldCheck,
    Palette,
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export default function Settings() {
    const { settings, updateSettings } = useSettings();
    const [isSaving, setIsSaving] = useState(false);
    const [showSavedToast, setShowSavedToast] = useState(false);
    const [editingField, setEditingField] = useState<string | null>(null);
    const [editValue, setEditValue] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrentPw, setShowCurrentPw] = useState(false);
    const [showNewPw, setShowNewPw] = useState(false);
    const [showConfirmPw, setShowConfirmPw] = useState(false);
    const [passwordMsg, setPasswordMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            setShowSavedToast(true);
            setTimeout(() => setShowSavedToast(false), 3000);
        }, 1000);
    };

    const startEdit = (field: string, value: string) => {
        setEditingField(field);
        setEditValue(value);
    };

    const saveEdit = (field: string) => {
        updateSettings({ [field]: editValue });
        setEditingField(null);
        setEditValue('');
    };

    const cancelEdit = () => {
        setEditingField(null);
        setEditValue('');
    };

    const handlePasswordChange = () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            setPasswordMsg({ text: 'Please fill in all fields', type: 'error' });
            return;
        }
        if (newPassword.length < 6) {
            setPasswordMsg({ text: 'Password must be at least 6 characters', type: 'error' });
            return;
        }
        if (newPassword !== confirmPassword) {
            setPasswordMsg({ text: 'New passwords do not match', type: 'error' });
            return;
        }
        setPasswordMsg({ text: 'Password updated successfully!', type: 'success' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => setPasswordMsg(null), 3000);
    };

    const profileFields = [
        { key: 'storeName', label: 'Store Name', icon: Store, value: settings.storeName },
        { key: 'email', label: 'Email', icon: Mail, value: settings.email },
        { key: 'phoneNumber', label: 'Contact Number', icon: Phone, value: settings.phoneNumber },
        { key: 'storeAddress', label: 'Address', icon: MapPin, value: settings.storeAddress },
    ];

    return (
        <div style={{ minHeight: 'calc(100vh - 80px)', background: settings.theme === 'dark' ? '#0F172A' : '#F8FAFC', position: 'relative', overflow: 'hidden' }}>
            {/* Ambient Background Glows */}
            <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '40%', height: '40%', background: 'rgba(180, 134, 101, 0.08)', filter: 'blur(120px)', borderRadius: '50%', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '40%', height: '40%', background: 'rgba(212, 165, 116, 0.08)', filter: 'blur(120px)', borderRadius: '50%', pointerEvents: 'none' }} />

            <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px', position: 'relative', zIndex: 10 }}>
                {/* Header */}
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '36px' }}
                >
                    <div>
                        <h1 style={{ fontSize: '2rem', fontWeight: 900, background: 'linear-gradient(135deg, #B48665, #D4A574)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}>
                            Settings
                        </h1>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.04, y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={handleSave}
                        disabled={isSaving}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '10px',
                            padding: '12px 28px', borderRadius: '16px', border: 'none', cursor: 'pointer',
                            background: 'linear-gradient(135deg, #B48665, #6A4334)', color: '#fff',
                            fontWeight: 700, fontSize: '0.9rem', boxShadow: '0 8px 30px rgba(180, 134, 101, 0.3)',
                            opacity: isSaving ? 0.7 : 1,
                        }}
                    >
                        {isSaving ? (
                            <div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                        ) : (
                            <Save style={{ width: 18, height: 18, color: '#fff' }} />
                        )}
                        <span style={{ color: '#fff' }}>Save Changes</span>
                    </motion.button>
                </motion.div>

                {/* ===== TOP ROW: PROFILE + PASSWORD ===== */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                    {/* ===== PROFILE CARD ===== */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        style={{
                            background: settings.theme === 'dark'
                                ? 'linear-gradient(135deg, #1e293b, #0f172a)'
                                : 'linear-gradient(135deg, #ffffff, #f8fafc)',
                            borderRadius: '28px',
                            border: settings.theme === 'dark' ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)',
                            boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
                            overflow: 'hidden',
                        }}
                    >
                        {/* Profile Header Banner */}
                        <div style={{
                            background: 'linear-gradient(135deg, #B48665, #6A4334, #65350E)',
                            padding: '32px 36px 28px',
                            position: 'relative',
                            overflow: 'hidden',
                        }}>
                            {/* Decorative circles */}
                            <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
                            <div style={{ position: 'absolute', bottom: -20, left: '40%', width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />

                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', position: 'relative', zIndex: 2 }}>
                                {/* Store Avatar */}
                                <div style={{
                                    width: 72, height: 72, borderRadius: '22px',
                                    background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    border: '2px solid rgba(255,255,255,0.2)',
                                    flexShrink: 0,
                                }}>
                                    <Store style={{ width: 36, height: 36, color: '#fff' }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h2 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
                                        {settings.storeName || 'Your Store'}
                                    </h2>
                                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', margin: '4px 0 0', fontWeight: 500 }}>
                                        Store Profile
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Profile Fields */}
                        <div style={{ padding: '8px 12px 12px' }}>
                            {profileFields.map((field, index) => {
                                const Icon = field.icon;
                                const isEditing = editingField === field.key;

                                return (
                                    <motion.div
                                        key={field.key}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.15 + index * 0.05 }}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: '16px',
                                            padding: '18px 24px',
                                            borderRadius: '16px',
                                            background: isEditing
                                                ? (settings.theme === 'dark' ? 'rgba(180, 134, 101, 0.08)' : 'rgba(180, 134, 101, 0.04)')
                                                : 'transparent',
                                            transition: 'all 0.2s ease',
                                            borderBottom: index < profileFields.length - 1
                                                ? (settings.theme === 'dark' ? '1px solid rgba(255,255,255,0.04)' : '1px solid rgba(0,0,0,0.04)')
                                                : 'none',
                                        }}
                                        onMouseEnter={(e) => { if (!isEditing) e.currentTarget.style.background = settings.theme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'; }}
                                        onMouseLeave={(e) => { if (!isEditing) e.currentTarget.style.background = 'transparent'; }}
                                    >
                                        {/* Icon */}
                                        <div style={{
                                            width: 44, height: 44, borderRadius: '14px',
                                            background: settings.theme === 'dark' ? 'rgba(180, 134, 101, 0.12)' : 'rgba(180, 134, 101, 0.08)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            flexShrink: 0,
                                        }}>
                                            <Icon style={{ width: 20, height: 20, color: '#B48665' }} />
                                        </div>

                                        {/* Label & Value */}
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <p style={{
                                                fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase',
                                                letterSpacing: '0.08em', margin: '0 0 3px',
                                                color: settings.theme === 'dark' ? '#64748b' : '#94a3b8',
                                            }}>
                                                {field.label}
                                            </p>
                                            {isEditing ? (
                                                <input
                                                    autoFocus
                                                    type={field.key === 'email' ? 'email' : 'text'}
                                                    value={editValue}
                                                    onChange={(e) => setEditValue(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') saveEdit(field.key);
                                                        if (e.key === 'Escape') cancelEdit();
                                                    }}
                                                    style={{
                                                        width: '100%', padding: '8px 14px', fontSize: '0.95rem', fontWeight: 600,
                                                        background: settings.theme === 'dark' ? '#1e293b' : '#fff',
                                                        color: settings.theme === 'dark' ? '#f1f5f9' : '#1e293b',
                                                        border: '2px solid #B48665', borderRadius: '12px', outline: 'none',
                                                    }}
                                                />
                                            ) : (
                                                <p style={{
                                                    fontSize: '0.95rem', fontWeight: 600, margin: 0,
                                                    color: settings.theme === 'dark' ? '#e2e8f0' : '#1e293b',
                                                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                                }}>
                                                    {field.value || '—'}
                                                </p>
                                            )}
                                        </div>

                                        {/* Edit / Save / Cancel Buttons */}
                                        {field.key === 'email' ? (
                                            <div style={{
                                                padding: '4px 10px', borderRadius: '8px', flexShrink: 0,
                                                background: settings.theme === 'dark' ? 'rgba(100, 116, 139, 0.15)' : 'rgba(148, 163, 184, 0.12)',
                                            }}>
                                                <Lock style={{ width: 14, height: 14, color: settings.theme === 'dark' ? '#475569' : '#94a3b8' }} />
                                            </div>
                                        ) : isEditing ? (
                                            <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => saveEdit(field.key)}
                                                    style={{
                                                        width: 36, height: 36, borderRadius: '10px', border: 'none', cursor: 'pointer',
                                                        background: '#B48665', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    }}
                                                >
                                                    <Check style={{ width: 16, height: 16, color: '#fff' }} />
                                                </motion.button>
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={cancelEdit}
                                                    style={{
                                                        width: 36, height: 36, borderRadius: '10px', border: 'none', cursor: 'pointer',
                                                        background: settings.theme === 'dark' ? '#334155' : '#e2e8f0',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    }}
                                                >
                                                    <X style={{ width: 16, height: 16, color: settings.theme === 'dark' ? '#94a3b8' : '#64748b' }} />
                                                </motion.button>
                                            </div>
                                        ) : (
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => startEdit(field.key, field.value)}
                                                style={{
                                                    width: 36, height: 36, borderRadius: '10px', border: 'none', cursor: 'pointer',
                                                    background: 'transparent',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    flexShrink: 0,
                                                }}
                                            >
                                                <Pencil style={{ width: 16, height: 16, color: settings.theme === 'dark' ? '#475569' : '#cbd5e1' }} />
                                            </motion.button>
                                        )}
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>

                    {/* Password Change Card (top right, next to profile) */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        style={{
                            background: settings.theme === 'dark'
                                ? 'linear-gradient(135deg, #1e293b, #0f172a)'
                                : 'linear-gradient(135deg, #ffffff, #f8fafc)',
                            borderRadius: '24px',
                            border: settings.theme === 'dark' ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)',
                            boxShadow: '0 12px 40px rgba(0,0,0,0.06)',
                            padding: '28px',
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
                            <div style={{
                                width: 44, height: 44, borderRadius: '14px',
                                background: 'linear-gradient(135deg, #F59E0B, #EF4444)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <ShieldCheck style={{ width: 22, height: 22, color: '#fff' }} />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: settings.theme === 'dark' ? '#f1f5f9' : '#1e293b' }}>
                                    Password
                                </h3>
                                <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: '2px 0 0', fontWeight: 500 }}>
                                    Update your credentials
                                </p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {/* Current Password */}
                            <div style={{ position: 'relative' }}>
                                <label style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
                                    Current Password
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type={showCurrentPw ? 'text' : 'password'}
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        placeholder="Enter current password"
                                        style={{
                                            width: '100%', padding: '12px 44px 12px 16px', fontSize: '0.9rem', fontWeight: 600,
                                            background: settings.theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                                            color: settings.theme === 'dark' ? '#e2e8f0' : '#1e293b',
                                            border: settings.theme === 'dark' ? '1.5px solid rgba(255,255,255,0.08)' : '1.5px solid rgba(0,0,0,0.06)',
                                            borderRadius: '12px', outline: 'none', boxSizing: 'border-box',
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowCurrentPw(!showCurrentPw)}
                                        style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                                    >
                                        {showCurrentPw
                                            ? <EyeOff style={{ width: 16, height: 16, color: '#94a3b8' }} />
                                            : <Eye style={{ width: 16, height: 16, color: '#94a3b8' }} />
                                        }
                                    </button>
                                </div>
                            </div>

                            {/* New Password */}
                            <div>
                                <label style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
                                    New Password
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type={showNewPw ? 'text' : 'password'}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="Enter new password"
                                        style={{
                                            width: '100%', padding: '12px 44px 12px 16px', fontSize: '0.9rem', fontWeight: 600,
                                            background: settings.theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                                            color: settings.theme === 'dark' ? '#e2e8f0' : '#1e293b',
                                            border: settings.theme === 'dark' ? '1.5px solid rgba(255,255,255,0.08)' : '1.5px solid rgba(0,0,0,0.06)',
                                            borderRadius: '12px', outline: 'none', boxSizing: 'border-box',
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPw(!showNewPw)}
                                        style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                                    >
                                        {showNewPw
                                            ? <EyeOff style={{ width: 16, height: 16, color: '#94a3b8' }} />
                                            : <Eye style={{ width: 16, height: 16, color: '#94a3b8' }} />
                                        }
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
                                    Confirm Password
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type={showConfirmPw ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Confirm new password"
                                        style={{
                                            width: '100%', padding: '12px 44px 12px 16px', fontSize: '0.9rem', fontWeight: 600,
                                            background: settings.theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                                            color: settings.theme === 'dark' ? '#e2e8f0' : '#1e293b',
                                            border: settings.theme === 'dark' ? '1.5px solid rgba(255,255,255,0.08)' : '1.5px solid rgba(0,0,0,0.06)',
                                            borderRadius: '12px', outline: 'none', boxSizing: 'border-box',
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPw(!showConfirmPw)}
                                        style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                                    >
                                        {showConfirmPw
                                            ? <EyeOff style={{ width: 16, height: 16, color: '#94a3b8' }} />
                                            : <Eye style={{ width: 16, height: 16, color: '#94a3b8' }} />
                                        }
                                    </button>
                                </div>
                            </div>

                            {/* Password Message */}
                            <AnimatePresence>
                                {passwordMsg && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        style={{
                                            padding: '10px 14px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 600,
                                            background: passwordMsg.type === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                            color: passwordMsg.type === 'success' ? '#22c55e' : '#ef4444',
                                            border: passwordMsg.type === 'success' ? '1px solid rgba(34, 197, 94, 0.2)' : '1px solid rgba(239, 68, 68, 0.2)',
                                        }}
                                    >
                                        {passwordMsg.text}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Update Button */}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={handlePasswordChange}
                                style={{
                                    width: '100%', padding: '13px', borderRadius: '12px', border: 'none', cursor: 'pointer',
                                    background: 'linear-gradient(135deg, #1e293b, #0f172a)',
                                    color: '#fff', fontWeight: 700, fontSize: '0.88rem',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                    marginTop: '4px',
                                }}
                            >
                                <Lock style={{ width: 16, height: 16, color: '#fff' }} />
                                <span style={{ color: '#fff' }}>Update Password</span>
                            </motion.button>
                        </div>
                    </motion.div>
                </div>

                {/* ===== APPEARANCE CARD — Below profile ===== */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginTop: '24px' }}>
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        style={{
                            background: settings.theme === 'dark'
                                ? 'linear-gradient(135deg, #1e293b, #0f172a)'
                                : 'linear-gradient(135deg, #ffffff, #f8fafc)',
                            borderRadius: '24px',
                            border: settings.theme === 'dark' ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)',
                            boxShadow: '0 12px 40px rgba(0,0,0,0.06)',
                            padding: '28px',
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
                            <div style={{
                                width: 44, height: 44, borderRadius: '14px',
                                background: 'linear-gradient(135deg, #EC4899, #F472B6)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <Palette style={{ width: 22, height: 22, color: '#fff' }} />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: settings.theme === 'dark' ? '#f1f5f9' : '#1e293b' }}>
                                    Appearance
                                </h3>
                                <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: '2px 0 0', fontWeight: 500 }}>
                                    Choose your theme
                                </p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {/* Light Theme Option */}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => updateSettings({ theme: 'light' })}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '14px',
                                    padding: '18px 20px', borderRadius: '16px', cursor: 'pointer',
                                    textAlign: 'left', width: '100%',
                                    background: settings.theme === 'light'
                                        ? 'linear-gradient(135deg, rgba(180, 134, 101, 0.08), rgba(180, 134, 101, 0.04))'
                                        : (settings.theme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'),
                                    border: settings.theme === 'light'
                                        ? '2px solid #B48665'
                                        : (settings.theme === 'dark' ? '2px solid rgba(255,255,255,0.06)' : '2px solid rgba(0,0,0,0.04)'),
                                    transition: 'all 0.2s ease',
                                }}
                            >
                                <div style={{
                                    width: 44, height: 44, borderRadius: '14px',
                                    background: settings.theme === 'light' ? '#B48665' : (settings.theme === 'dark' ? '#334155' : '#e2e8f0'),
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    flexShrink: 0,
                                }}>
                                    <Sun style={{ width: 22, height: 22, color: settings.theme === 'light' ? '#fff' : '#94a3b8' }} />
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: settings.theme === 'dark' ? '#e2e8f0' : '#1e293b' }}>
                                        Light Mode
                                    </p>
                                    <p style={{ fontSize: '0.75rem', fontWeight: 500, margin: '2px 0 0', color: '#94a3b8' }}>
                                        Clean & bright interface
                                    </p>
                                </div>
                                {settings.theme === 'light' && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        style={{ marginLeft: 'auto', width: 24, height: 24, borderRadius: '50%', background: '#B48665', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                    >
                                        <Check style={{ width: 14, height: 14, color: '#fff' }} />
                                    </motion.div>
                                )}
                            </motion.button>

                            {/* Dark Theme Option */}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => updateSettings({ theme: 'dark' })}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '14px',
                                    padding: '18px 20px', borderRadius: '16px', cursor: 'pointer',
                                    textAlign: 'left', width: '100%',
                                    background: settings.theme === 'dark'
                                        ? 'linear-gradient(135deg, rgba(180, 134, 101, 0.08), rgba(180, 134, 101, 0.04))'
                                        : 'rgba(0,0,0,0.02)',
                                    border: settings.theme === 'dark'
                                        ? '2px solid #B48665'
                                        : '2px solid rgba(0,0,0,0.04)',
                                    transition: 'all 0.2s ease',
                                }}
                            >
                                <div style={{
                                    width: 44, height: 44, borderRadius: '14px',
                                    background: settings.theme === 'dark' ? '#B48665' : '#e2e8f0',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    flexShrink: 0,
                                }}>
                                    <Moon style={{ width: 22, height: 22, color: settings.theme === 'dark' ? '#fff' : '#94a3b8' }} />
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: settings.theme === 'dark' ? '#e2e8f0' : '#1e293b' }}>
                                        Dark Mode
                                    </p>
                                    <p style={{ fontSize: '0.75rem', fontWeight: 500, margin: '2px 0 0', color: '#94a3b8' }}>
                                        Easy on the eyes
                                    </p>
                                </div>
                                {settings.theme === 'dark' && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        style={{ marginLeft: 'auto', width: 24, height: 24, borderRadius: '50%', background: '#B48665', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                    >
                                        <Check style={{ width: 14, height: 14, color: '#fff' }} />
                                    </motion.div>
                                )}
                            </motion.button>
                        </div>
                    </motion.div>
                </div>

                {/* Footer Padding */}
                <div style={{ height: '60px' }} />
            </div>

            {/* Success Toast */}
            <AnimatePresence>
                {showSavedToast && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        style={{
                            position: 'fixed', bottom: 40, left: '50%', transform: 'translateX(-50%)', zIndex: 100,
                        }}
                    >
                        <div style={{
                            background: '#0f172a', color: '#fff', padding: '14px 28px', borderRadius: '20px',
                            boxShadow: '0 20px 60px rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', gap: '12px',
                            border: '1px solid rgba(255,255,255,0.08)',
                        }}>
                            <div style={{
                                width: 32, height: 32, borderRadius: '50%', background: '#D4A574',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <CheckCircle2 style={{ width: 18, height: 18, color: '#0f172a' }} />
                            </div>
                            <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#fff' }}>Settings saved successfully</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
