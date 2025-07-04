import { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import courseImg from "../assets/courseImg.png";
import authorImg from "../assets/authorImage.png";
import { RiDeleteBin6Line } from "react-icons/ri";
import { RiVideoFill } from "react-icons/ri";
import { FaStar } from "react-icons/fa";
import CourseFilterDrawer from "../components/CourseFilterDrawer";
import { useAuth } from "../context/getApi";

const CourseListing = () => {
  const [courses, setCourses] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { fetchCourses } = useAuth();
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchCourses();
      console.log("the courses are", data?.data?.courses);
      setCourses(data?.data?.courses);
    };
    fetchData();
  }, []);
  const handleCourseClick = () => {
    setDrawerOpen(true);
  };
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
              onClick={() => handleCourseClick(course)}
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

      <CourseFilterDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </section>
  );
};

export default CourseListing;
