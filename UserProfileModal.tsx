import { useState } from 'react';
import { X, User, Mail, Award, MapPin, Phone, Save, CheckCircle } from 'lucide-react';
import { UserProfile } from '../types';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
}

export default function UserProfileModal({
  isOpen,
  onClose,
  profile,
  onUpdateProfile
}: UserProfileModalProps) {
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [fullName, setFullName] = useState(profile.address.fullName);
  const [addressLine, setAddressLine] = useState(profile.address.addressLine);
  const [city, setCity] = useState(profile.address.city);
  const [state, setState] = useState(profile.address.state);
  const [zipCode, setZipCode] = useState(profile.address.zipCode);
  const [phone, setPhone] = useState(profile.address.phone);

  const [savedMsg, setSavedMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onUpdateProfile({
      ...profile,
      name,
      email,
      address: {
        fullName,
        addressLine,
        city,
        state,
        zipCode,
        phone
      }
    });

    setSavedMsg('Profile details updated successfully!');
    setTimeout(() => setSavedMsg(''), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 bg-neutral-950/80 backdrop-blur-sm">
      <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white border-b border-neutral-100">
          <h2 className="text-base font-black text-neutral-950 uppercase tracking-wider flex items-center gap-2">
            <User className="w-5 h-5 text-amber-500" /> User Account & Profile
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-500 hover:text-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-6 flex-1">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Save confirmation notification */}
            {savedMsg && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl flex items-center gap-2 animate-pulse">
                <CheckCircle className="w-4 h-4" />
                {savedMsg}
              </div>
            )}

            {/* Top Banner / Loyalty points */}
            <div className="bg-neutral-950 text-white p-6 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-amber-500 text-neutral-950 font-black uppercase text-xl rounded-2xl flex items-center justify-center shadow-inner">
                  {name.charAt(0) || 'U'}
                </div>
                <div>
                  <h3 className="text-base font-black tracking-wide">{name || 'Valued Customer'}</h3>
                  <span className="text-xs text-neutral-400">{email || 'customer@aurastyle.com'}</span>
                </div>
              </div>
              <div className="bg-white/10 border border-white/20 px-4 py-3 rounded-2xl flex items-center gap-3 self-start sm:self-auto">
                <Award className="w-8 h-8 text-amber-400" />
                <div>
                  <span className="block text-[9px] font-bold text-neutral-300 uppercase tracking-wider">Loyalty Level</span>
                  <span className="block text-sm font-black text-amber-400 font-mono">
                    {profile.loyaltyPoints} pts
                  </span>
                </div>
              </div>
            </div>

            {/* Form fields: Personal info */}
            <div className="space-y-4">
              <h4 className="text-xs font-black text-neutral-900 uppercase tracking-wider border-b border-neutral-100 pb-1.5">
                Account Details
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-neutral-600 uppercase flex items-center gap-1">
                    <User className="w-3 h-3 text-neutral-400" /> Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-neutral-900"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-neutral-600 uppercase flex items-center gap-1">
                    <Mail className="w-3 h-3 text-neutral-400" /> Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-neutral-900"
                  />
                </div>
              </div>
            </div>

            {/* Default Shipping Details */}
            <div className="space-y-4">
              <h4 className="text-xs font-black text-neutral-900 uppercase tracking-wider border-b border-neutral-100 pb-1.5">
                Default Shipping Address
              </h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Receiver Name */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="block text-[10px] font-black text-neutral-600 uppercase">
                    Recipient Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-neutral-900"
                  />
                </div>

                {/* Address */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="block text-[10px] font-black text-neutral-600 uppercase flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-neutral-400" /> Street Address
                  </label>
                  <input
                    type="text"
                    required
                    value={addressLine}
                    onChange={(e) => setAddressLine(e.target.value)}
                    className="w-full px-3.5 py-2 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-neutral-900"
                  />
                </div>

                {/* City */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-neutral-600 uppercase">
                    City
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-neutral-900"
                  />
                </div>

                {/* State, Zip */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-black text-neutral-600 uppercase">State</label>
                    <input
                      type="text"
                      required
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-neutral-900"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-black text-neutral-600 uppercase">Zip Code</label>
                    <input
                      type="text"
                      required
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-neutral-900"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="block text-[10px] font-black text-neutral-600 uppercase flex items-center gap-1">
                    <Phone className="w-3 h-3 text-neutral-400" /> Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-neutral-900"
                  />
                </div>
              </div>
            </div>

            {/* Submit button */}
            <div className="flex justify-end gap-2.5 pt-4 border-t border-neutral-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-neutral-50 hover:bg-neutral-100 text-neutral-700 rounded-xl text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-neutral-950 hover:bg-amber-500 hover:text-neutral-950 text-white text-xs font-extrabold uppercase tracking-wider rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Save className="w-4 h-4" />
                Save Profile Changes
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}
