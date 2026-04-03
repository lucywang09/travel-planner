import { useState } from 'react';
import { PlusIcon, MapPinIcon } from '@heroicons/react/24/outline';

const EMPTY = { destination: '', startDate: '', endDate: '' };

export default function TripForm({ onAdd, loading }) {
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.destination.trim()) return setError('Enter a destination.');
    if (!form.startDate)          return setError('Select a start date.');
    if (!form.endDate)            return setError('Select an end date.');
    if (form.startDate > form.endDate)
      return setError('End date must be after start date.');

    const ok = await onAdd(form);
    if (ok) setForm(EMPTY);
  };

  return (
    <div className="card p-5">
      {/* Section header */}
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/20 flex items-center justify-center">
          <MapPinIcon className="w-3.5 h-3.5 text-amber-400" />
        </div>
        <h2 className="text-sm font-semibold text-slate-200">Plan a new trip</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          name="destination"
          placeholder="Where are you going? (e.g. Tokyo, Japan)"
          value={form.destination}
          onChange={handleChange}
          className="input-field"
          maxLength={255}
          autoComplete="off"
        />

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
              Start
            </label>
            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
              End
            </label>
            <input
              type="date"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
              className="input-field"
            />
          </div>
        </div>

        {error && (
          <p className="text-xs text-red-400 font-medium flex items-center gap-1.5">
            <span className="inline-block w-1 h-1 rounded-full bg-red-400 flex-shrink-0" />
            {error}
          </p>
        )}

        <button type="submit" className="btn-primary w-full justify-center" disabled={loading}>
          <PlusIcon className="w-4 h-4" />
          {loading ? 'Creating…' : 'Create Trip'}
        </button>
      </form>
    </div>
  );
}
