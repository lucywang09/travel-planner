import { CalendarDaysIcon, TrashIcon } from '@heroicons/react/24/outline';

const fmtDate = (str) => {
  if (!str) return '';
  const [y, m, d] = str.split('T')[0].split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric',
  });
};

const tripDays = (start, end) => {
  if (!start || !end) return null;
  const [sy, sm, sd] = start.split('T')[0].split('-').map(Number);
  const [ey, em, ed] = end.split('T')[0].split('-').map(Number);
  const days = Math.round(
    (new Date(ey, em - 1, ed) - new Date(sy, sm - 1, sd)) / 86_400_000
  ) + 1;
  return `${days}d`;
};

/** Deterministic destination photo via Picsum (seed = slugified destination) */
const getImg = (destination) => {
  const seed = destination.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  return `https://picsum.photos/seed/${seed}/480/240`;
};

export default function TripCard({ trip, selected, onSelect, onDelete }) {
  const duration = tripDays(trip.startDate, trip.endDate);

  return (
    <div
      onClick={() => onSelect(trip)}
      className={[
        'group cursor-pointer rounded-xl border overflow-hidden transition-all duration-300 animate-card-appear',
        selected
          ? 'border-indigo-500/50 scale-[1.015] shadow-[0_0_32px_rgba(99,102,241,0.22)]'
          : 'border-white/[0.07] hover:border-white/[0.16] hover:scale-[1.015] hover:shadow-[0_10px_36px_rgba(0,0,0,0.55)]',
      ].join(' ')}
    >
      {/* ── Cover image ───────────────────────────────── */}
      <div className="relative h-[112px] overflow-hidden bg-gradient-to-br from-indigo-950 to-slate-950">
        <img
          src={getImg(trip.destination)}
          alt={trip.destination}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
        {/* Gradient fade to card body */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#111320] via-[#111320]/25 to-transparent" />
        {/* Left edge shadow for depth */}
        <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-black/20 to-transparent" />

        {/* Selected badge */}
        {selected && (
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-indigo-500/80 backdrop-blur-sm px-2 py-0.5 rounded-full border border-indigo-400/40">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-[pulse_1.5s_ease-in-out_infinite]" />
            <span className="text-[10px] font-bold text-white">Active</span>
          </div>
        )}

        {/* Delete — appears on hover */}
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(trip.id); }}
          className="absolute top-2.5 left-2.5 p-1.5 bg-black/40 backdrop-blur-sm border border-white/10 text-white/50 hover:text-red-400 hover:bg-red-500/20 hover:border-red-500/30 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200"
          title="Delete trip"
        >
          <TrashIcon className="w-3.5 h-3.5" />
        </button>

        {/* Duration pill — bottom left corner */}
        {duration && (
          <span className="absolute bottom-2.5 left-3 text-[10px] font-bold text-white/70 bg-black/40 backdrop-blur-sm border border-white/10 px-1.5 py-0.5 rounded-md">
            {duration}
          </span>
        )}
      </div>

      {/* ── Info ──────────────────────────────────────── */}
      <div className={`px-3.5 py-3 transition-colors duration-300 ${
        selected ? 'bg-indigo-950/35' : 'bg-[#111320]'
      }`}>
        <p className={`text-sm font-semibold leading-tight truncate ${
          selected ? 'text-indigo-200' : 'text-slate-100'
        }`}>
          {trip.destination}
        </p>
        <div className="flex items-center gap-1.5 mt-1">
          <CalendarDaysIcon className="w-3 h-3 text-slate-600 flex-shrink-0" />
          <span className="text-[11px] text-slate-500">
            {fmtDate(trip.startDate)} – {fmtDate(trip.endDate)}
          </span>
        </div>
      </div>
    </div>
  );
}
