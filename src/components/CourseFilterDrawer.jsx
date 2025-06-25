import { FaFilter } from "react-icons/fa";

const CourseFilterDrawer = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end md:items-center md:justify-center">
      <div className="w-full max-w-sm bg-white p-6 rounded-t-2xl md:rounded-l-2xl md:rounded-t-none h-[80vh] max-h-[600px] flex flex-col shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Course Categories</h2>
          <FaFilter className="text-xl text-gray-600" />
        </div>

        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto space-y-4">
          {/* Dummy categories */}
          <div className="border-b pb-4">
            <ul className="space-y-2">
              {Array(8).fill("Lorem ipsum is simply").map((text, i) => (
                <li key={i} className="flex justify-between text-sm text-gray-700">
                  <span>{text}</span>
                  <span>(104)</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Pricing */}
          <div className="border-b pb-4">
            <h3 className="font-medium mb-2">Pricing</h3>
            <input type="range" min="0" max="1000" className="w-full accent-orange-400" />
            <div className="flex justify-between text-sm mt-1">
              <span>$0</span>
              <span>$1000</span>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <input type="checkbox" defaultChecked className="accent-yellow-500" />
              <label className="text-sm">Paid</label>
            </div>
          </div>

          {/* Duration */}
          <div>
            <h3 className="font-medium mb-3">Duration</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {["0-2 Hours", "3-6 Hours", "11-12 Hours", "13-15 Hours", "18 Hours"].map((d, i) => (
                <label key={i} className="flex items-center gap-2">
                  <input type="checkbox" className="accent-gray-600" />
                  {d}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Fixed footer */}
        <div className="pt-4 text-right border-t">
          <button
            className="px-4 py-1 bg-black text-white rounded-lg"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseFilterDrawer;