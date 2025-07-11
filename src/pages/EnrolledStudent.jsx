import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { FiEdit, FiDownload } from "react-icons/fi";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
function EnrolledStudent() {
  const location = useLocation();
  const courseId = location.state?.courseId;
  const [student, setStudent] = useState([]);

  const gradeOptions = [
    "A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D", "F",
  ];

  useEffect(() => {
    const fetchStudentData = async () => {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/courses/${courseId}/enrollments`,
        {
          credentials: "include",
        }
      );
      if (!res.ok) throw new Error("Failed to fetch students");
      const data = await res.json();
      setStudent(data?.data || []);
    };

    if (courseId) fetchStudentData();
  }, [courseId]);

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    const updatedStudents = [...student];
    updatedStudents[index][name] = name === "gpa" ? parseFloat(value) : value;
    setStudent(updatedStudents);
  };

  const handleEdit = async (id, index) => {
    const updatedStudent = student[index];
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/student/progress/${courseId}/${id}/grade`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          grade: updatedStudent.grade,
          gpa: updatedStudent.gpa,
          progressPercent: 85,
          credits: 3,
        }),
      }
    );

    if (!res.ok) {
      const err = await res.json();
      console.error("API Error:", err);
      alert("Failed to update student grade.");
      return;
    }

    const data = await res.json();
    console.log("Edit Response:", data);
    alert("Grade updated successfully");
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
  
    doc.setFontSize(16);
    doc.text("Enrolled Students Report", 14, 20);
  
    const tableData = student.map((s) => [
      s.name,
      s.grade || "-",
      s.gpa !== null ? s.gpa.toFixed(2) : "-",
    ]);
  
    autoTable(doc, {
      startY: 30,
      head: [["Name", "Grade", "GPA"]],
      body: tableData,
    });
  
    doc.save("enrolled_students.pdf");
  };

  return (
    <div className="max-w-7xl mx-auto mt-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow-xl rounded-xl overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800">
            Enrolled Student Details
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Student Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Grade
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  GPA
                </th>
                <th className="px-6 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {student.map((s, index) => (
                <tr key={s.studentId}>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800 font-medium">
                    {s.name}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      name="grade"
                      value={s.grade}
                      onChange={(e) => handleChange(index, e)}
                      className="block rounded-md border border-gray-300 bg-white py-2 px-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {gradeOptions.map((grade) => (
                        <option key={grade} value={grade}>
                          {grade}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="number"
                      name="gpa"
                      step="0.01"
                      min="0"
                      max="4"
                      value={s.gpa || ""}
                      onChange={(e) => handleChange(index, e)}
                      className="block rounded-md border border-gray-300 py-2 px-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-center space-x-2">
                    <button
                      onClick={() => handleEdit(s.studentId, index)}
                      className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-1.5 rounded-md transition"
                    >
                      <FiEdit size={14} /> Edit
                    </button>
                    <button
                      onClick={handleDownloadPDF}
                      className="inline-flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white text-xs font-medium px-3 py-1.5 rounded-md transition"
                    >
                      <FiDownload size={14} /> Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default EnrolledStudent;