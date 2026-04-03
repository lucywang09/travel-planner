import { TrashIcon } from '@heroicons/react/24/outline';

const fmtDate = (str) => {
  if (!str) return '';
  const [y, m, d] = str.split('T')[0].split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
  });
};

/**
 * Detects the activity category from title keywords and returns styling tokens.
 */
const getActivityMeta = (title) => {
  const t = title.toLowerCase();
  if (/eat|food|restaurant|cafe|dine|dinner|lunch|breakfast|bistro|taste|cuisine|sushi|ramen|pizza|taco/.test(t))
    return { emoji: '🍽️', label: 'Food',      bg: 'bg-orange-500/12', border: 'border-orange-500/25', tag: 'text-orange-300 bg-orange-500/15 border-orange-500/25' };
  if (/museum|art|gallery|culture|history|temple|church|monument|palace|castle|heritage|ruins|shrine/.test(t))
    return { emoji: '🏛️', label: 'Culture',   bg: 'bg-purple-500/12', border: 'border-purple-500/25', tag: 'text-purple-300 bg-purple-500/15 border-purple-500/25' };
  if (/hike|trek|walk|nature|park|beach|mountain|outdoor|swim|surf|dive|snorkel|camp|trail|jungle|forest/.test(t))
    return { emoji: '🏔️', label: 'Outdoor',   bg: 'bg-emerald-500/12', border: 'border-emerald-500/25', tag: 'text-emerald-300 bg-emerald-500/15 border-emerald-500/25' };
  if (/hotel|stay|check.in|check.out|accommodation|hostel|resort|airbnb|lodge/.test(t))
    return { emoji: '🏨', label: 'Stay',       bg: 'bg-blue-500/12', border: 'border-blue-500/25', tag: 'text-blue-300 bg-blue-500/15 border-blue-500/25' };
  if (/shop|market|buy|mall|souvenir|store|boutique|bazaar|flea|vendor/.test(t))
    return { emoji: '🛍️', label: 'Shopping',  bg: 'bg-pink-500/12', border: 'border-pink-500/25', tag: 'text-pink-300 bg-pink-500/15 border-pink-500/25' };
  if (/flight|train|bus|transport|airport|taxi|metro|subway|ferry|cruise|transfer/.test(t))
    return { emoji: '✈️', label: 'Transport', bg: 'bg-sky-500/12', border: 'border-sky-500/25', tag: 'text-sky-300 bg-sky-500/15 border-sky-500/25' };
  if (/show|concert|theatre|theater|event|festival|night|bar|club|performance|tour|safari/.test(t))
    return { emoji: '🎭', label: 'Events',    bg: 'bg-yellow-500/12', border: 'border-yellow-500/25', tag: 'text-yellow-300 bg-yellow-500/15 border-yellow-500/25' };
  return   { emoji: '📍', label: 'Activity',  bg: 'bg-amber-500/12', border: 'border-amber-500/25', tag: 'text-amber-300 bg-amber-500/15 border-amber-500/25' };
};

export default function ActivityCard({ activity, onDelete }) {
  const meta = getActivityMeta(activity.title);

  return (
    <div className={`group flex gap-3.5 p-4 rounded-xl border ${meta.bg} ${meta.border} hover:brightness-110 transition-all duration-200 animate-slide-up`}>
      {/* Emoji icon */}
      <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-black/20 border border-white/[0.08] flex items-center justify-center mt-0.5 text-[17px] select-none">
        {meta.emoji}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            {/* Title + category tag */}
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-semibold text-slate-100 leading-snug">{activity.title}</p>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${meta.tag}`}>
                {meta.label}
              </span>
            </div>
            {/* Date */}
            <p className="text-xs text-slate-500 mt-1">{fmtDate(activity.activityDate)}</p>

            {/* Notes */}
            {activity.notes && (
              <div className="flex items-start gap-1.5 mt-2.5 p-2.5 bg-black/20 border border-white/[0.06] rounded-lg">
                <span className="text-[11px] flex-shrink-0 mt-px opacity-60">📝</span>
                <p className="text-xs text-slate-400 leading-relaxed">{activity.notes}</p>
              </div>
            )}
          </div>

          <button
            onClick={() => onDelete(activity.id)}
            className="btn-danger-icon flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
            title="Delete activity"
          >
            <TrashIcon className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
