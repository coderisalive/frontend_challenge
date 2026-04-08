import { useState, useMemo, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import heroImg from '../assets/hero-calendar.png';

const DAYS_OF_WEEK = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const CalendarCard = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [notes, setNotes] = useState("");
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [isDark, setIsDark] = useState(false);
  const [viewDate, setViewDate] = useState(new Date());
  const [isFlipping, setIsFlipping] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [targetDate, setTargetDate] = useState(new Date());
  const [isYearOpen, setIsYearOpen] = useState(false);
  const [isMonthOpen, setIsMonthOpen] = useState(false);

  // Persistence
  useEffect(() => {
    const savedNotes = localStorage.getItem('calendar_notes_v2');
    const savedTodos = localStorage.getItem('calendar_todos_v2');
    const savedIsDark = localStorage.getItem('calendar_isdark_v2');
    if (savedNotes) setNotes(savedNotes);
    if (savedTodos) setTodos(JSON.parse(savedTodos));
    if (savedIsDark) setIsDark(JSON.parse(savedIsDark));
  }, []);

  useEffect(() => {
    localStorage.setItem('calendar_notes_v2', notes);
    localStorage.setItem('calendar_todos_v2', JSON.stringify(todos));
    localStorage.setItem('calendar_isdark_v2', JSON.stringify(isDark));
  }, [notes, todos, isDark]);

  // Parse notes for "colorful" dates
  const colorfulDates = useMemo(() => {
    const dates = new Set();
    if (!notes) return dates;

    // Pattern for "Day Month -> text" or "Day Month - Day Month -> text"
    const lines = notes.split('\n');
    lines.forEach(line => {
      const match = line.match(/^(\d+\s+\w+)(?:\s+-\s+(\d+\s+\w+))?\s*->\s*(.+)$/);
      if (match && match[3].trim().length > 0) {
        const startStr = match[1];
        const endStr = match[2];

        if (endStr) {
          // It's a range. Find all dates between startStr and endStr
          // For simplicity and since year isn't in prefix, we'll match by Month + Day
          dates.add(startStr);
          dates.add(endStr);
          // (Actually, checking the middle on every render is expensive without year, 
          // let's just highlight the exact strings for now, or expand if possible)
        } else {
          dates.add(startStr);
        }
      }
    });
    return dates;
  }, [notes]);

  const fileInputRef = useRef(null);
  const yearListRef = useRef(null);
  const monthListRef = useRef(null);

  useEffect(() => {
    if (isYearOpen && yearListRef.current) {
      const activeEl = yearListRef.current.querySelector('.active-year');
      if (activeEl) {
        setTimeout(() => {
          yearListRef.current.scrollTop = activeEl.offsetTop - (yearListRef.current.offsetHeight / 2) + (activeEl.offsetHeight / 2);
        }, 10);
      }
    }
  }, [isYearOpen]);

  useEffect(() => {
    if (isMonthOpen && monthListRef.current) {
      const activeEl = monthListRef.current.querySelector('.active-month');
      if (activeEl) {
        setTimeout(() => {
          monthListRef.current.scrollTop = activeEl.offsetTop - (monthListRef.current.offsetHeight / 2) + (activeEl.offsetHeight / 2);
        }, 10);
      }
    }
  }, [isMonthOpen]);

  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const triggerFlip = (newDate, offset) => {
    if (isFlipping) return;
    setIsFlipping(true);

    const isFrontVisible = Math.abs(rotation % 360) === 0;

    if (isFrontVisible) {
      setTargetDate(newDate);
    } else {
      setViewDate(newDate);
    }

    setRotation(prev => prev + (offset > 0 ? -180 : 180));

    setTimeout(() => {
      setIsFlipping(false);
    }, 700);
  };

  const changeMonth = (offset, sourceDate) => {
    const newDate = new Date(sourceDate.getFullYear(), sourceDate.getMonth() + offset, 1);
    triggerFlip(newDate, offset);
  };

  const changeYear = (offset, sourceDate) => {
    const newDate = new Date(sourceDate.getFullYear() + offset, sourceDate.getMonth(), 1);
    triggerFlip(newDate, offset);
  };

  const addTodo = (e) => {
    if (e.key === 'Enter' && newTodo.trim()) {
      setTodos([...todos, { id: Date.now(), text: newTodo, completed: false }]);
      setNewTodo("");
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAttachments([...attachments, { id: Date.now(), name: file.name }]);
    }
  };

  const removeAttachment = (id) => {
    setAttachments(attachments.filter(a => a.id !== id));
  };



  const handleDateClick = (date) => {
    let newStart = startDate;
    let newEnd = endDate;

    if (startDate && !endDate && date.getTime() === startDate.getTime()) {
      newStart = null;
      newEnd = null;
    } else if (!startDate || (startDate && endDate)) {
      newStart = date;
      newEnd = null;
    } else if (date > startDate) {
      newEnd = date;
    } else {
      newStart = date;
      newEnd = null;
    }

    setStartDate(newStart);
    setEndDate(newEnd);

    // Auto-generate note template at the top
    if (newStart) {
      const sStr = `${newStart.getDate()} ${MONTHS[newStart.getMonth()]}`;
      let line = "";
      if (newEnd) {
        const eStr = `${newEnd.getDate()} ${MONTHS[newEnd.getMonth()]}`;
        line = `${sStr} - ${eStr} -> `;
      } else {
        line = `${sStr} -> `;
      }

      // Prepend only if this specific prefix doesn't exist already
      if (!notes.includes(line)) {
        setNotes(prev => line + (prev.length > 0 ? "\n" + prev : ""));
      }
    }
  };

  const getSelectionClass = (date) => {
    if (!startDate) return '';
    const d = date.getTime();
    const s = startDate.getTime();
    if (endDate) {
      const e = endDate.getTime();
      if (d === s) return 'bg-blue-600 text-white rounded-l-full scale-105 z-20 shadow-md';
      if (d === e) return 'bg-blue-600 text-white rounded-r-full scale-105 z-20 shadow-md';
      if (d > s && d < e) return isDark ? 'bg-blue-900/40 text-blue-200' : 'bg-blue-100 text-blue-800';
    } else {
      if (d === s) return 'bg-blue-600 text-white rounded-full scale-105 z-20 shadow-md';
    }
    return '';
  };

  const isWeekend = (index) => {
    const dayOfWeek = index % 7;
    return dayOfWeek === 5 || dayOfWeek === 6;
  };

  const renderCalendarPage = (date) => {
    // Generate days for this specific date
    const days = [];
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startOffset - 1; i >= 0; i--) {
      const day = prevMonthLastDay - i;
      days.push({
        day,
        month: 'prev',
        id: `prev-${day}-${date.getTime()}`,
        date: new Date(year, month - 1, day)
      });
    }

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        month: 'current',
        id: `curr-${i}-${date.getTime()}`,
        date: new Date(year, month, i)
      });
    }

    const remainingSlots = 42 - days.length;
    for (let i = 1; i <= remainingSlots; i++) {
      days.push({
        day: i,
        month: 'next',
        id: `next-${i}-${date.getTime()}`,
        date: new Date(year, month + 1, i)
      });
    }

    return (
      <div className="calendar-page-container group flex flex-col lg:flex-row bg-white dark:bg-[#121212] transform rotate-[0.2deg] relative z-20 border dark:border-gray-800 transition-all duration-500 rounded-[40px] shadow-2xl">
        {/* Silver Pill Binder Header - Included inside flipping face */}
        <div className="flex justify-around px-12 absolute -top-4 left-0 right-0 z-40">
          {[...Array(14)].map((_, i) => (
            <div key={i} className="silver-pill" title="Binder Loop"></div>
          ))}
        </div>
        {/* Synchronized Perfect Circular Holes */}
        <div className="absolute top-[1.4rem] left-[16%] -translate-x-1/2 w-2 h-2 bg-[#111827] dark:bg-black rounded-full z-30 shadow-inner border border-gray-900"></div>
        <div className="absolute top-[1.4rem] left-[84%] -translate-x-1/2 w-2 h-2 bg-[#111827] dark:bg-black rounded-full z-30 shadow-inner border border-gray-900"></div>

        {/* Left/Top Hero Section */}
        <div className="lg:w-[62%] relative h-80 lg:h-auto min-h-[450px] overflow-hidden rounded-t-[40px] lg:rounded-tr-none lg:rounded-l-[40px]">
          <img
            src={heroImg}
            alt="Mountain Climber"
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-in-out dark:opacity-60"
          />
          <div className="absolute bottom-0 right-0 left-0 h-1/2 text-white p-8 flex flex-col justify-end items-end">
            <div
              className="absolute inset-0 bg-blue-600/95 dark:bg-blue-900/80 transition-colors duration-500"
              style={{ clipPath: 'polygon(0 85%, 100% 25%, 100% 100%, 0% 100%)' }}
            ></div>
            <div className="text-right flex flex-col items-end relative z-10 w-full">
              {/* Year Navigation */}
              <div className="flex items-center gap-4 mb-2 group">
                <button
                  onClick={(e) => { e.stopPropagation(); changeYear(-1, date); }}
                  disabled={isFlipping}
                  className={`p-1 rounded-full hover:bg-white/10 transition-colors opacity-40 group-hover:opacity-100 ${isFlipping ? 'cursor-not-allowed' : ''}`}
                >
                  &lt;
                </button>
                <div className="relative z-50">
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isFlipping) setIsYearOpen(!isYearOpen);
                      setIsMonthOpen(false);
                    }}
                    className={`text-xl font-bold tracking-tight opacity-70 mb-0 cursor-pointer hover:opacity-100 transition-opacity ${isFlipping ? 'cursor-not-allowed' : ''}`}
                  >
                    {date.getFullYear()}
                  </div>

                  {isYearOpen && (
                    <>
                      <div className="fixed inset-0 z-40 cursor-default" onClick={(e) => { e.stopPropagation(); setIsYearOpen(false); }}></div>
                      <div ref={yearListRef} className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-24 max-h-48 overflow-y-auto bg-white/95 dark:bg-[#1a1a1a]/95 backdrop-blur-md rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 custom-scrollbar py-2 text-center scale-100 transition-all origin-bottom text-gray-900 border-b-4 border-b-blue-600 dark:border-b-blue-500">
                        {Array.from({ length: 41 }, (_, i) => date.getFullYear() - 20 + i).map(year => (
                          <div
                            key={year}
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsYearOpen(false);
                              if (year === date.getFullYear()) return;
                              const newDate = new Date(year, date.getMonth(), 1);
                              triggerFlip(newDate, year > date.getFullYear() ? 1 : -1);
                            }}
                            className={`py-2 text-base font-bold cursor-pointer hover:bg-blue-500 hover:text-white dark:hover:bg-blue-600 transition-colors ${year === date.getFullYear() ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-gray-800 active-year' : 'text-gray-700 dark:text-gray-200'}`}
                          >
                            {year}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); changeYear(1, date); }}
                  disabled={isFlipping}
                  className={`p-1 rounded-full hover:bg-white/10 transition-colors opacity-40 group-hover:opacity-100 ${isFlipping ? 'cursor-not-allowed' : ''}`}
                >
                  &gt;
                </button>
              </div>

              {/* Month Navigation */}
              <div className="flex items-center gap-2 group">
                <button
                  onClick={(e) => { e.stopPropagation(); changeMonth(-1, date); }}
                  disabled={isFlipping}
                  className={`text-2xl p-2 rounded-full hover:bg-white/10 transition-colors opacity-40 group-hover:opacity-100 ${isFlipping ? 'cursor-not-allowed' : ''}`}
                >
                  &lt;
                </button>
                <div className="relative z-50">
                  <h2
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isFlipping) setIsMonthOpen(!isMonthOpen);
                      setIsYearOpen(false);
                    }}
                    className={`text-4xl lg:text-6xl font-black uppercase tracking-tighter leading-none cursor-pointer hover:opacity-80 transition-opacity ${isFlipping ? 'cursor-not-allowed opacity-50' : ''}`}
                  >
                    {MONTHS[date.getMonth()]}
                  </h2>

                  {isMonthOpen && (
                    <>
                      <div className="fixed inset-0 z-40 cursor-default" onClick={(e) => { e.stopPropagation(); setIsMonthOpen(false); }}></div>
                      <div ref={monthListRef} className="absolute bottom-full right-0 mb-4 w-48 max-h-60 overflow-y-auto bg-white/95 dark:bg-[#1a1a1a]/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 custom-scrollbar py-3 text-center scale-100 transition-all origin-bottom-right border-b-4 border-b-blue-600 dark:border-b-blue-500">
                        {MONTHS.map((month, index) => (
                          <div
                            key={month}
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsMonthOpen(false);
                              if (index === date.getMonth()) return;
                              const newDate = new Date(date.getFullYear(), index, 1);
                              triggerFlip(newDate, index > date.getMonth() ? 1 : -1);
                            }}
                            className={`py-2 text-lg font-bold uppercase tracking-wider cursor-pointer hover:bg-blue-500 hover:text-white dark:hover:bg-blue-600 transition-colors ${index === date.getMonth() ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-gray-800 active-month' : 'text-gray-700 dark:text-gray-300'}`}
                          >
                            {month}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); changeMonth(1, date); }}
                  disabled={isFlipping}
                  className={`text-2xl p-2 rounded-full hover:bg-white/10 transition-colors opacity-40 group-hover:opacity-100 ${isFlipping ? 'cursor-not-allowed' : ''}`}
                >
                  &gt;
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right/Bottom Calendar Section */}
        <div className="lg:w-[38%] p-8 lg:p-12 flex flex-col justify-between bg-white dark:bg-[#121212] border-l border-gray-50 dark:border-gray-800 transition-colors duration-500 rounded-b-[40px] lg:rounded-bl-none lg:rounded-r-[40px]">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-[12px] font-black text-gray-900 dark:text-gray-100 tracking-[0.2em]">NOTES</h3>
              <button
                onClick={() => fileInputRef.current.click()}
                className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-all border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                title="Attach File"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.414a4 4 0 00-5.656-5.656l-6.415 6.414a6 6 0 108.486 8.486L20.5 13" />
                </svg>
              </button>
              <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
            </div>
            <div className="relative group">
              <textarea
                className="w-full h-32 p-0 bg-transparent border-none focus:ring-0 outline-none resize-none text-sm leading-8 font-medium text-gray-800 dark:text-white placeholder-gray-600 dark:placeholder-gray-300 relative z-10"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
              <div className="absolute inset-0 pt-1 pointer-events-none">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="border-b border-gray-400 dark:border-white h-8"></div>
                ))}
              </div>
            </div>

            {attachments.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2 animate-fade-in">
                {attachments.map(file => (
                  <div key={file.id} className="flex items-center bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 px-2 py-1 rounded-md group hover:border-blue-200 dark:hover:border-blue-900 transition-all">
                    <svg className="w-3 h-3 text-blue-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-[11px] font-bold text-gray-500 dark:text-gray-500 truncate max-w-[120px]">{file.name}</span>
                    <button onClick={() => removeAttachment(file.id)} className="ml-2 text-gray-300 dark:text-gray-700 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mb-10">
            <h3 className="text-[12px] font-black text-gray-900 dark:text-gray-100 mb-4 tracking-[0.2em]">TODO LIST</h3>
            <input
              type="text"
              className="w-full bg-transparent border-b border-gray-400 dark:border-white pb-2 mb-4 outline-none text-sm placeholder-gray-600 dark:placeholder-gray-300 font-medium focus:border-blue-400 dark:focus:border-blue-500 text-gray-900 dark:text-white transition-colors"
              placeholder="Add a task + Enter"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyDown={addTodo}
            />
            <div className="max-h-48 overflow-y-auto space-y-3 custom-scrollbar pr-2">
              {todos.map(todo => (
                <div key={todo.id} className="flex items-center group animate-slide-in">
                  <button onClick={() => toggleTodo(todo.id)} className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${todo.completed ? 'bg-blue-500 border-blue-500' : 'border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-600'}`}>
                    {todo.completed && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                  </button>
                  <span className={`ml-3 text-sm font-medium transition-all ${todo.completed ? 'text-gray-300 dark:text-gray-600 line-through' : 'text-gray-800 dark:text-gray-200'}`}>{todo.text}</span>
                  <button onClick={() => deleteTodo(todo.id)} className="ml-auto opacity-0 group-hover:opacity-100 text-gray-300 dark:text-gray-700 hover:text-red-400 transition-all">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              ))}
              {todos.length === 0 && <p className="text-[12px] text-gray-500 dark:text-gray-300 font-medium italic">No tasks for today...</p>}
            </div>
          </div>

          <div>
            <div className="grid grid-cols-7 mb-4">
              {DAYS_OF_WEEK.map((day, i) => (
                <div key={day} className={`text-[11px] font-black tracking-widest text-center ${i >= 5 ? 'text-blue-500 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300'}`}>{day}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {days.map((dayObj, index) => (
                <div
                  key={dayObj.id}
                  onClick={() => handleDateClick(dayObj.date)}
                  className={`
                      relative py-3 flex items-center justify-center text-[13px] font-bold cursor-pointer transition-all duration-300 rounded-lg
                      ${dayObj.month === 'current' ? 'text-gray-800 dark:text-white' : 'text-gray-300 dark:text-gray-600'}
                      ${isWeekend(index) && dayObj.month === 'current' && !startDate ? 'text-blue-500 dark:text-blue-400' : ''}
                      ${getSelectionClass(dayObj.date)}
                      ${isToday(dayObj.date) && !getSelectionClass(dayObj.date) ? 'bg-gray-200 dark:bg-gray-800' : ''}
                      hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:shadow-md hover:scale-110 z-10
                    `}
                >
                  <span className="relative z-10">{dayObj.day}</span>
                  {isToday(dayObj.date) && (
                    <div className="absolute inset-2 border-2 border-gray-300 dark:border-gray-600 rounded-full pointer-events-none opacity-60"></div>
                  )}
                  {/* Colorful marker if date has notes */}
                  {(() => {
                    const dayStr = `${dayObj.date.getDate()} ${MONTHS[dayObj.date.getMonth()]}`;
                    if (colorfulDates.has(dayStr)) {
                      return <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>;
                    }
                    return null;
                  })()}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto my-12 p-4 bg-transparent flex flex-col items-center relative select-none transition-colors duration-500">

      {/* Theme Toggle Button via Portal */}
      {typeof document !== 'undefined' && createPortal(
        <button
          onClick={() => setIsDark(!isDark)}
          className="fixed top-6 right-6 z-[9999] p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
          title={isDark ? "Switch to Normal Mode" : "Switch to Dark Mode"}
        >
          {isDark ? (
            <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" /></svg>
          ) : (
            <svg className="w-6 h-6 text-gray-700" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>
          )}
        </button>,
        document.body
      )}

      {/* Static Wall Mounting Hole - Fades out during flip */}
      <div
        className={`calendar-hole z-30 transition-all duration-300 ${isFlipping ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}`}
      >
        <div className="calendar-nail"></div>
      </div>

      {/* Hanging Strings - Fades out during flip */}
      <svg
        className={`absolute top-[2px] left-0 w-full h-[105px] pointer-events-none z-10 transition-all duration-500 ${isFlipping ? 'opacity-0 translate-y-[-10px]' : 'opacity-100 translate-y-0'}`}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path
          d="M 50 15 L 16 78 M 50 15 L 84 78"
          stroke={isDark ? "#000000" : "#111827"}
          strokeWidth="1.8"
          fill="none"
          strokeLinecap="round"
          className={`opacity-80 transition-colors duration-500 ${isDark ? 'drop-shadow-[0_1px_3px_rgba(255,255,255,0.4)]' : 'drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]'}`}
        />
      </svg>

      <div className="w-full relative mt-6 px-4 lg:px-0">
        <div className="calendar-container-3d relative z-20">
          <div className="calendar-inner" style={{ transform: `rotateY(${rotation}deg)` }}>
            <div className="face face-front">
              {renderCalendarPage(viewDate)}
            </div>
            <div className="face face-back">
              {renderCalendarPage(targetDate)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarCard;
