import Calendar from "./components/calendar/Calendar";
import { EventsProvider } from "./context/Events";

function App() {
  return (
    <>
      <EventsProvider>
        <Calendar />
      </EventsProvider>
    </>
  );
}

export default App;
