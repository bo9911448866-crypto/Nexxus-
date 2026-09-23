import React, { useState, useEffect, useMemo } from 'react';
import {
  Clock,
  Calendar,
  Plus,
  Trash2,
  Edit2,
  BookOpen,
  User,
  MapPin,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Hourglass,
  Sparkles,
  Download,
  Upload,
  RefreshCw,
  Bell,
  BellOff,
  CalendarDays,
  LayoutGrid,
  List
} from 'lucide-react';
import { ClassScheduleItem } from '../types.ts';

interface ScheduleTrackerTabProps {
  onBackToGames: () => void;
}

const DAYS_OF_WEEK = [
  { id: 0, label: 'Sun', full: 'Sunday' },
  { id: 1, label: 'Mon', full: 'Monday' },
  { id: 2, label: 'Tue', full: 'Tuesday' },
  { id: 3, label: 'Wed', full: 'Wednesday' },
  { id: 4, label: 'Thu', full: 'Thursday' },
  { id: 5, label: 'Fri', full: 'Friday' },
  { id: 6, label: 'Sat', full: 'Saturday' },
];

const COLOR_OPTIONS = [
  { id: 'cyan', name: 'Cyan', bg: 'bg-cyan-500/10', border: 'border-cyan-500/40', text: 'text-cyan-400', bar: 'bg-cyan-500', glow: 'shadow-cyan-500/20' },
  { id: 'emerald', name: 'Emerald', bg: 'bg-emerald-500/10', border: 'border-emerald-500/40', text: 'text-emerald-400', bar: 'bg-emerald-500', glow: 'shadow-emerald-500/20' },
  { id: 'violet', name: 'Violet', bg: 'bg-violet-500/10', border: 'border-violet-500/40', text: 'text-violet-400', bar: 'bg-violet-500', glow: 'shadow-violet-500/20' },
  { id: 'amber', name: 'Amber', bg: 'bg-amber-500/10', border: 'border-amber-500/40', text: 'text-amber-400', bar: 'bg-amber-500', glow: 'shadow-amber-500/20' },
  { id: 'rose', name: 'Rose', bg: 'bg-rose-500/10', border: 'border-rose-500/40', text: 'text-rose-400', bar: 'bg-rose-500', glow: 'shadow-rose-500/20' },
  { id: 'blue', name: 'Blue', bg: 'bg-blue-500/10', border: 'border-blue-500/40', text: 'text-blue-400', bar: 'bg-blue-500', glow: 'shadow-blue-500/20' },
];

// Helper: Convert "HH:MM" string to minutes from midnight
function timeToMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(':').map((s) => parseInt(s, 10));
  return (h || 0) * 60 + (m || 0);
}

// Helper: Convert minutes from midnight to 12-hour formatted string
function format12Hour(timeStr: string): string {
  const [hStr, mStr] = timeStr.split(':');
  let h = parseInt(hStr, 10);
  const m = mStr || '00';
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  if (h === 0) h = 12;
  return `${h}:${m} ${ampm}`;
}

