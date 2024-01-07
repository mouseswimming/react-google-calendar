import { parse } from "date-fns";
import { Event } from "../../context/Events";
import { formatDate } from "../../utils/formatDate";
import EventFormModal from "./EventFormModal";
import { useState } from "react";
import { useEvents } from "../../context/useEvents";

type CalendarEventProps = {
  event: Event;
};

export default function CalendarEvent({ event }: CalendarEventProps) {
  const [isEditEventModalOpen, setIsEditModalOpen] = useState(false);
  const { updateEvent, deleteEvent } = useEvents();
  return (
    <>
      <button
        className={`event ${event.allDay && "all-day-event"} ${event.color}`}
        onClick={() => setIsEditModalOpen(true)}
      >
        {!event.allDay && (
          <>
            <div className={`color-dot ${event.color}`}></div>
            <div className="event-time">
              {formatDate(parse(event.startTime, "HH:mm", event.date), {
                timeStyle: "short",
              })}
            </div>
          </>
        )}
        <div className="event-name">{event.name}</div>
      </button>
      <EventFormModal
        isOpen={isEditEventModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        event={event}
        onSubmit={(e) => updateEvent(event.id, e)}
        onDelete={() => deleteEvent(event.id)}
      />
    </>
  );
}
