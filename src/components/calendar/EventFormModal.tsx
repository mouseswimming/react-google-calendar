import { FormEvent, Fragment, useId, useRef, useState } from "react";
import { UnionOmit } from "../../utils/types";
import Modal, { ModalProps } from "../Modal";
import { EVENT_COLORS } from "./const";
import { Event } from "../../context/Events";
import { formatDate } from "../../utils/formatDate";

type EventFormModalProps = {
  onSubmit: (event: UnionOmit<Event, "id">) => void;
} & (
  | { date: Date; event?: never; onDelete?: never }
  | { date?: never; event: Event; onDelete: () => void }
) &
  Omit<ModalProps, "children">;

export default function EventFormModal({
  onSubmit,
  onDelete,
  date,
  event,
  ...modalProps
}: EventFormModalProps) {
  const [isAllDay, setIsAllDay] = useState(event?.allDay || false);
  const [startTime, setStartTime] = useState("");
  const [selectedColor, setSelectedColor] = useState(
    event?.color || EVENT_COLORS[0]
  );
  const formId = useId();
  const nameRef = useRef<HTMLInputElement>(null);
  const endTimeRef = useRef<HTMLInputElement>(null);

  const isNew = event == null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const name = nameRef.current?.value;
    const endTime = endTimeRef.current?.value;

    if (name == null || name === "") return;

    const sharedProps = {
      name,
      date: date || event?.date,
      color: selectedColor,
    };

    let newEvent: UnionOmit<Event, "id">;

    if (isAllDay) {
      newEvent = { ...sharedProps, allDay: true };
    } else {
      if (
        startTime == null ||
        startTime === "" ||
        endTime == null ||
        endTime === ""
      )
        return;

      newEvent = { ...sharedProps, allDay: false, startTime, endTime };
    }

    modalProps.onClose();
    onSubmit(newEvent);
  };

  return (
    <Modal {...modalProps}>
      <div className="modal-title">
        <div>{isNew ? "Add" : "Edit"} Event</div>
        <small>{formatDate(date || event.date, { dateStyle: "short" })}</small>
        <button className="close-btn" onClick={modalProps.onClose}>
          &times;
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            id="name"
            defaultValue={event?.name}
            ref={nameRef}
            required
          />
        </div>
        <div className="form-group checkbox">
          <input
            type="checkbox"
            name="all-day"
            id="all-day"
            checked={isAllDay}
            onChange={(e) => setIsAllDay(e.target.checked)}
          />
          <label htmlFor="all-day">All Day?</label>
        </div>
        <div className="row">
          <div className="form-group">
            <label htmlFor="start-time">Start Time</label>
            <input
              type="time"
              name="start-time"
              id="start-time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              disabled={isAllDay}
            />
          </div>
          <div className="form-group">
            <label htmlFor="end-time">End Time</label>
            <input
              type="time"
              name="end-time"
              id="end-time"
              min={startTime}
              disabled={isAllDay}
              ref={endTimeRef}
              defaultValue={event?.endTime}
            />
          </div>
        </div>
        <div className="form-group">
          <label>Color</label>
          <div className="row left">
            {EVENT_COLORS.map((color) => (
              <Fragment key={color}>
                <input
                  type="radio"
                  name="color"
                  value={color}
                  id={`${formId}-${color}`}
                  checked={selectedColor === color}
                  onChange={() => setSelectedColor(color)}
                  className="color-radio"
                />
                <label htmlFor={`${formId}-${color}`}>
                  <span className="sr-only">{color}</span>
                </label>
              </Fragment>
            ))}
          </div>
        </div>
        <div className="row">
          <button className="btn btn-success" type="submit">
            {isNew ? "Add" : "Update"}
          </button>
          {onDelete != null && (
            <button onClick={onDelete} className="btn btn-delete" type="button">
              Delete
            </button>
          )}
        </div>
      </form>
    </Modal>
  );
}
