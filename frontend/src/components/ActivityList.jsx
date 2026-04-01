import ActivityCard from './ActivityCard';
import { StarIcon } from '@heroicons/react/24/outline';

function Skeleton() {
  return (
    <div className="flex gap-3 p-3.5 bg-[#111320] rounded-xl border border-white/[0.07] animate-pulse">
      <div className="w-8 h-8 rounded-lg bg-white/[0.06] flex-shrink-0" />
      <div className="flex-1 space-y-2 pt-0.5">
        <div className="h-4 bg-white/[0.07] rounded-md w-3/4" />
        <div className="h-3 bg-white/[0.04] rounded-md w-1/3" />
      </div>
    </div>
  );
}

export default function ActivityList({ activities, onDelete, loading }) {
  if (loading) {
    return (
      <div className="space-y-2">
        {[1, 2].map((i) => <Skeleton key={i} />)}
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="py-10 text-center">
        <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center mx-auto mb-3">
          <StarIcon className="w-5 h-5 text-slate-600" />
        </div>
        <p className="text-sm font-medium text-slate-500">No activities yet</p>
        <p className="text-xs text-slate-600 mt-1">Add your first activity using the form above.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {activities.map((activity) => (
        <ActivityCard
          key={activity.id}
          activity={activity}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
