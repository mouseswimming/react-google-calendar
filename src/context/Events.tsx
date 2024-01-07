import { ReactNode, createContext, useEffect, useState } from "react";
import { EVENT_COLORS } from "../components/calendar/const";
import { UnionOmit } from "../utils/types";

export type Event = {
  date: Date;
  name: string;
  id: string;
  color: (typeof EVENT_COLORS)[number];
} & (
  | {
      allDay: false;
      startTime: string;
      endTime: string;
    }
  | { allDay: true; startTime?: never; endTime?: never }
);

type EventsContext = {
  events: Event[];
  addEvent: (event: UnionOmit<Event, "id">) => void;
  updateEvent: (id: string, event: UnionOmit<Event, "id">) => void;
  deleteEvent: (id: string) => void;
};

export const Context = createContext<EventsContext | null>(null);

type EventsProviderProps = { children: ReactNode };
export function EventsProvider({ children }: EventsProviderProps) {
  const [events, setEvents] = useLocalStorage("EVENTS", []);

  const addEvent = (eventDetail: UnionOmit<Event, "id">) => {
    setEvents((e) => [...e, { ...eventDetail, id: crypto.randomUUID() }]);
  };

  const updateEvent = (id: string, eventDetail: UnionOmit<Event, "id">) => {
    setEvents((e) =>
      e.map((event) => {
        if (event.id === id) {
          return { id, ...eventDetail };
        }
        return event;
      })
    );
  };

  const deleteEvent = (id: string) => {
    setEvents((e) => e.filter((event) => event.id !== id));
  };

  return (
    <Context.Provider value={{ events, addEvent, updateEvent, deleteEvent }}>
      {children}
    </Context.Provider>
  );
}

function useLocalStorage(key: string, initialValue: Event[]) {
  const [value, setValue] = useState<Event[]>(() => {
    const saved = localStorage.getItem(key);

    if (saved == null) return initialValue;

    return (JSON.parse(saved) as Event[]).map((event) => {
      if (event.date instanceof Date) return event;
      return { ...event, date: new Date(event.date) };
    });
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value, key]);

  return [value, setValue] as const;
}
