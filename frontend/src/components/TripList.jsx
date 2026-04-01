import TripCard from './TripCard';
import { MapIcon } from '@heroicons/react/24/outline';

function Skeleton() {
  return (
    <div className="bg-[#111320] border border-white/[0.07] rounded-xl p-3.5 animate-pulse">
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
        <div className="h-4 bg-white/[0.07] rounded-md w-2/3" />
      </div>
      <div className="h-3 bg-white/[0.04] rounded-md w-3/4 mt-2 ml-3.5" />
    </div>
  );
}

export default function TripList({ trips, selectedTrip, onSelect, onDelete, loading }) {
  if (loading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => <Skeleton key={i} />)}
      </div>
    );
  }

  if (trips.length === 0) {
    return (
      <div className="card p-8 text-center">
        <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center mx-auto mb-3">
          <MapIcon className="w-5 h-5 text-slate-600" />
        </div>
        <p className="text-sm font-medium text-slate-400">No trips yet</p>
        <p className="text-xs text-slate-600 mt-1">Create your first trip above to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      {trips.map((trip) => (
        <TripCard
          key={trip.id}
          trip={trip}
          selected={selectedTrip?.id === trip.id}
          onSelect={onSelect}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
