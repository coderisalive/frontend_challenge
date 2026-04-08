import CalendarCard from './components/CalendarCard';

function App() {
  return (
    <div className="h-screen overflow-hidden bg-gray-200 py-4 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center font-sans">
      {/* Wall Decoration */}
      <div className="absolute top-0 w-full h-1/3 bg-gray-300 -z-10 shadow-inner"></div>

      {/* Main Calendar Card */}
      <div className="w-full max-w-6xl flex justify-center items-center scale-[0.70] transform-gpu origin-center">
        <CalendarCard />
      </div>
    </div>
  );
}

export default App;
