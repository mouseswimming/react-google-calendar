import { useMemo, useState } from "react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  isSameDay,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { formatDate } from "../../utils/formatDate";
import CalendarDay from "./CalendarDay";
import { useEvents } from "../../context/useEvents";

export default function Calendar() {
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const { events } = useEvents();

  // calendarDays won't change unless selected month change.
  // leave it in memo so this don't need re-run everytime
  const calendarDays = useMemo(() => {
    return eachDayOfInterval({
      start: startOfWeek(startOfMonth(selectedMonth)),
      end: endOfWeek(endOfMonth(selectedMonth)),
    });
  }, [selectedMonth]);

  return (
    <div className="calendar">
      <div className="header">
        <button className="btn" onClick={() => setSelectedMonth(new Date())}>
          Today
        </button>
        <div>
          <button
            className="month-change-btn"
            onClick={() => setSelectedMonth((m) => addMonths(m, -1))}
          >
            &lt;
          </button>
          <button
            className="month-change-btn"
            onClick={() => setSelectedMonth((m) => addMonths(m, 1))}
          >
            &gt;
          </button>
        </div>
        <span className="month-title">
          {formatDate(selectedMonth, { month: "long", year: "numeric" })}
        </span>
      </div>

      <div className="days">
        {calendarDays.map((day, index) => (
          <CalendarDay
            key={day.getTime()}
            day={day}
            selectedMonth={selectedMonth}
            showWeekName={index < 7 ? true : false}
            events={events.filter((event) => isSameDay(event.date, day))}
          />
        ))}
      </div>
    </div>
  );
}
