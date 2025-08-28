import { useEffect, useState } from "react";
import { IoIosClose, IoIosDocument, IoIosWarning, IoIosArrowDown, IoIosArrowUp, IoIosDownload } from "react-icons/io";
import jsPDF from "jspdf";

function SubmissionFormModal({ modalState, setModalState, templateId }) {
  const [loading, setLoading] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const [error, setError] = useState(null);
  const [expandedSubmission, setExpandedSubmission] = useState(null);

  // Fetch submissions on open
  useEffect(() => {
    if (modalState) {
      fetchSubmissions();
    }
  }, [modalState, templateId]);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/employer/form/form-submissions/${templateId}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        if (data?.message === "Invalid or expired refresh token") {
          setError("Invalid or expired refresh token");
        } else {
          setError(data?.message || "Failed to fetch submissions");
        }
        setSubmissions([]);
        return;
      }

      setSubmissions(data.submissions || []);
    } catch (err) {
      console.error("Error fetching submissions:", err);
      setError("Something went wrong while fetching data");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (submissionId, newStatus) => {
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/employer/form/form-submission/${submissionId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to update status");
      }

      // Optimistic update
      setSubmissions((prev) =>
        prev.map((s) =>
          s.id === submissionId ? { ...s, status: newStatus } : s
        )
      );
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status");
    }
  };

  // Helper function to get status badge class
  const getStatusClass = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  // Toggle expanded view for a submission
  const toggleExpanded = (submissionId) => {
    if (expandedSubmission === submissionId) {
      setExpandedSubmission(null);
    } else {
      setExpandedSubmission(submissionId);
    }
  };

  // Generate and download PDF for a submission
  const downloadPDF = (submission) => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text("Form Submission Details", 14, 22);
    
    // Add submission info
    doc.setFontSize(12);
    doc.text(`Employee: ${submission.employee?.name || "Unknown User"}`, 14, 32);
    doc.text(`Email: ${submission.employee?.email || "N/A"}`, 14, 39);
    doc.text(`Status: ${submission.status}`, 14, 46);
    doc.text(`Submitted on: ${new Date(submission.createdAt || Date.now()).toLocaleDateString()}`, 14, 53);
    
    // Add fields data
    let yPosition = 65;
    doc.setFontSize(14);
    doc.text("Form Data:", 14, yPosition);
    
    yPosition += 10;
    doc.setFontSize(11);
    
    Object.entries(submission.fields || {}).forEach(([key, value]) => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
      
      const fieldName = `${key.replace(/_/g, ' ')}:`;
      const fieldValue = String(value);
      
      doc.setFont(undefined, 'bold');
      doc.text(fieldName, 14, yPosition);
      
      doc.setFont(undefined, 'normal');
      // Split long values into multiple lines
      const splitText = doc.splitTextToSize(fieldValue, 180);
      doc.text(splitText, 50, yPosition);
      
      yPosition += splitText.length * 7;
    });
    
    // Add attachments if any
    if (Array.isArray(submission.attachments) && submission.attachments.length > 0) {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFontSize(14);
      doc.text("Attachments:", 14, yPosition);
      
      yPosition += 8;
      doc.setFontSize(11);
      
      submission.attachments.forEach(att => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }
        
        doc.text(`${att.field}: ${att.name}`, 14, yPosition);
        yPosition += 7;
      });
    }
    
    // Save the PDF
    doc.save(`submission-${submission.id}.pdf`);
  };

  return (
    <div className='fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col'>
        {/* Header */}
        <div className='bg-white p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 z-10'>
          <div>
            <h2 className='font-bold text-2xl text-gray-800'>
              Form Submissions
            </h2>
            <p className='text-gray-500 text-sm mt-1'>
              All submissions for this template
            </p>
          </div>
          <button
            className='p-2 rounded-full hover:bg-gray-100 transition-colors duration-200'
            onClick={() => setModalState(null)}
          >
            <IoIosClose size={28} className='text-gray-500' />
          </button>
        </div>

        {/* Stats Bar */}
        <div className='bg-gray-50 px-6 py-3 border-b border-gray-200 flex flex-wrap gap-4'>
          <div className='flex items-center'>
            <span className='text-sm text-gray-600 mr-2'>Total:</span>
            <span className='font-semibold'>{submissions.length}</span>
          </div>
          <div className='flex items-center'>
            <span className='w-3 h-3 rounded-full bg-yellow-500 mr-2'></span>
            <span className='text-sm text-gray-600 mr-2'>Pending:</span>
            <span className='font-semibold'>
              {submissions.filter((s) => s.status === "Pending").length}
            </span>
          </div>
          <div className='flex items-center'>
            <span className='w-3 h-3 rounded-full bg-green-500 mr-2'></span>
            <span className='text-sm text-gray-600 mr-2'>Approved:</span>
            <span className='font-semibold'>
              {submissions.filter((s) => s.status === "Approved").length}
            </span>
          </div>
          <div className='flex items-center'>
            <span className='w-3 h-3 rounded-full bg-red-500 mr-2'></span>
            <span className='text-sm text-gray-600 mr-2'>Rejected:</span>
            <span className='font-semibold'>
              {submissions.filter((s) => s.status === "Rejected").length}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className='flex-1 overflow-y-auto p-6'>
          {loading ? (
            <div className='flex flex-col items-center justify-center py-8'>
              <div className='animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mb-3'></div>
              <p className='text-gray-500'>Loading submissions...</p>
            </div>
          ) : error ? (
            <div className='text-center py-8 space-y-4'>
              <div className='mx-auto w-16 h-16 rounded-full bg-red-100 flex items-center justify-center'>
                <IoIosWarning size={32} className='text-red-500' />
              </div>
              <p className='text-red-500 font-medium'>{error}</p>
              {error === "Invalid or expired refresh token" && (
                <button
                  onClick={fetchSubmissions}
                  className='px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200'
                >
                  Refresh Session
                </button>
              )}
            </div>
          ) : submissions.length === 0 ? (
            <div className='text-center py-8'>
              <div className='mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-3'>
                <IoIosDocument size={32} className='text-gray-400' />
              </div>
              <p className='text-gray-500 font-medium'>
                No submissions found for this form.
              </p>
              <p className='text-gray-400 text-sm mt-1'>
                When employees submit this form, they'll appear here.
              </p>
            </div>
          ) : (
            <div className='space-y-4'>
              {submissions.map((sub) => (
                <div
                  key={sub.id}
                  className='bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow duration-200'
                >
                  <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
                    <div className='flex-1'>
                      <div className='flex items-center gap-3'>
                        <div className='w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center'>
                          <span className='text-blue-600 font-semibold'>
                            {sub.employee?.name
                              ? sub.employee.name.charAt(0).toUpperCase()
                              : "U"}
                          </span>
                        </div>
                        <div>
                          <p className='font-semibold text-gray-800'>
                            {sub.employee?.name || "Unknown User"}
                          </p>
                          {sub.employee?.email && (
                            <p className='text-gray-500 text-sm'>
                              {sub.employee.email}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className='flex items-center gap-3'>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(
                          sub.status
                        )}`}
                      >
                        {sub.status}
                      </span>
                      <select
                        value={sub.status}
                        onChange={(e) =>
                          handleStatusChange(sub.id, e.target.value)
                        }
                        className='border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                      >
                        <option value='Pending'>Pending</option>
                        <option value='Approved'>Approved</option>
                        <option value='Rejected'>Rejected</option>
                      </select>
                    </div>
                  </div>

                  {/* Submission details and expand button */}
                  <div className='mt-3 pt-3 border-t border-gray-100 flex justify-between items-center'>
                    <h6 className='text-xs text-gray-500'>
                      Submitted on:{" "}
                      {new Date(
                        sub.createdAt || Date.now()
                      ).toLocaleDateString()}
                    </h6>
                    <button 
                      onClick={() => toggleExpanded(sub.id)}
                      className='flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium'
                    >
                      {expandedSubmission === sub.id ? (
                        <>
                          <span>Close</span>
                          <IoIosArrowUp className='ml-1' />
                        </>
                      ) : (
                        <>
                          <span>Open</span>
                          <IoIosArrowDown className='ml-1' />
                        </>
                      )}
                    </button>
                  </div>

                  {/* Expanded details */}
                  {expandedSubmission === sub.id && (
                    <div className='mt-4 p-4 bg-gray-50 rounded-lg'>
                      <div className='flex justify-between items-center mb-3'>
                        <h3 className='font-semibold text-gray-800'>Complete Form Data</h3>
                        <button 
                          onClick={() => downloadPDF(sub)}
                          className='flex items-center px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors'
                        >
                          <IoIosDownload className='mr-1' />
                          Download PDF
                        </button>
                      </div>

                      <ul className='mt-2 space-y-2'>
                        {Object.entries(sub.fields || {}).map(([key, value]) => (
                          <li key={key} className='text-sm text-gray-600 flex'>
                            <span className='font-medium capitalize w-1/3'>
                              {key.replace(/_/g, ' ')}:
                            </span>
                            <span className='w-2/3'>{String(value)}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Attachments */}
                      {Array.isArray(sub.attachments) &&
                        sub.attachments.length > 0 && (
                          <div className='mt-4'>
                            <h4 className='text-sm font-semibold text-gray-700 mb-2'>
                              Attachments:
                            </h4>
                            <ul className='space-y-2'>
                              {sub.attachments.map((att) => (
                                <li key={att._id} className='text-sm flex items-center'>
                                  <span className='font-medium w-1/3'>{att.field}:</span>
                                  <a
                                    href={att.url}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='text-blue-600 hover:underline w-2/3 truncate'
                                  >
                                    {att.name}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className='bg-gray-50 px-6 py-3 border-t border-gray-200 flex justify-end'>
          <button
            onClick={() => setModalState(null)}
            className='px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors duration-200'
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default SubmissionFormModal;