import { useState } from "react";
import { CiSearch } from "react-icons/ci";
import courseImg from "../assets/courseImg.png";
import authorImg from "../assets/authorImage.png";
import { RiVideoFill } from "react-icons/ri";
import { FaStar } from "react-icons/fa";
import CourseFilterDrawer from "../components/CourseFilterDrawer";
const courseData = [
  {
    id: 1,
    image: courseImg,
    lessons: "10x Lessons",
    title: "Career to build for the pro level",
    category: "Development",
    author: "Robert Fox",
    authorImage: authorImg,
    role: "UI/UX Designer",
    rating: 4.8,
    students: "2k",
  },
  {
    id: 2,
    image: courseImg,
    lessons: "12x Lessons",
    title: "Career to build for the pro level",
    category: "Design",
    author: "Robert Fox",
    authorImage: authorImg,
    role: "Product Designer",
    rating: 4.9,
    students: "3k ",
  },
  {
    id: 3,
    image: courseImg,
    lessons: "8x Lessons",
    title: "Career to build for the pro level",
    category: "Development",
    author: "Robert Fox",
    authorImage: authorImg,
    role: "Fullstack Dev",
    rating: 4.7,
    students: "1.5k ",
  },
  {
    id: 4,
    image: courseImg,
    lessons: "9x Lessons",
    title: "Career to build for the pro level",
    category: "Marketing",
    author: "Robert Fox",
    authorImage: authorImg,
    role: "Content Marketer",
    rating: 4.6,
    students: "2.2k ",
  },
  {
    id: 5,
    image: courseImg,
    lessons: "11x Lessons",
    title: "Career to build for the pro level",
    category: "Development",
    author: "Robert Fox",
    role: "Frontend Dev",
    authorImage: "",
    rating: 4.9,
    students: "4.1k ",
  },
  {
    id: 6,
    image: courseImg,
    lessons: "10x Lessons",
    title: "Career to build for the pro level",
    category: "Design",
    author: "Robert Fox",
    role: "Graphics Designer",
    rating: 5.0,
    students: "3.5k ",
  },
];
const Dashboard = () => {
  const [courses, setCourses] = useState(courseData);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const handleCourseClick=()=>{
    setDrawerOpen(true); 
    
  }
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
          <div key={course.id} className="w-full md:w-1/2 lg:w-1/3 p-4" onClick={handleCourseClick}>
            <div className="bg-white rounded-2xl hover:bg-[#FE99001A] overflow-hidden shadow-lg hover:shadow-xl transition duration-300">
              {/* Course Image */}
              <div className="h-48 w-full overflow-hidden">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Bottom Content */}
              <div className="bg-[#FDF5F2] p-4 space-y-3">
                {/* Top Row: Lessons & Category Tag */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-700 font-medium">
                    <span className="bg-green-100 text-green-700 p-1 rounded-full">
                      <RiVideoFill size={20} />
                    </span>
                    {course.lessons}
                  </div>
                  <span className="bg-[#E5EAFE] text-[#5065D1] px-2 py-1 rounded-md text-xs font-medium">
                    {course.category}
                  </span>
                </div>

                {/* Course Title */}
                <h3 className="text-[17px] font-bold text-gray-900 leading-snug">
                  {course.title}
                </h3>

                {/* Author Section */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3 mt-2">
                    <img
                      src={course.authorImage}
                      alt={course.author}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {course.author}
                      </p>
                      <p className="text-xs text-gray-500">{course.role}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs">
                      {course.students} Students
                    </p>
                  </div>
                </div>


                {/* Rating and Students */}
                <div className="flex justify-between items-center ">
                <div className="flex items-center justify-between text-sm mt-2">
                  <div className="flex items-center gap-1 text-yellow-500">
                    {Array.from({ length: Math.floor(course.rating) }).map(
                      (_, index) => (
                        <FaStar key={index} />
                      )
                    )}
                    <span className="text-gray-600 ml-1">
                      ({course.rating})
                    </span>
                  </div>
                </div>
                <div className="pt-2">
                  <button className="px-4 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition">
                    Learn More
                  </button>
                </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>  
      <CourseFilterDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </section>
  );
};

export default Dashboard;
