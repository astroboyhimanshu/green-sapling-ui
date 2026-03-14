import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import StudentHeader from "../components/StudentHeader";
import EducatorHeader from "../components/EducatorHeader";
import { getXPEvents, getTotalXP, type XPEvent } from "../utils/xp";

const XP_LEVELS = [
  { min: 0, max: 99, label: "Seedling", emoji: "🌱", color: "bg-gray-200" },
  { min: 100, max: 249, label: "Sprout", emoji: "🌿", color: "bg-green-300" },
  { min: 250, max: 499, label: "Sapling", emoji: "🌳", color: "bg-green-500" },
  { min: 500, max: 999, label: "Tree", emoji: "🌲", color: "bg-green-700" },
  {
    min: 1000,
    max: Infinity,
    label: "Forest",
    emoji: "🏆",
    color: "bg-yellow-500",
  },
];

function getLevel(xp: number) {
  return XP_LEVELS.find((l) => xp >= l.min && xp <= l.max) ?? XP_LEVELS[0];
}

function getNextLevel(xp: number) {
  const idx = XP_LEVELS.findIndex((l) => xp >= l.min && xp <= l.max);
  return XP_LEVELS[idx + 1] ?? null;
}

export default function ProgressPage() {
  const location = useLocation();
  const isEducator = location.pathname.startsWith("/educator");

  const [events, setEvents] = useState<XPEvent[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setEvents(getXPEvents().slice().reverse()); // newest first
    setTotal(getTotalXP());
  }, []);

  const level = getLevel(total);
  const next = getNextLevel(total);
  const progressPct = next
    ? Math.round(((total - level.min) / (next.min - level.min)) * 100)
    : 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {isEducator ? <EducatorHeader /> : <StudentHeader />}

      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* XP Card */}
        <div className="bg-white rounded-3xl shadow-lg border border-green-100 p-8 mb-6 text-center">
          <div className="text-6xl mb-3">{level.emoji}</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-1">
            {level.label}
          </h1>
          <p className="text-gray-500 text-sm mb-6">Your current rank</p>

          <div className="text-5xl font-extrabold text-green-700 mb-1">
            {total} XP
          </div>
          {next && (
            <p className="text-gray-400 text-sm mb-4">
              {next.min - total} XP to reach {next.emoji} {next.label}
            </p>
          )}

          {/* Progress bar */}
          <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
            <div
              className="bg-green-500 h-4 rounded-full transition-all duration-700"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          {next && (
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>{level.min} XP</span>
              <span>{next.min} XP</span>
            </div>
          )}
        </div>

        {/* Level ladder */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
            Rank Ladder
          </h2>
          <div className="space-y-2">
            {XP_LEVELS.map((l) => {
              const reached = total >= l.min;
              return (
                <div
                  key={l.label}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl transition-all ${
                    reached
                      ? "bg-green-50 border border-green-200"
                      : "bg-gray-50 border border-gray-100 opacity-50"
                  }`}
                >
                  <span className="text-2xl">{l.emoji}</span>
                  <div className="flex-1">
                    <span className="font-semibold text-gray-800">
                      {l.label}
                    </span>
                    <span className="text-xs text-gray-400 ml-2">
                      {l.max === Infinity
                        ? `${l.min}+ XP`
                        : `${l.min}–${l.max} XP`}
                    </span>
                  </div>
                  {reached && (
                    <span className="text-green-500 text-sm font-bold">✓</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Activity log */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
            Activity Log ({events.length} events)
          </h2>
          {events.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-6">
              No XP earned yet. Start a simulation or quiz!
            </p>
          ) : (
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {events.map((e) => (
                <div
                  key={e.id}
                  className="flex items-center justify-between px-4 py-2.5 bg-gray-50 rounded-2xl"
                >
                  <div>
                    <span className="text-sm font-medium text-gray-700">
                      {e.label}
                    </span>
                    <span className="text-xs text-gray-400 ml-2">
                      {new Date(e.timestamp).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <span className="text-green-600 font-bold text-sm">
                    +{e.xp} XP
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
