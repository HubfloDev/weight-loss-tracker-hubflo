'use client';
import { useState } from 'react';

const DatePicker = () => {
  const [isCalendarOpen, setCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(selectedDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(selectedDate.getFullYear());

  const toggleCalendar = () => {
    setCalendarOpen((prev) => !prev);
  };

  // Helper to get the number of days in a month
  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate(); // Get the last day of the month
  };

  // Helper to get the first day of the month (0 = Sunday, 1 = Monday, ...)
  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  // Create an array to map the days of the month
  const createDaysForMonth = (month, year) => {
    const daysInMonth = getDaysInMonth(month, year);
    const firstDay = getFirstDayOfMonth(month, year);

    // Create an array with empty spaces for days before the first day of the month
    const daysArray = Array(firstDay).fill(null);

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      daysArray.push(day);
    }

    return daysArray;
  };

  const days = createDaysForMonth(selectedMonth, selectedYear);

  const handleDateSelect = (day) => {
    if (day) {
      const newDate = new Date(selectedYear, selectedMonth, day);
      setSelectedDate(newDate);
      setCalendarOpen(false); // Close calendar after selection
    }
  };

  return (
    <>
      {/* Input Field */}
      <input
        type="text"
        value={selectedDate.toDateString()} // Display the selected date
        className="border p-2 rounded"
        onFocus={toggleCalendar} // Open calendar on input focus
        onClick={toggleCalendar} // Open calendar on input click
        readOnly // Prevent manual editing
      />

      {/* Calendar */}
      {isCalendarOpen && (
        <div className="p-3 space-y-0.5 border rounded-lg shadow-lg w-64">
          {/* Months Navigation */}
          <div className="grid grid-cols-5 items-center gap-x-3 mx-1.5 pb-3">
            {/* Prev Button */}
            <div className="col-span-1">
              <button
                type="button"
                className="size-8 flex justify-center items-center text-gray-800 hover:bg-gray-100 rounded-full focus:outline-none"
                aria-label="Previous"
                onClick={() =>
                  setSelectedMonth((prev) => (prev === 0 ? 11 : prev - 1))
                }>
                <svg
                  className="shrink-0 size-4"
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>
            </div>

            {/* Month / Year */}
            <div className="col-span-3 flex justify-center items-center gap-x-1">
              <span className="text-gray-800 dark:text-neutral-200">
                {new Date(selectedYear, selectedMonth).toLocaleString(
                  'default',
                  {
                    month: 'long'
                  }
                )}
              </span>
              <span className="text-gray-800 dark:text-neutral-200">/</span>
              <span className="text-gray-800 dark:text-neutral-200">
                {selectedYear}
              </span>
            </div>

            {/* Next Button */}
            <div className="col-span-1 flex justify-end">
              <button
                type="button"
                className="size-8 flex justify-center items-center text-gray-800 hover:bg-gray-100 rounded-full focus:outline-none"
                aria-label="Next"
                onClick={() =>
                  setSelectedMonth((prev) => (prev === 11 ? 0 : prev + 1))
                }>
                <svg
                  className="shrink-0 size-4"
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </div>
          </div>

          {/* Days of the Week */}
          <div className="grid grid-cols-7 text-center">
            {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((day) => (
              <span
                key={day}
                className="m-px w-10 block text-center text-sm text-gray-500">
                {day}
              </span>
            ))}
          </div>

          {/* Days in the Month */}
          <div className="grid grid-cols-7 text-center">
            {days.map((day, index) => (
              <button
                key={index}
                className={`m-px w-10 h-10 flex justify-center items-center rounded-full ${
                  day
                    ? 'text-gray-800 hover:bg-blue-100 hover:text-blue-600'
                    : 'text-gray-400 pointer-events-none'
                }`}
                onClick={() => handleDateSelect(day)}
                disabled={!day} // Disable if no day is present
              >
                {day || ''}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default DatePicker;
