import { isSameMonth } from "date-fns/fp";
import { formatDate } from "../../utils/formatDate";
import { endOfDay, isBefore, isToday } from "date-fns";
import EventFormModal from "./EventFormModal";
import { useMemo, useState } from "react";
import { useEvents } from "../../context/useEvents";
import { Event } from "../../context/Events";
import CalendarEvent from "./CalendarEvent";
import OverflowContainer from "../OverflowContainer";
import ViewMoreEventModal from "./ViewMoreEventModal";

type CalendarDayProps = {
  day: Date;
  selectedMonth: Date;
  showWeekName: boolean;
  events: Event[];
};

const timeToNumber = (time: string) => parseFloat(time.replace(":", "."));

export default function CalendarDay({
  day,
  selectedMonth,
  showWeekName,
  events,
}: CalendarDayProps) {
  const isPreviousDay = isBefore(endOfDay(day), new Date());
  const [isNewEventModalOpen, setIsNewEventModalOpen] = useState(false);
  const [isViewMoreEventsModalOpen, setIsViewMoreEventsModalOpen] =
    useState(false);

  const { addEvent } = useEvents();

  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => {
      if (a.allDay && b.allDay) {
        return 0;
      } else if (a.allDay) {
        return -1;
      } else if (b.allDay) {
        return 1;
      } else {
        return timeToNumber(a.startTime) - timeToNumber(b.startTime);
      }
    });
  }, [events]);

  return (
    <>
      <div
        className={`day ${
          !isSameMonth(day, selectedMonth) && "non-month-day"
        } ${isPreviousDay && "old-month-day"}`}
      >
        <div className="day-header">
          {showWeekName && (
            <div className="week-name">
              {formatDate(day, { weekday: "short" })}
            </div>
          )}
          <div className={`day-number ${isToday(day) && "today"}`}>
            {formatDate(day, { day: "numeric" })}
          </div>
          <button
            className="add-event-btn"
            onClick={() => setIsNewEventModalOpen(true)}
          >
            +
          </button>
        </div>
        <OverflowContainer
          className="events"
          items={sortedEvents}
          getKey={(event) => event.id}
          renderItem={(event) => <CalendarEvent event={event} />}
          renderOverflow={(overflowNum) => (
            <>
              <button
                className="events-view-more-btn"
                onClick={() => setIsViewMoreEventsModalOpen(true)}
              >
                +{overflowNum} More
              </button>
              <ViewMoreEventModal
                isOpen={isViewMoreEventsModalOpen}
                onClose={() => setIsViewMoreEventsModalOpen(false)}
                events={sortedEvents}
              />
            </>
          )}
        />
      </div>
      <EventFormModal
        isOpen={isNewEventModalOpen}
        onClose={() => setIsNewEventModalOpen(false)}
        onSubmit={addEvent}
        date={day}
      />
    </>
  );
}
