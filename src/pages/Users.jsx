import { useState } from "react";
import { FiPlus, FiUpload, FiChevronDown } from "react-icons/fi";

const CourseCreationForm = () => {
  const [modules, setModules] = useState([]);
  const [currentModule, setCurrentModule] = useState("");

  const addModule = () => {
    if (currentModule.trim()) {
      setModules([...modules, currentModule]);
      setCurrentModule("");
    }
  };

  return (
    <div className="max-w-4xl mt-12 md:mt-1 mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Create New Course</h1>
      
      {/* Basic Course Details */}
      <div className="mb-8 p-4 border border-gray-200 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Basic Course Details</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Course Title</label>
            <input 
              type="text" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter course title"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <div className="relative">
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none">
                <option>Select category</option>
                <option>Programming</option>
                <option>Design</option>
                <option>Business</option>
              </select>
              <FiChevronDown className="absolute right-3 top-3 text-gray-400" />
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Course Language</label>
            <div className="relative">
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none">
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
              </select>
              <FiChevronDown className="absolute right-3 top-3 text-gray-400" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty Level</label>
            <div className="relative">
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none">
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
              <FiChevronDown className="absolute right-3 top-3 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Pricing & Monetization */}
      <div className="mb-8 p-4 border border-gray-200 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Pricing & Monetization</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Course Price ($)</label>
            <input 
              type="number" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Discount Offer (%)</label>
            <input 
              type="number" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0"
              max="100"
            />
          </div>
        </div>
      </div>

      {/* Course Content Upload */}
      <div className="mb-8 p-4 border border-gray-200 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Course Content Upload</h2>
        
        <div className=" gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Course Thumbnail</label>
            <div className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500">
              <div className="text-center">
                <FiUpload className="mx-auto text-gray-400" />
                <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
              </div>
              <input type="file" className="hidden" />
            </div>
          </div>
          
         
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea 
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter course description"
          ></textarea>
        </div>
      </div>

      {/* Course Modules */}
      <div className="mb-8 p-4 border border-gray-200 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Course Modules</h2>
        
        <div className="flex mb-4">
          <input 
            type="text" 
            value={currentModule}
            onChange={(e) => setCurrentModule(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter module title"
          />
          <button 
            onClick={addModule}
            className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 flex items-center"
          >
            <FiPlus className="mr-1" /> Add
          </button>
        </div>
        
        {modules.length > 0 && (
          <div className="border border-gray-200 rounded-md">
            {modules.map((module, index) => (
              <div key={index} className="p-3 border-b border-gray-200 last:border-b-0 flex justify-between items-center">
                <span>Module {index + 1}: {module}</span>
                <button className="text-red-500 hover:text-red-700">Remove</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3">
        <button className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
          Cancel
        </button>
        <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Create Course
        </button>
      </div>
    </div>
  );
};

export default CourseCreationForm;