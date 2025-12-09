"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  format, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths,
  isPast,
  startOfDay
} from "date-fns";

export default function BookingsPage() {
  const router = useRouter();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    notes: "",
  });

  const handleDateSelect = (date: Date) => {
    if (isPast(startOfDay(date)) && !isSameDay(date, new Date())) {
      return; // Don't allow past dates
    }
    setSelectedDate(date);
    setFormData({ ...formData, date: format(date, "yyyy-MM-dd"), time: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate || !formData.time) {
      alert("Please select a date and time");
      return;
    }
    
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          date: format(selectedDate, "yyyy-MM-dd"),
        }),
      });

      if (response.ok) {
        alert("Booking request submitted successfully!");
        setFormData({
          name: "",
          email: "",
          phone: "",
          date: "",
          time: "",
          notes: "",
        });
        setSelectedDate(null);
      } else {
        alert("Booking failed. Please try again.");
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      alert("Booking failed. Please try again.");
    }
  };

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const timeSlots = [
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
    "5:00 PM",
  ];

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Get first day of week for the month start
  const firstDayOfWeek = monthStart.getDay();
  
  // Create array with empty cells for days before month starts
  const calendarDays = Array(firstDayOfWeek).fill(null).concat(daysInMonth);

  return (
    <div className="min-h-screen bg-white py-12 md:py-20">
      <div className="max-w-3xl mx-auto px-6 lg:px-12">
        <h1 className="text-5xl md:text-6xl mb-12 text-center tracking-normal">
          Schedule a Fitting
        </h1>

        <div className="border-2 border-black p-8 md:p-12 bg-white">
          <p className="text-sm font-medium mb-8 text-center text-black/70">
            Book an appointment with our expert tailors to ensure the perfect
            fit for your tuxedo.
          </p>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Calendar Section */}
            <div>
                <label className="block text-sm mb-6 tracking-normal">
                  Select Date *
                </label>
              
              {/* Calendar Header */}
              <div className="border-2 border-black mb-4">
                <div className="flex items-center justify-between p-4 bg-black text-white">
                  <button
                    type="button"
                    onClick={prevMonth}
                    className="text-sm tracking-normal hover:text-primary transition-colors"
                  >
                    ← Prev
                  </button>
                  <h3 className="text-xl tracking-normal">
                    {format(currentMonth, "MMMM yyyy")}
                  </h3>
                  <button
                    type="button"
                    onClick={nextMonth}
                    className="text-sm tracking-normal hover:text-primary transition-colors"
                  >
                    Next →
                  </button>
                </div>
                
                {/* Calendar Grid */}
                <div className="p-4 bg-white">
                  {/* Day Headers */}
                  <div className="grid grid-cols-7 gap-2 mb-2">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                      <div
                        key={day}
                        className="text-center text-xs tracking-normal py-2"
                      >
                        {day}
                      </div>
                    ))}
                  </div>
                  
                  {/* Calendar Days */}
                  <div className="grid grid-cols-7 gap-2">
                    {calendarDays.map((day, idx) => {
                      if (day === null) {
                        return <div key={idx} className="aspect-square" />;
                      }
                      
                      const isPastDate = isPast(startOfDay(day)) && !isSameDay(day, new Date());
                      const isSelected = selectedDate && isSameDay(day, selectedDate);
                      const isCurrentMonth = isSameMonth(day, currentMonth);
                      
                      return (
                        <button
                          key={day.toString()}
                          type="button"
                          onClick={() => handleDateSelect(day)}
                          disabled={isPastDate}
                          className={`aspect-square border-2 text-sm transition-colors ${
                            isSelected
                              ? "bg-primary text-white border-primary"
                              : isPastDate
                              ? "bg-white/30 text-black/30 border-black/30 cursor-not-allowed"
                              : isCurrentMonth
                              ? "bg-white text-black border-black hover:border-primary"
                              : "bg-white/50 text-black/50 border-black/50"
                          }`}
                        >
                          {format(day, "d")}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
              
              {selectedDate && (
                <p className="text-sm font-medium mt-4 tracking-normal">
                  Selected: {format(selectedDate, "EEEE, MMMM d, yyyy")}
                </p>
              )}
            </div>

            {/* Time Selection */}
            {selectedDate && (
              <div>
                <label className="block text-sm mb-4 tracking-normal">
                  Select Time *
                </label>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setFormData({ ...formData, time })}
                      className={`px-4 py-3 border-2 text-sm tracking-normal transition-colors ${
                        formData.time === time
                          ? "bg-primary text-white border-primary"
                          : "bg-white text-black border-black hover:border-primary"
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm mb-2 tracking-normal">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-black focus:border-primary focus:outline-none font-medium text-sm"
                />
              </div>
              <div>
                <label className="block text-sm mb-2 tracking-normal">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-black focus:border-primary focus:outline-none font-medium text-sm"
                />
              </div>
              <div>
                <label className="block text-sm mb-2 tracking-normal">
                  Phone *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-black focus:border-primary focus:outline-none font-medium text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Special Requests or Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                rows={4}
                    className="w-full px-4 py-3 border-2 border-black focus:border-primary focus:outline-none font-medium text-sm"
                placeholder="Any special requirements or questions..."
              />
            </div>

            <button
              type="submit"
                className="w-full bg-black hover:bg-primary text-white py-4 px-6 tracking-normal text-sm transition-colors border-2 border-black"
            >
              Book Appointment
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

