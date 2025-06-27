import { useState } from "react";
import { FiPlus } from "react-icons/fi";

const CourseCreationForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    thumbnail_url: "",
    instructor_image: "",
    preview_video_url: "",
    is_free: false,
    instructor_name: "",
    category: "Web Development",
    language: "English",
    level: "Intermediate",
    price: 0,
    discount_price: 0,
    tags: [],
    validity_days: 90,
    materials: [],
  });

  const [currentMaterial, setCurrentMaterial] = useState({
    title: "",
    file_url: "",
    file_type: "pdf",
  });
  const [tagInput, setTagInput] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
  
    let newValue = type === "checkbox" ? checked : value;
  
    // Convert to number if the input type is number and value isn't empty
    if (type === "number" && value !== "") {
      newValue = Number(value);
      // Ensure we don't set NaN
      if (isNaN(newValue)) {
        newValue = 0;
      }
    }
  
    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const addMaterial = () => {
    if (
      currentMaterial.title &&
      currentMaterial.file_url &&
      currentMaterial.file_type
    ) {
      setFormData((prev) => ({
        ...prev,
        materials: [...prev.materials, currentMaterial],
      }));
      setCurrentMaterial({ title: "", file_url: "", file_type: "pdf" });
    }
  };

  const removeMaterial = (index) => {
    setFormData((prev) => ({
      ...prev,
      materials: prev.materials.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/courses`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        alert("Course created successfully!");
        setFormData({
          title: "",
          slug: "",
          description: "",
          thumbnail_url: "",
          instructor_image: "",
          preview_video_url: "",
          is_free: false,
          instructor_name: "",
          category: "Web Development",
          language: "English",
          level: "Intermediate",
          price: 0,
          discount_price: 0,
          tags: [],
          validity_days: 90,
          materials: [],
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create course");
      }
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow"
    >
      <h2 className="text-2xl font-bold mb-4">Create Course</h2>

      {/* Title */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          minLength={3}
          className="w-full px-3 py-2 border border-gray-300 rounded"
        />
      </div>

      {/* Slug */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Slug</label>
        <input
          type="text"
          name="slug"
          value={formData.slug}
          onChange={handleChange}
          required
          minLength={3}
          className="w-full px-3 py-2 border border-gray-300 rounded"
        />
      </div>

      {/* Description */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          minLength={10}
          className="w-full px-3 py-2 border border-gray-300 rounded"
        />
      </div>

      {/* Thumbnail URL */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Thumbnail URL</label>
        <input
          type="url"
          name="thumbnail_url"
          value={formData.thumbnail_url}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded"
        />
      </div>

      {/* Instructor Image */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Instructor Image URL</label>
        <input
          type="url"
          name="instructor_image"
          value={formData.instructor_image}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded"
        />
      </div>

      {/* Preview Video URL */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Preview Video URL (Optional)</label>
        <input
          type="url"
          name="preview_video_url"
          value={formData.preview_video_url}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded"
        />
      </div>

      {/* Is Free */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Is Free</label>
        <input
          type="checkbox"
          name="is_free"
          checked={formData.is_free}
          onChange={handleChange}
          className="ml-2"
        />
      </div>

      {/* Instructor Name */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Instructor Name</label>
        <input
          type="text"
          name="instructor_name"
          value={formData.instructor_name}
          onChange={handleChange}
          required
          minLength={3}
          className="w-full px-3 py-2 border border-gray-300 rounded"
        />
      </div>

      {/* Category */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Category</label>
        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          minLength={2}
          className="w-full px-3 py-2 border border-gray-300 rounded"
        />
      </div>

      {/* Language */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Language</label>
        <input
          type="text"
          name="language"
          value={formData.language}
          onChange={handleChange}
          required
          minLength={2}
          className="w-full px-3 py-2 border border-gray-300 rounded"
        />
      </div>

      {/* Level */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Level</label>
        <select
          name="level"
          value={formData.level}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded"
        >
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
      </div>

      {/* Price */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Price</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          required
          min="0"
          step="0.01"
          className="w-full px-3 py-2 border border-gray-300 rounded"
        />
      </div>

      {/* Discount Price */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Discount Price (Optional)</label>
        <input
          type="number"
          name="discount_price"
          value={formData.discount_price}
          onChange={handleChange}
          min="0"
          step="0.01"
          className="w-full px-3 py-2 border border-gray-300 rounded"
        />
      </div>

      {/* Validity Days */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Validity Days</label>
        <input
          type="number"
          name="validity_days"
          value={formData.validity_days}
          onChange={handleChange}
          min="1"
          className="w-full px-3 py-2 border border-gray-300 rounded"
        />
      </div>

      {/* Tags */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Tags</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder="Add a tag"
            className="flex-1 px-3 py-2 border border-gray-300 rounded"
          />
          <button
            type="button"
            onClick={addTag}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            <FiPlus />
          </button>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {formData.tags.map((tag, i) => (
            <span
              key={i}
              className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm flex items-center"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-1 text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Materials */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Materials</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            type="text"
            value={currentMaterial.title}
            onChange={(e) =>
              setCurrentMaterial({ ...currentMaterial, title: e.target.value })
            }
            placeholder="Title"
            minLength={2}
            className="px-3 py-2 border border-gray-300 rounded"
          />
          <input
            type="url"
            value={currentMaterial.file_url}
            onChange={(e) =>
              setCurrentMaterial({
                ...currentMaterial,
                file_url: e.target.value,
              })
            }
            placeholder="File URL"
            className="px-3 py-2 border border-gray-300 rounded"
          />
          <select
            value={currentMaterial.file_type}
            onChange={(e) =>
              setCurrentMaterial({
                ...currentMaterial,
                file_type: e.target.value,
              })
            }
            className="px-3 py-2 border border-gray-300 rounded"
          >
            <option value="pdf">PDF</option>
            <option value="doc">DOC</option>
            <option value="image">Image</option>
          </select>
        </div>
        <button
          type="button"
          onClick={addMaterial}
          className="mt-3 px-4 py-2 bg-green-600 text-white rounded"
        >
          Add Material
        </button>
        <ul className="mt-2 space-y-2">
          {formData.materials.map((mat, i) => (
            <li key={i} className="flex justify-between items-center bg-gray-50 p-2 rounded">
              <span>
                {mat.title} - {mat.file_type}
              </span>
              <button
                type="button"
                onClick={() => removeMaterial(i)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>

      <button
        type="submit"
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Create Course
      </button>
    </form>
  );
};

export default CourseCreationForm;