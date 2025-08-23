import React, { useState } from "react";

function AcademicCalendar() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    allDay: true,
    category: "Exam",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting Event:", formData);

    try {
      const year = new Date().getFullYear();

      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/student/acedemic/${year}/events`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) throw new Error("Failed to add event");
      const result = await response.json();
      alert("Event added successfully!");
      console.log(result);

      setFormData({
        title: "",
        description: "",
        startDate: "",
        endDate: "",
        allDay: true,
        category: "Exam",
      });
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow mt-6">
      <h2 className="text-xl font-semibold mb-4 text-center">
        Add Academic Event
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full mt-1 px-3 py-2 border rounded"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full mt-1 px-3 py-2 border rounded"
          ></textarea>
        </div>

        {/* Start Date */}
        <div>
          <label className="block text-sm font-medium">Start Date</label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
            className="w-full mt-1 px-3 py-2 border rounded"
          />
        </div>

        {/* End Date */}
        <div>
          <label className="block text-sm font-medium">End Date</label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            required
            className="w-full mt-1 px-3 py-2 border rounded"
          />
        </div>

        {/* All Day */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="allDay"
            checked={formData.allDay}
            onChange={handleChange}
          />
          <label className="text-sm font-medium">All Day Event</label>
        </div>

        {/* Category */}
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full mt-1 px-3 py-2 border rounded"
        >
          <option value="Term">Term</option>
          <option value="Exam">Exam</option>
          <option value="Holiday">Holiday</option>
          <option value="Other">Other</option>
        </select>

        <button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded font-medium"
        >
          Submit Event
        </button>
      </form>
    </div>
  );
}

export default AcademicCalendar;
