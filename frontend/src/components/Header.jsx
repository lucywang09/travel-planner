import { GlobeAltIcon, MapIcon } from '@heroicons/react/24/outline';

export default function Header({ tripCount = 0 }) {
  return (
    <header className="sticky top-0 z-20 border-b border-white/[0.06] bg-[#0b0c14]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-[0_4px_14px_rgba(99,102,241,0.4)]">
              <GlobeAltIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-[15px] font-semibold text-white leading-none tracking-tight">
                TripCraft
              </h1>
              <p className="text-[10px] text-slate-500 leading-none mt-0.5 font-semibold tracking-[0.14em] uppercase">
                Travel Planner
              </p>
            </div>
          </div>

          {/* Trip count badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/25">
            <MapIcon className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-xs font-semibold text-indigo-400">
              {tripCount} {tripCount === 1 ? 'Trip' : 'Trips'}
            </span>
          </div>

        </div>
      </div>
    </header>
  );
}
