import React, { useState } from "react";
import axios from "axios";

function CreateJob() {
  const [form, setForm] = useState({
    title: "",
    slug: "",
    short_description: "",
    description: "",
    location: "",
    job_type: "full-time",
    experience: "",
    expires_at: "",
    salary_range: { min: "", max: "", currency: "INR" },
    requirements: [""],
    openings: "",
    application_instructions: "",
    attachment_url: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("salary_range.")) {
      const key = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        salary_range: { ...prev.salary_range, [key]: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleRequirementChange = (index, value) => {
    const updated = [...form.requirements];
    updated[index] = value;
    setForm({ ...form, requirements: updated });
  };

  const addRequirement = () => {
    setForm({ ...form, requirements: [...form.requirements, ""] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    const sanitizedForm = {
      ...form,
      salary_range: {
        ...form.salary_range,
        min: Number(form.salary_range.min),
        max: Number(form.salary_range.max),
      },
      openings: Number(form.openings),
    };
  
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/jobs`,
        sanitizedForm,
        { withCredentials: true }
      );
      alert("Job created successfully!");
      setForm({
        title: "",
        slug: "",
        short_description: "",
        description: "",
        location: "",
        job_type: "full-time",
        experience: "",
        expires_at: "",
        salary_range: { min: "", max: "", currency: "INR" },
        requirements: [""],
        openings: "",
        application_instructions: "",
        attachment_url: "",
      });
    } catch (err) {
      console.error("Error creating job:", err);
      alert("Error creating job");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 bg-white rounded">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Create Job</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <input
          type="text"
          name="title"
          placeholder="Job Title"
          value={form.title}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          required
        />

        {/* Slug */}
        <input
          type="text"
          name="slug"
          placeholder="Slug"
          value={form.slug}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        {/* Short Description */}
        <textarea
          name="short_description"
          placeholder="Short Description"
          rows={2}
          value={form.short_description}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          required
        />

        {/* Full Description */}
        <textarea
          name="description"
          placeholder="Full Job Description"
          rows={4}
          value={form.description}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          required
        />

        {/* Location & Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="location"
            placeholder="Location"
            value={form.location}
            onChange={handleChange}
            className="w-full border p-3 rounded"
            required
          />
          <select
            name="job_type"
            value={form.job_type}
            onChange={handleChange}
            className="w-full border p-3 rounded"
          >
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="internship">Internship</option>
          </select>
        </div>

        {/* Experience */}
        <input
          name="experience"
          placeholder="Experience required"
          value={form.experience}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        {/* Expiry */}
        <input
          type="date"
          name="expires_at"
          value={form.expires_at}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          required
        />

        {/* Salary Range */}
        <div className="grid grid-cols-3 gap-4">
          <input
            type="number"
            name="salary_range.min"
            placeholder="Min Salary"
            value={form.salary_range.min}
            onChange={handleChange}
            className="w-full border p-3 rounded"
          />
          <input
            type="number"
            name="salary_range.max"
            placeholder="Max Salary"
            value={form.salary_range.max}
            onChange={handleChange}
            className="w-full border p-3 rounded"
          />
          <input
            type="text"
            name="salary_range.currency"
            placeholder="Currency"
            value={form.salary_range.currency}
            onChange={handleChange}
            className="w-full border p-3 rounded"
          />
        </div>

        {/* Requirements */}
        <div>
          <label className="block mb-2 text-sm font-medium">Requirements</label>
          {form.requirements.map((req, i) => (
            <input
              key={i}
              type="text"
              placeholder={`Requirement ${i + 1}`}
              value={req}
              onChange={(e) => handleRequirementChange(i, e.target.value)}
              className="w-full mb-2 border p-3 rounded"
            />
          ))}
          <button
            type="button"
            onClick={addRequirement}
            className="text-blue-600 text-sm hover:underline"
          >
            + Add Requirement
          </button>
        </div>

        {/* Openings */}
        <input
          type="number"
          name="openings"
          placeholder="Number of Openings"
          value={form.openings}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        {/* Application Instructions */}
        <textarea
          name="application_instructions"
          placeholder="Application Instructions"
          rows={3}
          value={form.application_instructions}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        {/* Attachment URL */}
        <input
          type="url"
          name="attachment_url"
          placeholder="Attachment URL (PDF)"
          value={form.attachment_url}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-3 rounded font-medium hover:bg-green-700 transition"
        >
          {loading ? "Creating..." : "Create Job"}
        </button>
      </form>
    </div>
  );
}

export default CreateJob;
