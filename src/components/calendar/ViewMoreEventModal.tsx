import { Event } from "../../context/Events";
import { formatDate } from "../../utils/formatDate";
import Modal, { ModalProps } from "../Modal";
import CalendarEvent from "./CalendarEvent";

type ViewMoreEventModalProps = {
  events: Event[];
} & Omit<ModalProps, "children">;

export default function ViewMoreEventModal({
  events,
  ...modalProps
}: ViewMoreEventModalProps) {
  if (events.length === 0) return;
  return (
    <Modal {...modalProps}>
      <div className="modal-title">
        {formatDate(events[0].date, { dateStyle: "short" })}
        <button className="close-btn" onClick={modalProps.onClose}>
          &times;
        </button>
      </div>
      <div className="events">
        {events.map((event) => (
          <CalendarEvent event={event} key={event.id} />
        ))}
      </div>
    </Modal>
  );
}
