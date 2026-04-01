import { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import TripForm from './components/TripForm';
import TripList from './components/TripList';
import ActivityForm from './components/ActivityForm';
import ActivityList from './components/ActivityList';
import { tripsApi, activitiesApi } from './api/api';
import {
  GlobeAltIcon,
  ExclamationCircleIcon,
  ArrowLeftIcon,
  CalendarDaysIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmtLong = (str) => {
  if (!str) return '';
  const [y, m, d] = str.split('T')[0].split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  });
};

const tripDays = (start, end) => {
  if (!start || !end) return null;
  const [sy, sm, sd] = start.split('T')[0].split('-').map(Number);
  const [ey, em, ed] = end.split('T')[0].split('-').map(Number);
  const days = Math.round(
    (new Date(ey, em - 1, ed) - new Date(sy, sm - 1, sd)) / 86_400_000
  ) + 1;
  return `${days} day${days !== 1 ? 's' : ''}`;
};

/** Deterministic Picsum cover photo from destination name */
const getDestinationImage = (destination, w = 1200, h = 480) => {
  const seed = destination.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  return `https://picsum.photos/seed/${seed}/${w}/${h}`;
};

/** Count trips whose start date is today or in the future */
const countUpcoming = (trips) =>
  trips.filter((t) => {
    if (!t.startDate) return false;
    const d = t.startDate.split('T')[0];
    return d >= new Date().toISOString().split('T')[0];
  }).length;

// ─── Component ────────────────────────────────────────────────────────────────

