'use client'

interface TimetableProps {
  topics: string[]
}

interface TimeEntry {
  time: string
  activity: string
  duration: string
}

export default function Timetable({ topics }: TimetableProps) {
  // Sample timetable - in production, this would be generated based on topics
  const schedule: TimeEntry[] = [
    { time: '5:30 AM', activity: 'Morning hike or gym', duration: '1h' },
    { time: '7:00 AM', activity: 'Breakfast (sardines + toast + olive oil)', duration: '30m' },
    { time: '8:00 AM', activity: 'Shower & prep', duration: '30m' },
    { time: '9:00 AM', activity: 'Work block #1 (deep focus)', duration: '90m' },
    { time: '10:30 AM', activity: 'Break & coffee', duration: '15m' },
    { time: '10:45 AM', activity: 'Work block #2', duration: '90m' },
    { time: '12:15 PM', activity: 'Lunch break', duration: '45m' },
    { time: '1:00 PM', activity: 'Work block #3', duration: '90m' },
    { time: '2:30 PM', activity: 'Break & walk', duration: '15m' },
    { time: '2:45 PM', activity: 'Work block #4', duration: '120m' },
    { time: '4:45 PM', activity: 'Wrap up, email & admin', duration: '15m' },
    { time: '5:00 PM', activity: 'Gym, errands, or date prep', duration: '1.5h' },
    { time: '6:30 PM', activity: 'Dinner (prep or out)', duration: '1h' },
    { time: '7:30 PM', activity: 'Personal time (reading, hobbies)', duration: '1.5h' },
    { time: '9:00 PM', activity: 'Review day & plan tomorrow', duration: '30m' },
    { time: '9:30 PM', activity: 'Wind down (no screens)', duration: '30m' },
    { time: '10:00 PM', activity: 'Sleep', duration: '7h' },
  ]

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-4">Daily Schedule</h3>
        <p className="text-sm text-slate-400 mb-4">
          Optimized for {topics.length} selected topics
        </p>
      </div>

      <div className="space-y-2">
        {schedule.map((entry, idx) => (
          <div
            key={idx}
            className="grid grid-cols-4 gap-4 p-3 bg-slate-800/40 rounded-lg hover:bg-slate-800/60 transition"
          >
            <div className="font-mono font-semibold text-blue-400">{entry.time}</div>
            <div className="col-span-2 text-slate-100">{entry.activity}</div>
            <div className="text-right text-slate-400 text-sm">{entry.duration}</div>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-slate-800">
        <div className="bg-slate-800/30 rounded-lg p-3">
          <p className="text-xs text-slate-400">Work Hours</p>
          <p className="text-xl font-bold text-cyan-400">8h 45m</p>
        </div>
        <div className="bg-slate-800/30 rounded-lg p-3">
          <p className="text-xs text-slate-400">Active Time</p>
          <p className="text-xl font-bold text-green-400">7h 15m</p>
        </div>
        <div className="bg-slate-800/30 rounded-lg p-3">
          <p className="text-xs text-slate-400">Sleep Target</p>
          <p className="text-xl font-bold text-indigo-400">7h</p>
        </div>
      </div>

      {/* Export */}
      <div className="flex gap-3 pt-4 border-t border-slate-800">
        <button className="px-4 py-2 border border-slate-700 hover:bg-slate-800 rounded-lg text-sm font-medium transition">
          📥 Import to Calendar
        </button>
        <button className="px-4 py-2 border border-slate-700 hover:bg-slate-800 rounded-lg text-sm font-medium transition">
          🔔 Set Reminders
        </button>
      </div>
    </div>
  )
}
