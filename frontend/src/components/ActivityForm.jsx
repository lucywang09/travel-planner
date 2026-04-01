import { useState } from 'react';
import { PlusIcon, SparklesIcon } from '@heroicons/react/24/outline';

const EMPTY = { title: '', activityDate: '', notes: '' };

export default function ActivityForm({ tripId, onAdd, loading }) {
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim())    return setError('Enter an activity title.');
    if (!form.activityDate)    return setError('Select a date for this activity.');

    const ok = await onAdd(tripId, form);
    if (ok) setForm(EMPTY);
  };

  return (
    <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <SparklesIcon className="w-3.5 h-3.5 text-slate-600" />
        <h3 className="text-[11px] font-semibold text-slate-600 uppercase tracking-widest">
          Add Activity
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-2.5">
        <input
          type="text"
          name="title"
          placeholder="Activity title (e.g. Visit Senso-ji Temple)"
          value={form.title}
          onChange={handleChange}
          className="input-field"
          maxLength={255}
          autoComplete="off"
        />

        <input
          type="date"
          name="activityDate"
          value={form.activityDate}
          onChange={handleChange}
          className="input-field"
        />

        <textarea
          name="notes"
          placeholder="Notes (optional) — tips, booking links, reminders…"
          value={form.notes}
          onChange={handleChange}
          rows={2}
          className="input-field resize-none"
          maxLength={1000}
        />

        {error && (
          <p className="text-xs text-red-400 font-medium">{error}</p>
        )}

        <button type="submit" className="btn-primary" disabled={loading}>
          <PlusIcon className="w-4 h-4" />
          {loading ? 'Adding…' : 'Add Activity'}
        </button>
      </form>
    </div>
  );
}