export default function App() {
  const [trips, setTrips]                       = useState([]);
  const [selectedTrip, setSelectedTrip]         = useState(null);
  const [activities, setActivities]             = useState([]);

  const [tripsLoading, setTripsLoading]         = useState(true);
  const [activitiesLoading, setActivitiesLoading] = useState(false);
  const [tripFormLoading, setTripFormLoading]   = useState(false);
  const [actFormLoading, setActFormLoading]     = useState(false);

  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 4500);
  };

  // ── Fetch trips on mount ────────────────────────────────────────────────────
  const fetchTrips = useCallback(async () => {
    try {
      setTripsLoading(true);
      const res = await tripsApi.getAll();
      setTrips(res.data);
    } catch (err) {
      showToast(err.message);
    } finally {
      setTripsLoading(false);
    }
  }, []);

  // ── Fetch activities when trip changes ──────────────────────────────────────
  const fetchActivities = useCallback(async (tripId) => {
    try {
      setActivitiesLoading(true);
      const res = await activitiesApi.getByTrip(tripId);
      setActivities(res.data);
    } catch (err) {
      showToast(err.message);
    } finally {
      setActivitiesLoading(false);
    }
  }, []);

  useEffect(() => { fetchTrips(); }, [fetchTrips]);

  useEffect(() => {
    if (selectedTrip) {
      fetchActivities(selectedTrip.id);
    } else {
      setActivities([]);
    }
  }, [selectedTrip, fetchActivities]);

  // ── Trip handlers ───────────────────────────────────────────────────────────
  const handleAddTrip = async (formData) => {
    try {
      setTripFormLoading(true);
      const res = await tripsApi.create(formData);
      setTrips((prev) => [res.data, ...prev]);
      return true;
    } catch (err) {
      showToast(err.message);
      return false;
    } finally {
      setTripFormLoading(false);
    }
  };

  const handleDeleteTrip = async (id) => {
    if (!window.confirm('Delete this trip and all its activities? This cannot be undone.')) return;
    try {
      await tripsApi.remove(id);
      setTrips((prev) => prev.filter((t) => t.id !== id));
      if (selectedTrip?.id === id) setSelectedTrip(null);
    } catch (err) {
      showToast(err.message);
    }
  };

  const handleSelectTrip = (trip) => {
    setSelectedTrip((prev) => (prev?.id === trip.id ? null : trip));
  };

  // ── Activity handlers ───────────────────────────────────────────────────────
  const handleAddActivity = async (tripId, formData) => {
    try {
      setActFormLoading(true);
      const res = await activitiesApi.create(tripId, formData);
      setActivities((prev) => [...prev, res.data]);
      return true;
    } catch (err) {
      showToast(err.message);
      return false;
    } finally {
      setActFormLoading(false);
    }
  };

  const handleDeleteActivity = async (id) => {
    try {
      await activitiesApi.remove(id);
      setActivities((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      showToast(err.message);
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen text-slate-200"
      style={{
        background:
          'radial-gradient(ellipse 70% 55% at 5% 45%, rgba(99,102,241,0.07), transparent),' +
          'radial-gradient(ellipse 55% 45% at 95% 5%, rgba(139,92,246,0.05), transparent),' +
          '#0b0c14',
      }}
    >
      <Header tripCount={trips.length} />

      {/* Error toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2.5 px-4 py-3 bg-[#1c0f0f] border border-red-500/25 text-red-400 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.5)] text-sm max-w-sm animate-fade-in">
          <ExclamationCircleIcon className="w-4 h-4 flex-shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ── Hero Banner ──────────────────────────────────────────────────── */}
        <div className="relative mb-8 rounded-2xl overflow-hidden border border-white/[0.07] bg-[#0d0e1c]">
          {/* Animated ambient orbs */}
          <div className="absolute -top-10 -right-10 w-80 h-80 rounded-full blur-3xl pointer-events-none"
               style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.14), transparent)', animation: 'glow-pulse 5s ease-in-out infinite' }} />
          <div className="absolute -bottom-14 left-1/3 w-64 h-64 rounded-full blur-3xl pointer-events-none"
               style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.12), transparent)', animation: 'glow-pulse 7s ease-in-out infinite 1.5s' }} />
          <div className="absolute top-1/2 right-1/4 w-48 h-48 -translate-y-1/2 rounded-full blur-2xl pointer-events-none"
               style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.08), transparent)', animation: 'glow-pulse 4s ease-in-out infinite 0.8s' }} />

          {/* Dot-grid texture */}
          <div className="absolute inset-0 opacity-[0.025] pointer-events-none"
               style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)', backgroundSize: '26px 26px' }} />

          {/* Horizontal shimmer line */}
          <div className="absolute top-0 left-0 right-0 h-[1px]"
               style={{ background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.5) 40%, rgba(139,92,246,0.4) 60%, transparent)' }} />

          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 p-7 sm:p-8">
            {/* Left: text */}
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <span className="text-xl animate-float inline-block">✈️</span>
                <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-[0.18em]">
                  Your Travel Dashboard
                </span>
              </div>
              <h2 className="text-xl sm:text-[1.75rem] font-bold text-white leading-tight mb-2">
                Plan your next{' '}
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage: 'linear-gradient(90deg, #818cf8, #a78bfa, #c084fc, #818cf8)',
                    backgroundSize: '200% 100%',
                    animation: 'gradient-shift 3.5s linear infinite',
                  }}
                >
                  adventure
                </span>{' '}
                🗺️
              </h2>
              <p className="text-sm text-slate-500 max-w-sm">
                Create trips, add activities, and turn your travel dreams into reality.
              </p>
            </div>

            {/* Right: live stats */}
            <div className="flex items-stretch gap-6 sm:gap-10 flex-shrink-0">
              <div className="text-center">
                <p className="text-3xl font-bold text-white leading-none tabular-nums">{trips.length}</p>
                <p className="text-[11px] text-slate-500 mt-1.5 font-semibold uppercase tracking-wide">Total Trips</p>
              </div>
              <div className="w-px bg-white/[0.06] self-stretch" />
              <div className="text-center">
                <p
                  className="text-3xl font-bold leading-none tabular-nums bg-clip-text text-transparent"
                  style={{ backgroundImage: 'linear-gradient(135deg, #818cf8, #c084fc)' }}
                >
                  {countUpcoming(trips)}
                </p>
                <p className="text-[11px] text-slate-500 mt-1.5 font-semibold uppercase tracking-wide">Upcoming</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

          {/* ── Left panel: trips ─────────────────────────── */}
          <div className="lg:col-span-1 space-y-4">
            <TripForm onAdd={handleAddTrip} loading={tripFormLoading} />

            <div>
              <div className="flex items-center justify-between mb-2.5">
                <p className="text-[11px] font-semibold text-slate-600 uppercase tracking-widest">
                  My Trips &nbsp;·&nbsp; {trips.length}
                </p>
              </div>
              <TripList
                trips={trips}
                selectedTrip={selectedTrip}
                onSelect={handleSelectTrip}
                onDelete={handleDeleteTrip}
                loading={tripsLoading}
              />
            </div>
          </div>

          {/* ── Right panel: trip detail ──────────────────── */}
          <div className="lg:col-span-2">
            {!selectedTrip ? (
              /* Empty state */
              <div className="card relative overflow-hidden flex flex-col items-center justify-center min-h-[440px] p-12 text-center">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 via-transparent to-violet-600/5 pointer-events-none rounded-xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none"
                     style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.08), transparent)', animation: 'glow-pulse 4s ease-in-out infinite' }} />

                <div className="relative z-10">
                  <div className="text-6xl mb-5 animate-float select-none">🌏</div>
                  <h3 className="text-base font-semibold text-slate-200 mb-2">
                    Select a trip to explore
                  </h3>
                  <p className="text-sm text-slate-500 max-w-xs leading-relaxed">
                    Pick any trip from the list on the left to view its details and manage activities.
                  </p>
                  <div className="flex items-center justify-center gap-3 mt-6">
                    {['🇯🇵','🇫🇷','🇮🇹','🇦🇺','🇧🇷'].map((flag, i) => (
                      <span
                        key={i}
                        className="text-2xl opacity-30 hover:opacity-80 transition-opacity duration-300 select-none cursor-default"
                        style={{ animationDelay: `${i * 0.2}s` }}
                      >{flag}</span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4 animate-fade-in">

                {/* Trip header with cover image */}
                <div className="bg-[#111320] rounded-xl border border-white/[0.07] overflow-hidden shadow-card">
                  {/* ── Destination cover photo ────────────────────── */}
                  <div className="relative h-48 overflow-hidden bg-gradient-to-br from-indigo-950 to-slate-950">
                    <img
                      src={getDestinationImage(selectedTrip.destination)}
                      alt={selectedTrip.destination}
                      className="w-full h-full object-cover transition-transform duration-[2s] ease-out hover:scale-105"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                    {/* Bottom gradient fade into card */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111320] via-[#111320]/20 to-transparent" />
                    {/* Left vignette */}
                    <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#111320]/60 to-transparent" />
                    {/* Indigo accent line */}
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-600 via-violet-500/60 to-transparent" />

                    {/* Back button — overlaid on photo */}
                    <button
                      onClick={() => setSelectedTrip(null)}
                      className="absolute top-3.5 left-3.5 inline-flex items-center gap-1.5 text-xs text-white/75 hover:text-white bg-black/35 hover:bg-black/55 backdrop-blur-sm border border-white/10 hover:border-white/20 px-3 py-1.5 rounded-full transition-all duration-200 font-semibold group"
                    >
                      <ArrowLeftIcon className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                      All Trips
                    </button>

                    {/* Activity pill — top right */}
                    <div className="absolute top-3.5 right-3.5">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 text-xs font-semibold text-white/80">
                        <span className="text-sm">🏖️</span>
                        {activities.length} {activities.length === 1 ? 'activity' : 'activities'}
                      </span>
                    </div>
                  </div>

                  {/* ── Trip info ───────────────────────────────── */}
                  <div className="p-5">
                    <h2 className="text-[1.45rem] font-bold text-white leading-tight mb-3">
                      {selectedTrip.destination}
                    </h2>
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <CalendarDaysIcon className="w-4 h-4 text-slate-600" />
                        <span className="text-sm text-slate-400">
                          {fmtLong(selectedTrip.startDate)} – {fmtLong(selectedTrip.endDate)}
                        </span>
                      </div>
                      {tripDays(selectedTrip.startDate, selectedTrip.endDate) && (
                        <div className="flex items-center gap-1.5">
                          <ClockIcon className="w-4 h-4 text-slate-600" />
                          <span className="text-sm text-slate-400">
                            {tripDays(selectedTrip.startDate, selectedTrip.endDate)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Activities section */}
                <div className="card p-6">
                  <h3 className="text-[11px] font-semibold text-slate-600 uppercase tracking-widest mb-4">Activities</h3>

                  <ActivityForm
                    tripId={selectedTrip.id}
                    onAdd={handleAddActivity}
                    loading={actFormLoading}
                  />

                  <div className="mt-5">
                    <ActivityList
                      activities={activities}
                      onDelete={handleDeleteActivity}
                      loading={activitiesLoading}
                    />
                  </div>
                </div>

              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
