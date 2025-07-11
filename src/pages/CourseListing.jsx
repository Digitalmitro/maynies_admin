import { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";

import { RiDeleteBin6Line } from "react-icons/ri";
import { RiVideoFill } from "react-icons/ri";
import { useAuth } from "../context/getApi";
import { useNavigate } from "react-router-dom";

const CourseListing = () => {
  const [courses, setCourses] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [activeCourseId, setActiveCourseId] = useState(null);
  const [options, setOptions] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [courseToUpdate, setCourseToUpdate] = useState(null);
  const navigate = useNavigate();
  const { fetchCourses } = useAuth();
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchCourses();
      console.log("the courses are", data?.data?.courses);
      setCourses(data?.data?.courses);
    };
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/courses/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete course");
      }
      setCourses(courses.filter((course) => course._id !== id));
      fetchData();
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };
  return (
    <section className="md:m-4 p-6 mt-12 rounded-xl bg-white shadow-sm">
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
        Course Listings
      </h2>

      <div className="flex flex-wrap justify-between  items-center gap-4 mx-auto">
        {/* Search Bar */}
        <div className="flex items-center w-full md:w-1/3 px-3 py-2 bg-[#EDECEC] rounded-2xl">
          <CiSearch size={20} className="text-gray-600" />
          <input
            type="text"
            placeholder="Search courses..."
            aria-label="Search courses"
            className="ml-2 w-full bg-transparent outline-none text-sm"
          />
        </div>

        {/* Filter Dropdown */}
        <div className="w-full md:w-auto">
          <select
            className="px-3 py-2 rounded-lg bg-[#EDECEC] text-sm outline-none focus:ring-2 focus:ring-blue-300"
            aria-label="Filter courses"
          >
            <option value="all">All Courses</option>
            <option value="popular">Popular Courses</option>
            <option value="new">New Courses</option>
          </select>
        </div>
      </div>

      <h2 className="font-semibold pt-8 pb-3">Top Rated Courses</h2>
      <hr className="text-gray-300" />

      <div className="flex flex-wrap">
        {courses.map((course, i) => (
          <div
            key={course._id || i}
            className="w-full md:w-1/2 lg:w-1/3 p-4 relative"
          >
            <div
              className="bg-white rounded-2xl hover:bg-[#FE99001A] overflow-hidden shadow-lg hover:shadow-xl transition duration-300"
              onClick={() => {
                setOptions((prev) => !prev);
                setActiveCourseId(course._id);
              }}
            >
              {/* Delete Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCourseToDelete(course._id);
                  setShowConfirm(true);
                }}
                className="absolute top-4 right-4 z-10 bg-red-100 m-1 text-red-600 hover:bg-red-200 rounded-full p-2"
              >
                <RiDeleteBin6Line size={18} />
              </button>

              {options && activeCourseId === course._id && (
                <div className="absolute top-20 right-4 bg-white  rounded shadow z-20 w-40">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCourseToUpdate(course);
                      setShowUpdateModal(true);
                    }}
                    className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-200"
                  >
                    Update Course
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();

                      navigate("/enrolledStudents",{
                        state: { courseId: course._id }
                      })
                    }}
                    className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                  >
                    Enrolled Students
                  </button>
                </div>
              )}

              {/* Course Image */}
              <div className="h-48 w-full overflow-hidden">
                <img
                  src={course.thumbnail_url}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Bottom Content */}
              <div className="bg-[#FDF5F2] p-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-700 font-medium">
                    <span className="bg-green-100 text-green-700 p-1 rounded-full">
                      <RiVideoFill size={20} />
                    </span>
                    {course.level}
                  </div>
                  <span className="bg-[#E5EAFE] text-[#5065D1] px-2 py-1 rounded-md text-xs font-medium">
                    {course.category}
                  </span>
                </div>

                <h3 className="text-[17px] font-bold text-gray-900 leading-snug">
                  {course.title}
                </h3>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3 mt-2">
                    <img
                      src={course.instructor_image}
                      alt={course.instructor_name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {course.instructor_name}
                      </p>
                      <p className="text-xs text-gray-500">{course.language}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-600 text-xs">
                      ₹{course.discount_price}{" "}
                      <span className="line-through text-red-400 text-[10px] ml-1">
                        ₹{course.price}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-500">
                    Published:{" "}
                    {new Date(course.published_at).toLocaleDateString()}
                  </span>
                  <button className="px-4 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition">
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {showConfirm && (
          <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-md w-[90%] max-w-sm">
              <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
              <p className="mb-6 text-sm text-gray-600">
                Are you sure you want to delete this course? This action cannot
                be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded"
                  onClick={() => {
                    setShowConfirm(false);
                    setCourseToDelete(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded"
                  onClick={() => {
                    handleDelete(courseToDelete);
                    setShowConfirm(false);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {showUpdateModal && courseToUpdate && (
        <div className="fixed inset-0 z-50 flex  items-center justify-center bg-black/70 bg-opacity-50">
          <div className="bg-white rounded-lg overflow-y-auto max-h-[600px] shadow-lg w-[90%] max-w-lg p-6 relative">
            <h2 className="text-xl font-semibold mb-4">Update Course</h2>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  const response = await fetch(
                    `${import.meta.env.VITE_BACKEND_URL}/api/courses/${
                      courseToUpdate._id
                    }`,
                    {
                      method: "PATCH",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      credentials: "include",
                      body: JSON.stringify({
                        price: Number(courseToUpdate.price),
                        discount_price: Number(courseToUpdate.discount_price),
                        description: courseToUpdate.description,
                        tags: courseToUpdate.tags,
                        materials: courseToUpdate.materials || [],
                      }),
                    }
                  );

                  if (!response.ok) throw new Error("Update failed");

                  alert("Course updated successfully");
                  setShowUpdateModal(false);
                  fetchData(); // Refresh course list
                } catch (err) {
                  console.error(err);
                  alert("Failed to update course");
                }
              }}
              className="space-y-4"
            >
              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Price
                </label>
                <input
                  type="number"
                  value={courseToUpdate.price}
                  onChange={(e) =>
                    setCourseToUpdate({
                      ...courseToUpdate,
                      price: e.target.value,
                    })
                  }
                  className="mt-1 block w-full border rounded p-2"
                />
              </div>

              {/* Discount Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Discount Price
                </label>
                <input
                  type="number"
                  value={courseToUpdate.discount_price}
                  onChange={(e) =>
                    setCourseToUpdate({
                      ...courseToUpdate,
                      discount_price: e.target.value,
                    })
                  }
                  className="mt-1 block w-full border rounded p-2"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  value={courseToUpdate.description}
                  onChange={(e) =>
                    setCourseToUpdate({
                      ...courseToUpdate,
                      description: e.target.value,
                    })
                  }
                  className="mt-1 block w-full border rounded p-2"
                  rows={3}
                ></textarea>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={courseToUpdate.tags?.join(", ")}
                  onChange={(e) =>
                    setCourseToUpdate({
                      ...courseToUpdate,
                      tags: e.target.value.split(",").map((t) => t.trim()),
                    })
                  }
                  className="mt-1 block w-full border rounded p-2"
                />
              </div>

              {/* Materials */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Materials
                </label>
                {(courseToUpdate.materials || []).map((material, index) => (
                  <div
                    key={index}
                    className="border rounded p-2 mb-2 space-y-2 bg-gray-50"
                  >
                    <input
                      type="text"
                      placeholder="Title"
                      value={material.title}
                      onChange={(e) => {
                        const updated = [...courseToUpdate.materials];
                        updated[index].title = e.target.value;
                        setCourseToUpdate({
                          ...courseToUpdate,
                          materials: updated,
                        });
                      }}
                      className="block w-full border rounded p-1"
                    />
                    <input
                      type="text"
                      placeholder="File URL"
                      value={material.file_url}
                      onChange={(e) => {
                        const updated = [...courseToUpdate.materials];
                        updated[index].file_url = e.target.value;
                        setCourseToUpdate({
                          ...courseToUpdate,
                          materials: updated,
                        });
                      }}
                      className="block w-full border rounded p-1"
                    />
                    <select
                      value={material.file_type}
                      onChange={(e) => {
                        const updated = [...courseToUpdate.materials];
                        updated[index].file_type = e.target.value;
                        setCourseToUpdate({
                          ...courseToUpdate,
                          materials: updated,
                        });
                      }}
                      className="block w-full border rounded p-1"
                    >
                      <option value="pdf">PDF</option>
                      <option value="doc">DOC</option>
                      <option value="video">Video</option>
                    </select>
                  </div>
                ))}

                {/* Add Material Button */}
                <button
                  type="button"
                  onClick={() =>
                    setCourseToUpdate({
                      ...courseToUpdate,
                      materials: [
                        ...(courseToUpdate.materials || []),
                        { title: "", file_url: "", file_type: "pdf" },
                      ],
                    })
                  }
                  className="text-blue-600 text-sm mt-2"
                >
                  + Add Material
                </button>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowUpdateModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default CourseListing;