export const ScheduleTrackerTab: React.FC<ScheduleTrackerTabProps> = ({ onBackToGames }) => {
  // Live current time state updating every 1000ms
  const [now, setNow] = useState<Date>(new Date());
  const [is24Hour, setIs24Hour] = useState<boolean>(false);

  // Selected view day (-1 = All Week, 0-6 = Specific day)
  const currentDayOfWeek = now.getDay(); // 0 is Sunday, 1 is Monday...
  const [selectedDay, setSelectedDay] = useState<number>(currentDayOfWeek);
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day');

  // Stored classes - clean slate with no placeholder dummy data
  const [classes, setClasses] = useState<ClassScheduleItem[]>(() => {
    try {
      const stored = localStorage.getItem('nexxus_class_schedule');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          // Filter out dummy sample placeholders if previously stored
          return parsed.filter((c: any) => !c.id?.startsWith('sample-'));
        }
      }
    } catch {
      // Fallback
    }
    return [];
  });

  // Modal state for Add/Edit
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingClass, setEditingClass] = useState<ClassScheduleItem | null>(null);

  // Form State
  const [formName, setFormName] = useState<string>('');
  const [formStartTime, setFormStartTime] = useState<string>('08:30');
  const [formEndTime, setFormEndTime] = useState<string>('09:20');
  const [formTeacher, setFormTeacher] = useState<string>('');
  const [formRoom, setFormRoom] = useState<string>('');
  const [formDays, setFormDays] = useState<number[]>([1, 2, 3, 4, 5]);
  const [formColor, setFormColor] = useState<string>('cyan');
  const [formNotes, setFormNotes] = useState<string>('');

  // Clock tick interval
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Save classes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('nexxus_class_schedule', JSON.stringify(classes));
    } catch {
      // storage error
    }
  }, [classes]);

  // Current time calculations
  const nowHours = now.getHours();
  const nowMinutes = now.getMinutes();
  const nowSeconds = now.getSeconds();
  const currentMinutesToday = nowHours * 60 + nowMinutes;
  const currentSecondsWithinMinute = nowSeconds;

  // Classes for today, sorted by start time
  const todayClasses = useMemo(() => {
    return classes
      .filter((c) => c.days.includes(currentDayOfWeek))
      .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));
  }, [classes, currentDayOfWeek]);

  // Classes for selected day tab
  const displayClasses = useMemo(() => {
    return classes
      .filter((c) => c.days.includes(selectedDay))
      .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));
  }, [classes, selectedDay]);

  // Determine current live status
  const liveStatus = useMemo(() => {
    if (classes.length === 0) {
      return {
        state: 'empty-schedule' as const,
      };
    }

    if (todayClasses.length === 0) {
      // Find next scheduled class in the future days
      let nextDayOffset = 1;
      let nextDayClass: { day: number; item: ClassScheduleItem } | null = null;
      for (let i = 1; i <= 7; i++) {
        const checkDay = (currentDayOfWeek + i) % 7;
        const found = classes
          .filter((c) => c.days.includes(checkDay))
          .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime))[0];
        if (found) {
          nextDayClass = { day: checkDay, item: found };
          nextDayOffset = i;
          break;
        }
      }

      return {
        state: 'no-classes-today' as const,
        nextDayClass,
        nextDayOffset,
      };
    }

    // 1. Check if we are currently inside any class
    for (let i = 0; i < todayClasses.length; i++) {
      const cls = todayClasses[i];
      const startMin = timeToMinutes(cls.startTime);
      const endMin = timeToMinutes(cls.endTime);

      if (currentMinutesToday >= startMin && currentMinutesToday < endMin) {
        const totalDurationSec = (endMin - startMin) * 60;
        const elapsedSec = (currentMinutesToday - startMin) * 60 + currentSecondsWithinMinute;
        const remainingSec = Math.max(0, totalDurationSec - elapsedSec);
        const percent = Math.min(100, Math.max(0, (elapsedSec / totalDurationSec) * 100));

        const nextClass = todayClasses[i + 1] || null;

        return {
          state: 'in-class' as const,
          currentClass: cls,
          remainingSec,
          elapsedSec,
          totalDurationSec,
          percent,
          nextClass,
        };
      }
    }

    // 2. Check if before first class of today
    const firstClass = todayClasses[0];
    const firstStartMin = timeToMinutes(firstClass.startTime);
    if (currentMinutesToday < firstStartMin) {
      const diffMin = firstStartMin - currentMinutesToday;
      const remainingSec = (diffMin - 1) * 60 + (60 - currentSecondsWithinMinute);

      return {
        state: 'before-school' as const,
        firstClass,
        remainingSec,
      };
    }

    // 3. Check if in passing period between classes
    for (let i = 0; i < todayClasses.length - 1; i++) {
      const thisEndMin = timeToMinutes(todayClasses[i].endTime);
      const nextStartMin = timeToMinutes(todayClasses[i + 1].startTime);

      if (currentMinutesToday >= thisEndMin && currentMinutesToday < nextStartMin) {
        const nextClass = todayClasses[i + 1];
        const diffMin = nextStartMin - currentMinutesToday;
        const remainingSec = (diffMin - 1) * 60 + (60 - currentSecondsWithinMinute);
        const totalBreakSec = (nextStartMin - thisEndMin) * 60;
        const elapsedSec = (currentMinutesToday - thisEndMin) * 60 + currentSecondsWithinMinute;
        const percent = Math.min(100, Math.max(0, (elapsedSec / totalBreakSec) * 100));

        return {
          state: 'passing-period' as const,
          previousClass: todayClasses[i],
          nextClass,
          remainingSec,
          percent,
        };
      }
    }

    // 4. If after all classes today
    const lastClass = todayClasses[todayClasses.length - 1];
    const lastEndMin = timeToMinutes(lastClass.endTime);
    if (currentMinutesToday >= lastEndMin) {
      // Find next class tomorrow or upcoming
      let nextDayClass: { day: number; item: ClassScheduleItem } | null = null;
      let nextDayOffset = 1;
      for (let i = 1; i <= 7; i++) {
        const checkDay = (currentDayOfWeek + i) % 7;
        const found = classes
          .filter((c) => c.days.includes(checkDay))
          .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime))[0];
        if (found) {
          nextDayClass = { day: checkDay, item: found };
          nextDayOffset = i;
          break;
        }
      }

      return {
        state: 'school-over' as const,
        nextDayClass,
        nextDayOffset,
      };
    }

    return { state: 'idle' as const };
  }, [todayClasses, currentMinutesToday, currentSecondsWithinMinute, currentDayOfWeek, classes]);

  // Open modal for adding
  const handleOpenAddModal = () => {
    setEditingClass(null);
    setFormName('');
    setFormStartTime('08:30');
    setFormEndTime('09:20');
    setFormTeacher('');
    setFormRoom('');
    setFormDays([1, 2, 3, 4, 5]);
    setFormColor('cyan');
    setFormNotes('');
    setIsModalOpen(true);
  };

  // Open modal for editing
  const handleOpenEditModal = (c: ClassScheduleItem) => {
    setEditingClass(c);
    setFormName(c.name);
    setFormStartTime(c.startTime);
    setFormEndTime(c.endTime);
    setFormTeacher(c.teacher || '');
    setFormRoom(c.room || '');
    setFormDays([...c.days]);
    setFormColor(c.color || 'cyan');
    setFormNotes(c.notes || '');
    setIsModalOpen(true);
  };

  // Save class (add or edit)
  const handleSaveClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (editingClass) {
      setClasses((prev) =>
        prev.map((item) =>
          item.id === editingClass.id
            ? {
                ...item,
                name: formName.trim(),
                startTime: formStartTime,
                endTime: formEndTime,
                teacher: formTeacher.trim() || undefined,
                room: formRoom.trim() || undefined,
                days: formDays.length > 0 ? formDays : [1, 2, 3, 4, 5],
                color: formColor,
                notes: formNotes.trim() || undefined,
              }
            : item
        )
      );
    } else {
      const newClass: ClassScheduleItem = {
        id: 'cls-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
        name: formName.trim(),
        startTime: formStartTime,
        endTime: formEndTime,
        teacher: formTeacher.trim() || undefined,
        room: formRoom.trim() || undefined,
        days: formDays.length > 0 ? formDays : [1, 2, 3, 4, 5],
        color: formColor,
        notes: formNotes.trim() || undefined,
      };
      setClasses((prev) => [...prev, newClass]);
    }

    setIsModalOpen(false);
  };

  // Delete a class
  const handleDeleteClass = (id: string) => {
    if (confirm('Delete this class from your schedule?')) {
      setClasses((prev) => prev.filter((c) => c.id !== id));
    }
  };

  // Toggle single day in form
  const toggleFormDay = (dayId: number) => {
    setFormDays((prev) =>
      prev.includes(dayId) ? prev.filter((d) => d !== dayId) : [...prev, dayId].sort((a, b) => a - b)
    );
  };

  // Format seconds into "Xh Ym Zs" or "Ym Zs"
  const formatCountdown = (totalSec: number) => {
    const hours = Math.floor(totalSec / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = Math.floor(totalSec % 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds.toString().padStart(2, '0')}s`;
    }
    return `${minutes}m ${seconds.toString().padStart(2, '0')}s`;
  };

  // Clear all classes
  const handleClearAll = () => {
    if (confirm('Clear all classes from your schedule?')) {
      setClasses([]);
    }
  };

  // Export JSON file
  const handleExportSchedule = () => {
    const blob = new Blob([JSON.stringify(classes, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexxus-schedule-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import JSON file
  const handleImportSchedule = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (Array.isArray(data)) {
          setClasses(data);
          alert(`Successfully imported ${data.length} classes!`);
        }
      } catch {
        alert('Invalid schedule JSON file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Get color styles for class card
  const getColorTokens = (colorName?: string) => {
    return (
      COLOR_OPTIONS.find((c) => c.id === colorName) ||
      COLOR_OPTIONS[0]
    );
  };

  // Digital clock string
  const clockHours = now.getHours();
  const clockMins = now.getMinutes().toString().padStart(2, '0');
  const clockSecs = now.getSeconds().toString().padStart(2, '0');
  const ampm = clockHours >= 12 ? 'PM' : 'AM';
  const displayHours = is24Hour
    ? clockHours.toString().padStart(2, '0')
    : (clockHours % 12 || 12).toString().padStart(2, '0');

  const currentDateFormatted = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Header & Live Master Clock */}
      <div className="relative overflow-hidden rounded-md border border-zinc-800 bg-zinc-950 p-6 md:p-8">
        {/* Cyber grid background effect */}
        <div className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Title & Today Summary */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded border border-cyan-800 bg-cyan-950/60 text-cyan-400">
                <Calendar className="h-4 w-4" />
              </div>
              <h1 className="font-['Syne',sans-serif] text-2xl font-black uppercase tracking-wider text-white">
                Class Schedule & Bell Tracker
              </h1>
              <span className="rounded border border-zinc-700 bg-zinc-900 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-zinc-300">
                Weekly Loop
              </span>
            </div>
            <p className="font-mono text-xs text-zinc-400">
              Live tracking for current classes, countdowns, passing periods, and upcoming bells.
            </p>
          </div>

          {/* Master Digital Clock */}
          <div className="flex flex-col items-start md:items-end justify-center rounded border border-zinc-800 bg-black/80 px-5 py-3">
            <div className="flex items-baseline gap-2 font-mono">
              <span className="text-3xl md:text-4xl font-black tracking-tight text-white">
                {displayHours}:{clockMins}
              </span>
              <span className="text-xl md:text-2xl font-bold text-cyan-400">
                :{clockSecs}
              </span>
              {!is24Hour && (
                <span className="ml-1 text-sm font-bold text-zinc-400 uppercase">
                  {ampm}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-[11px] text-zinc-400 uppercase tracking-widest">
                {currentDateFormatted}
              </span>
            </div>
          </div>
        </div>

        {/* Live Status Banner / Real-time Tracker */}
        <div className="relative mt-6 pt-6 border-t border-zinc-800/80">
          {liveStatus.state === 'in-class' && liveStatus.currentClass && (
            <div className="rounded-md border border-emerald-500/40 bg-emerald-950/20 p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-0.5 font-mono text-[11px] font-bold text-emerald-300 uppercase tracking-wider">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                      Class In Session
                    </span>
                    <span className="font-mono text-xs text-zinc-400">
                      {is24Hour ? liveStatus.currentClass.startTime : format12Hour(liveStatus.currentClass.startTime)} -{' '}
                      {is24Hour ? liveStatus.currentClass.endTime : format12Hour(liveStatus.currentClass.endTime)}
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide">
                    {liveStatus.currentClass.name}
                  </h2>

                  <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-zinc-400 pt-0.5">
                    {liveStatus.currentClass.room && (
                      <span className="flex items-center gap-1 text-zinc-300">
                        <MapPin className="h-3.5 w-3.5 text-emerald-400" />
                        {liveStatus.currentClass.room}
                      </span>
                    )}
                    {liveStatus.currentClass.teacher && (
                      <span className="flex items-center gap-1 text-zinc-300">
                        <User className="h-3.5 w-3.5 text-zinc-400" />
                        {liveStatus.currentClass.teacher}
                      </span>
                    )}
                    {liveStatus.nextClass && (
                      <span className="flex items-center gap-1 text-zinc-500">
                        <ChevronRight className="h-3.5 w-3.5" />
                        Next: <strong className="text-zinc-300">{liveStatus.nextClass.name}</strong> at{' '}
                        {is24Hour ? liveStatus.nextClass.startTime : format12Hour(liveStatus.nextClass.startTime)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Countdown & Progress Gauge */}
                <div className="sm:text-right shrink-0 bg-black/60 border border-emerald-500/30 rounded p-3 min-w-[200px]">
                  <div className="font-mono text-[11px] uppercase tracking-wider text-emerald-400">
                    Time Remaining
                  </div>
                  <div className="font-mono text-2xl font-black text-white mt-0.5">
                    {formatCountdown(liveStatus.remainingSec)}
                  </div>
                  <div className="mt-2 w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-emerald-400 h-full rounded-full transition-all duration-1000"
                      style={{ width: `${liveStatus.percent}%` }}
                    />
                  </div>
                  <div className="mt-1 font-mono text-[10px] text-zinc-500 text-right">
                    {Math.round(liveStatus.percent)}% elapsed
                  </div>
                </div>
              </div>
            </div>
          )}

          {liveStatus.state === 'passing-period' && liveStatus.nextClass && (
            <div className="rounded-md border border-cyan-500/40 bg-cyan-950/20 p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/20 border border-cyan-500/40 px-2.5 py-0.5 font-mono text-[11px] font-bold text-cyan-300 uppercase tracking-wider">
                      <Hourglass className="h-3 w-3 animate-spin" />
                      Passing Period / Break
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide">
                    Next Up: {liveStatus.nextClass.name}
                  </h2>
                  <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-zinc-400 pt-0.5">
                    <span>
                      Starts at{' '}
                      <strong className="text-cyan-400">
                        {is24Hour ? liveStatus.nextClass.startTime : format12Hour(liveStatus.nextClass.startTime)}
                      </strong>
                    </span>
                    {liveStatus.nextClass.room && (
                      <span className="flex items-center gap-1 text-zinc-300">
                        <MapPin className="h-3.5 w-3.5 text-cyan-400" />
                        {liveStatus.nextClass.room}
                      </span>
                    )}
                    {liveStatus.nextClass.teacher && (
                      <span className="flex items-center gap-1 text-zinc-300">
                        <User className="h-3.5 w-3.5 text-zinc-400" />
                        {liveStatus.nextClass.teacher}
                      </span>
                    )}
                  </div>
                </div>

                <div className="sm:text-right shrink-0 bg-black/60 border border-cyan-500/30 rounded p-3 min-w-[200px]">
                  <div className="font-mono text-[11px] uppercase tracking-wider text-cyan-400">
                    Next Class Starts In
                  </div>
                  <div className="font-mono text-2xl font-black text-white mt-0.5">
                    {formatCountdown(liveStatus.remainingSec)}
                  </div>
                  <div className="mt-2 w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-cyan-400 h-full rounded-full transition-all duration-1000"
                      style={{ width: `${liveStatus.percent}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {liveStatus.state === 'before-school' && liveStatus.firstClass && (
            <div className="rounded-md border border-zinc-700 bg-zinc-900/60 p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-800 border border-zinc-700 px-2.5 py-0.5 font-mono text-[11px] font-bold text-zinc-300 uppercase tracking-wider">
                    <Clock className="h-3 w-3 text-cyan-400" />
                    Before School Begins Today
                  </span>
                  <h2 className="text-xl font-bold text-white mt-1">
                    First Period: {liveStatus.firstClass.name}
                  </h2>
                  <p className="font-mono text-xs text-zinc-400 mt-0.5">
                    Starts at {is24Hour ? liveStatus.firstClass.startTime : format12Hour(liveStatus.firstClass.startTime)}
                    {liveStatus.firstClass.room ? ` in ${liveStatus.firstClass.room}` : ''}
                  </p>
                </div>

                <div className="sm:text-right shrink-0 bg-black/60 border border-zinc-800 rounded p-3 min-w-[200px]">
                  <div className="font-mono text-[11px] uppercase tracking-wider text-zinc-400">
                    Starts In
                  </div>
                  <div className="font-mono text-2xl font-black text-cyan-400 mt-0.5">
                    {formatCountdown(liveStatus.remainingSec)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {liveStatus.state === 'school-over' && (
            <div className="rounded-md border border-zinc-800 bg-zinc-900/40 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-400">
                    All Classes Completed Today
                  </span>
                </div>
                <h3 className="text-base font-semibold text-white mt-1">
                  School day has concluded. Free time active!
                </h3>
                {liveStatus.nextDayClass && (
                  <p className="font-mono text-xs text-zinc-400 mt-0.5">
                    Next class:{' '}
                    <strong className="text-zinc-200">{liveStatus.nextDayClass.item.name}</strong> on{' '}
                    {DAYS_OF_WEEK.find((d) => d.id === liveStatus.nextDayClass?.day)?.full} at{' '}
                    {is24Hour ? liveStatus.nextDayClass.item.startTime : format12Hour(liveStatus.nextDayClass.item.startTime)}
                  </p>
                )}
              </div>

              <button
                onClick={onBackToGames}
                className="inline-flex items-center justify-center gap-2 rounded border border-zinc-700 bg-zinc-800 px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-white hover:border-white hover:bg-zinc-700 transition-all"
              >
                Return to Games Archive
              </button>
            </div>
          )}

          {liveStatus.state === 'empty-schedule' && (
            <div className="rounded-md border border-zinc-800 bg-zinc-900/40 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-cyan-400" />
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-cyan-400">
                    Schedule Empty
                  </span>
                </div>
                <h3 className="text-base font-semibold text-white mt-1">
                  No classes added yet.
                </h3>
                <p className="font-mono text-xs text-zinc-400 mt-0.5">
                  Add your courses, times, rooms, and recurring days to start live tracking your school day.
                </p>
              </div>

              <button
                onClick={handleOpenAddModal}
                className="inline-flex items-center justify-center gap-1.5 rounded border border-white bg-white px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-black hover:bg-zinc-200 transition-all shrink-0"
              >
                <Plus className="h-3.5 w-3.5" />
                Add First Class
              </button>
            </div>
          )}

          {liveStatus.state === 'no-classes-today' && (
            <div className="rounded-md border border-zinc-800 bg-zinc-900/30 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-cyan-400" />
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-cyan-400">
                    No Classes Scheduled Today
                  </span>
                </div>
                <h3 className="text-base font-semibold text-white mt-1">
                  Enjoy your day off or view your weekly schedule below.
                </h3>
                {liveStatus.nextDayClass && (
                  <p className="font-mono text-xs text-zinc-400 mt-0.5">
                    Next scheduled class:{' '}
                    <strong className="text-zinc-200">{liveStatus.nextDayClass.item.name}</strong> on{' '}
                    {DAYS_OF_WEEK.find((d) => d.id === liveStatus.nextDayClass?.day)?.full} at{' '}
                    {is24Hour ? liveStatus.nextDayClass.item.startTime : format12Hour(liveStatus.nextDayClass.item.startTime)}
                  </p>
                )}
              </div>

              <button
                onClick={handleOpenAddModal}
                className="inline-flex items-center justify-center gap-1.5 rounded border border-cyan-800 bg-cyan-950/60 px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-cyan-300 hover:border-cyan-500 hover:bg-cyan-900 transition-all"
              >
                <Plus className="h-3.5 w-3.5" />
                Add A Class
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Control Toolbar: Day Switcher, View Switcher & Action Buttons */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-zinc-950 border border-zinc-800 rounded-md p-3 sm:p-4">
        {/* Day Selector Pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          {DAYS_OF_WEEK.map((d) => {
            const isToday = d.id === currentDayOfWeek;
            const isSelected = selectedDay === d.id && viewMode === 'day';
            const countForDay = classes.filter((c) => c.days.includes(d.id)).length;

            return (
              <button
                key={d.id}
                onClick={() => {
                  setSelectedDay(d.id);
                  setViewMode('day');
                }}
                className={`relative flex items-center gap-1.5 rounded px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-white font-bold text-black shadow'
                    : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
                }`}
              >
                <span>{d.label}</span>
                {isToday && (
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      isSelected ? 'bg-black' : 'bg-emerald-400'
                    }`}
                    title="Current Day"
                  />
                )}
                {countForDay > 0 && (
                  <span
                    className={`rounded px-1 text-[9px] ${
                      isSelected ? 'bg-zinc-200 text-black' : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {countForDay}
                  </span>
                )}
              </button>
            );
          })}

          <button
            onClick={() => setViewMode(viewMode === 'week' ? 'day' : 'week')}
            className={`flex items-center gap-1.5 rounded border px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition-all whitespace-nowrap ${
              viewMode === 'week'
                ? 'border-cyan-500 bg-cyan-950 text-cyan-300 font-bold'
                : 'border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-white'
            }`}
          >
            <CalendarDays className="h-3.5 w-3.5" />
            <span>All Week</span>
          </button>
        </div>

        {/* Toolbar Utility Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* 12H vs 24H Toggle */}
          <button
            onClick={() => setIs24Hour((prev) => !prev)}
            className="rounded border border-zinc-800 bg-zinc-900 px-2.5 py-1.5 font-mono text-xs text-zinc-300 hover:border-zinc-700 hover:text-white transition-all"
            title="Toggle 12-hour or 24-hour display"
          >
            {is24Hour ? '24-HOUR' : '12-HOUR'}
          </button>

          {/* Clear All Classes */}
          {classes.length > 0 && (
            <button
              onClick={handleClearAll}
              className="flex items-center gap-1 rounded border border-zinc-800 bg-zinc-900 px-2.5 py-1.5 font-mono text-xs text-zinc-400 hover:border-rose-900 hover:bg-rose-950/30 hover:text-rose-400 transition-all"
              title="Clear all classes"
            >
              <Trash2 className="h-3 w-3" />
              <span className="hidden sm:inline">Clear All</span>
            </button>
          )}

          {/* Export JSON */}
          <button
            onClick={handleExportSchedule}
            className="flex items-center gap-1 rounded border border-zinc-800 bg-zinc-900 px-2.5 py-1.5 font-mono text-xs text-zinc-400 hover:border-zinc-600 hover:text-white transition-all"
            title="Export schedule to JSON file"
          >
            <Download className="h-3 w-3" />
            <span className="hidden sm:inline">Export</span>
          </button>

          {/* Import JSON */}
          <label className="flex items-center gap-1 rounded border border-zinc-800 bg-zinc-900 px-2.5 py-1.5 font-mono text-xs text-zinc-400 hover:border-zinc-600 hover:text-white transition-all cursor-pointer">
            <Upload className="h-3 w-3" />
            <span className="hidden sm:inline">Import</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportSchedule}
              className="hidden"
            />
          </label>

          {/* Add New Class Button */}
          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-1.5 rounded border border-white bg-white px-3.5 py-1.5 font-mono text-xs font-bold uppercase tracking-wider text-black hover:bg-zinc-200 transition-all shadow-sm"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Class</span>
          </button>
        </div>
      </div>

      {/* Main Schedule Content: Day View or Week Grid */}
      {viewMode === 'day' ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-['Syne',sans-serif] text-base font-bold uppercase tracking-wider text-zinc-200 flex items-center gap-2">
              <span>{DAYS_OF_WEEK.find((d) => d.id === selectedDay)?.full}'s Schedule</span>
              {selectedDay === currentDayOfWeek && (
                <span className="rounded bg-emerald-950 border border-emerald-800 text-emerald-400 px-1.5 py-0.2 font-mono text-[10px] font-bold">
                  TODAY
                </span>
              )}
            </h3>
            <span className="font-mono text-xs text-zinc-500">
              {displayClasses.length} {displayClasses.length === 1 ? 'class' : 'classes'} scheduled
            </span>
          </div>

          {displayClasses.length === 0 ? (
            <div className="rounded-md border border-dashed border-zinc-800 bg-zinc-950/60 p-12 text-center">
              <BookOpen className="mx-auto h-8 w-8 text-zinc-600 mb-3" />
              <h4 className="font-mono text-sm font-semibold text-zinc-300 uppercase tracking-wider">
                No Classes Scheduled For {DAYS_OF_WEEK.find((d) => d.id === selectedDay)?.full}
              </h4>
              <p className="font-mono text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
                No periods scheduled for this day yet.
              </p>
              <button
                onClick={handleOpenAddModal}
                className="mt-4 inline-flex items-center gap-1.5 rounded border border-zinc-700 bg-zinc-900 px-3.5 py-1.5 font-mono text-xs font-bold text-white hover:border-white transition-all"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Class For {DAYS_OF_WEEK.find((d) => d.id === selectedDay)?.label}
              </button>
            </div>
          ) : (
            <div className="grid gap-3">
              {displayClasses.map((cls, idx) => {
                const colorTokens = getColorTokens(cls.color);
                const isCurrentlyActive =
                  selectedDay === currentDayOfWeek &&
                  liveStatus.state === 'in-class' &&
                  liveStatus.currentClass?.id === cls.id;

                const startMin = timeToMinutes(cls.startTime);
                const endMin = timeToMinutes(cls.endTime);
                const durationMin = endMin - startMin;
                const isPast =
                  selectedDay === currentDayOfWeek && currentMinutesToday >= endMin;

                return (
                  <div
                    key={cls.id}
                    className={`relative rounded-md border transition-all ${
                      isCurrentlyActive
                        ? 'border-emerald-500 bg-emerald-950/20 shadow-lg shadow-emerald-950/50'
                        : isPast
                        ? 'border-zinc-850 bg-zinc-950/50 opacity-70'
                        : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'
                    } p-4 sm:p-5`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      {/* Left: Timing badge & Details */}
                      <div className="flex items-start gap-4">
                        {/* Period Index & Timeline Indicator */}
                        <div className="flex flex-col items-center justify-center rounded border border-zinc-800 bg-black px-2.5 py-2 min-w-[58px] text-center">
                          <span className="font-mono text-[10px] uppercase text-zinc-500">
                            PERIOD
                          </span>
                          <span className="font-mono text-lg font-black text-white">
                            {idx + 1}
                          </span>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-lg font-bold text-white">
                              {cls.name}
                            </h4>
                            {isCurrentlyActive && (
                              <span className="inline-flex items-center gap-1 rounded bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-300 uppercase tracking-wider">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                                ACTIVE NOW
                              </span>
                            )}
                            {isPast && (
                              <span className="rounded bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 font-mono text-[10px] text-zinc-500">
                                COMPLETED
                              </span>
                            )}
                          </div>

                          {/* Time & Duration */}
                          <div className="flex items-center gap-3 font-mono text-xs text-zinc-400">
                            <span className="flex items-center gap-1 text-white font-medium">
                              <Clock className="h-3.5 w-3.5 text-cyan-400" />
                              {is24Hour ? cls.startTime : format12Hour(cls.startTime)} -{' '}
                              {is24Hour ? cls.endTime : format12Hour(cls.endTime)}
                            </span>
                            <span className="text-zinc-600">•</span>
                            <span className="text-zinc-400">{durationMin} mins</span>
                          </div>

                          {/* Meta: Room, Teacher, Days */}
                          <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-zinc-400 pt-1">
                            {cls.room && (
                              <span className="flex items-center gap-1 text-zinc-300">
                                <MapPin className="h-3.5 w-3.5 text-zinc-500" />
                                {cls.room}
                              </span>
                            )}
                            {cls.teacher && (
                              <span className="flex items-center gap-1 text-zinc-300">
                                <User className="h-3.5 w-3.5 text-zinc-500" />
                                {cls.teacher}
                              </span>
                            )}
                            {cls.notes && (
                              <span className="text-zinc-500 italic">
                                "{cls.notes}"
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: Days indicator & Actions */}
                      <div className="flex items-center gap-3 self-end sm:self-center">
                        {/* Day Pills */}
                        <div className="hidden md:flex items-center gap-1">
                          {DAYS_OF_WEEK.map((d) => {
                            const isIncluded = cls.days.includes(d.id);
                            return (
                              <span
                                key={d.id}
                                className={`h-5 w-5 rounded flex items-center justify-center font-mono text-[9px] font-bold ${
                                  isIncluded
                                    ? 'bg-zinc-800 text-white border border-zinc-700'
                                    : 'text-zinc-700 bg-transparent'
                                }`}
                              >
                                {d.label.charAt(0)}
                              </span>
                            );
                          })}
                        </div>

                        {/* Edit Button */}
                        <button
                          onClick={() => handleOpenEditModal(cls)}
                          className="flex h-8 w-8 items-center justify-center rounded border border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-600 hover:text-white transition-all"
                          title="Edit Class"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDeleteClass(cls.id)}
                          className="flex h-8 w-8 items-center justify-center rounded border border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-rose-900 hover:bg-rose-950/40 hover:text-rose-400 transition-all"
                          title="Delete Class"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* Week Grid View */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-['Syne',sans-serif] text-base font-bold uppercase tracking-wider text-zinc-200">
              Weekly Schedule Overview
            </h3>
            <span className="font-mono text-xs text-zinc-500">
              Repeats every week
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
            {[1, 2, 3, 4, 5].map((dayId) => {
              const dayMeta = DAYS_OF_WEEK.find((d) => d.id === dayId)!;
              const isToday = dayId === currentDayOfWeek;
              const dayClassesList = classes
                .filter((c) => c.days.includes(dayId))
                .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));

              return (
                <div
                  key={dayId}
                  className={`rounded-md border p-3 flex flex-col space-y-2 ${
                    isToday
                      ? 'border-emerald-500/50 bg-zinc-950 shadow-md shadow-emerald-950/20'
                      : 'border-zinc-800 bg-zinc-950/70'
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                    <span className="font-mono text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      {dayMeta.full}
                      {isToday && (
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      )}
                    </span>
                    <span className="font-mono text-[10px] text-zinc-500">
                      {dayClassesList.length}
                    </span>
                  </div>

                  <div className="space-y-2 flex-1 min-h-[140px]">
                    {dayClassesList.length === 0 ? (
                      <div className="h-full flex items-center justify-center font-mono text-[11px] text-zinc-600 text-center py-6">
                        No classes
                      </div>
                    ) : (
                      dayClassesList.map((c) => (
                        <div
                          key={c.id}
                          onClick={() => {
                            setSelectedDay(dayId);
                            setViewMode('day');
                          }}
                          className="cursor-pointer rounded border border-zinc-800/80 bg-zinc-900/60 p-2 text-left hover:border-zinc-600 transition-all"
                        >
                          <div className="font-mono text-[10px] text-cyan-400 font-bold">
                            {is24Hour ? c.startTime : format12Hour(c.startTime)}
                          </div>
                          <div className="text-xs font-bold text-white truncate mt-0.5">
                            {c.name}
                          </div>
                          {c.room && (
                            <div className="font-mono text-[10px] text-zinc-400 truncate">
                              {c.room}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Weekend box */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {[0, 6].map((dayId) => {
              const dayMeta = DAYS_OF_WEEK.find((d) => d.id === dayId)!;
              const isToday = dayId === currentDayOfWeek;
              const dayClassesList = classes
                .filter((c) => c.days.includes(dayId))
                .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));

              return (
                <div
                  key={dayId}
                  className={`rounded-md border p-3 flex flex-col space-y-2 ${
                    isToday
                      ? 'border-emerald-500/50 bg-zinc-950'
                      : 'border-zinc-850 bg-zinc-950/40'
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                    <span className="font-mono text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                      {dayMeta.full} (Weekend)
                      {isToday && (
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      )}
                    </span>
                    <span className="font-mono text-[10px] text-zinc-600">
                      {dayClassesList.length}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {dayClassesList.length === 0 ? (
                      <div className="font-mono text-[11px] text-zinc-600 py-2">
                        No scheduled weekend periods
                      </div>
                    ) : (
                      dayClassesList.map((c) => (
                        <div
                          key={c.id}
                          className="rounded border border-zinc-800 bg-zinc-900/60 p-2 text-left"
                        >
                          <div className="font-mono text-[10px] text-cyan-400">
                            {is24Hour ? c.startTime : format12Hour(c.startTime)}
                          </div>
                          <div className="text-xs font-bold text-white truncate">
                            {c.name}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add / Edit Class Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-lg border border-zinc-800 bg-zinc-950 p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-white" />
                <h3 className="font-['Syne',sans-serif] text-lg font-bold text-white uppercase tracking-wider">
                  {editingClass ? 'Edit Class Period' : 'Add New Class Period'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="font-mono text-xs text-zinc-500 hover:text-white transition-colors"
              >
                [ESC / CLOSE]
              </button>
            </div>

            <form onSubmit={handleSaveClass} className="space-y-4">
              {/* Class Name */}
              <div>
                <label className="block font-mono text-xs uppercase tracking-wider text-zinc-400 mb-1.5">
                  Class / Course Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Class or course title"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full rounded border border-zinc-800 bg-black px-3 py-2 font-mono text-sm text-white placeholder-zinc-600 focus:border-white focus:outline-none"
                />
              </div>

              {/* Start & End Times */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-xs uppercase tracking-wider text-zinc-400 mb-1.5">
                    Start Time *
                  </label>
                  <input
                    type="time"
                    required
                    value={formStartTime}
                    onChange={(e) => setFormStartTime(e.target.value)}
                    className="w-full rounded border border-zinc-800 bg-black px-3 py-2 font-mono text-sm text-white focus:border-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs uppercase tracking-wider text-zinc-400 mb-1.5">
                    End Time *
                  </label>
                  <input
                    type="time"
                    required
                    value={formEndTime}
                    onChange={(e) => setFormEndTime(e.target.value)}
                    className="w-full rounded border border-zinc-800 bg-black px-3 py-2 font-mono text-sm text-white focus:border-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Multi-Day Selector */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-mono text-xs uppercase tracking-wider text-zinc-400">
                    Repeats On Days *
                  </label>
                  <div className="flex gap-2 font-mono text-[10px]">
                    <button
                      type="button"
                      onClick={() => setFormDays([1, 2, 3, 4, 5])}
                      className="text-cyan-400 hover:underline"
                    >
                      Mon-Fri
                    </button>
                    <span className="text-zinc-600">|</span>
                    <button
                      type="button"
                      onClick={() => setFormDays([1, 3, 5])}
                      className="text-cyan-400 hover:underline"
                    >
                      MWF
                    </button>
                    <span className="text-zinc-600">|</span>
                    <button
                      type="button"
                      onClick={() => setFormDays([2, 4])}
                      className="text-cyan-400 hover:underline"
                    >
                      TuTh
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-1.5">
                  {DAYS_OF_WEEK.map((d) => {
                    const isSelected = formDays.includes(d.id);
                    return (
                      <button
                        type="button"
                        key={d.id}
                        onClick={() => toggleFormDay(d.id)}
                        className={`py-2 rounded font-mono text-xs font-bold transition-all border ${
                          isSelected
                            ? 'bg-white border-white text-black shadow-sm'
                            : 'bg-black border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-white'
                        }`}
                      >
                        {d.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Room & Teacher (Optional) */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-xs uppercase tracking-wider text-zinc-400 mb-1.5">
                    Room (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Room or building"
                    value={formRoom}
                    onChange={(e) => setFormRoom(e.target.value)}
                    className="w-full rounded border border-zinc-800 bg-black px-3 py-2 font-mono text-sm text-white placeholder-zinc-600 focus:border-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs uppercase tracking-wider text-zinc-400 mb-1.5">
                    Teacher (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Teacher / instructor"
                    value={formTeacher}
                    onChange={(e) => setFormTeacher(e.target.value)}
                    className="w-full rounded border border-zinc-800 bg-black px-3 py-2 font-mono text-sm text-white placeholder-zinc-600 focus:border-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Color Theme Selector */}
              <div>
                <label className="block font-mono text-xs uppercase tracking-wider text-zinc-400 mb-1.5">
                  Accent Color
                </label>
                <div className="flex items-center gap-2">
                  {COLOR_OPTIONS.map((c) => (
                    <button
                      type="button"
                      key={c.id}
                      onClick={() => setFormColor(c.id)}
                      className={`h-7 w-7 rounded-full transition-all flex items-center justify-center ${
                        c.bar
                      } ${
                        formColor === c.id
                          ? 'ring-2 ring-white ring-offset-2 ring-offset-black scale-110'
                          : 'opacity-60 hover:opacity-100'
                      }`}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>

              {/* Notes (Optional) */}
              <div>
                <label className="block font-mono text-xs uppercase tracking-wider text-zinc-400 mb-1.5">
                  Notes / Materials (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Notes, materials, or reminders"
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full rounded border border-zinc-800 bg-black px-3 py-2 font-mono text-sm text-white placeholder-zinc-600 focus:border-white focus:outline-none"
                />
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded border border-zinc-800 bg-zinc-900 px-4 py-2 font-mono text-xs text-zinc-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded border border-white bg-white px-5 py-2 font-mono text-xs font-bold uppercase tracking-wider text-black hover:bg-zinc-200 transition-all shadow"
                >
                  {editingClass ? 'Save Changes' : 'Create Class'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
