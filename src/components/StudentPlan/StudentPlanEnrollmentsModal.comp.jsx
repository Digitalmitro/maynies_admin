import React, { useEffect, useState } from "react";

function EnrollmentFilters({ filters, onFilterChange }) {
  return (
    <div className='flex flex-col md:flex-row gap-4 mb-6'>
      <div className='flex-1'>
        <div className='relative'>
          <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
            <svg
              className='h-5 w-5 text-gray-400'
              fill='currentColor'
              viewBox='0 0 20 20'
            >
              <path
                fillRule='evenodd'
                d='M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z'
                clipRule='evenodd'
              />
            </svg>
          </div>
          <input
            type='text'
            placeholder='Search students by name...'
            value={filters.search}
            onChange={(e) => onFilterChange("search", e.target.value)}
            className='block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
          />
        </div>
      </div>
      <div className='w-full md:w-48'>
        <select
          value={filters.status}
          onChange={(e) => onFilterChange("status", e.target.value)}
          className='block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
        >
          <option value=''>All Statuses</option>
          <option value='pending'>Pending</option>
          <option value='approved'>Approved</option>
          <option value='rejected'>Rejected</option>
          <option value='completed'>Completed</option>
        </select>
      </div>
    </div>
  );
}

// StatusBadge.jsx
function StatusBadge({ status }) {
  const statusClasses = {
    pending: "bg-yellow-100 text-yellow-800 border border-yellow-200",
    approved: "bg-green-100 text-green-800 border border-green-200",
    rejected: "bg-red-100 text-red-800 border border-red-200",
    completed: "bg-blue-100 text-blue-800 border border-blue-200",
  };


  console.log(status);
  

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
        statusClasses[status] ||
        "bg-gray-100 text-gray-800 border border-gray-200"
      }`}
    >
      {status?.charAt(0)?.toUpperCase() + status?.slice(1)}
    </span>
  );
}

// EnrollmentRow.jsx
function EnrollmentRow({ enrollment, updatingStatus, onStatusUpdate }) {
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <tr key={enrollment._id} className='hover:bg-gray-50'>
      <td className='px-6 py-4 whitespace-nowrap'>
        <div className='text-sm font-medium text-gray-900'>
          {enrollment.studentName}
        </div>
        <div className='text-sm text-gray-500'>ID: {enrollment.studentId}</div>
      </td>
      <td className='px-6 py-4 whitespace-nowrap'>
        <StatusBadge status={updatingStatus[enrollment?._id]} />
      </td>
      <td className='px-6 py-4 whitespace-nowrap'>
        {enrollment.isPaid ? (
          <div className='flex items-center'>
            <span className='px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full border border-green-200'>
              Paid
            </span>
            <span className='ml-2 text-xs text-gray-500'>
              {formatDate(enrollment.paidAt)}
            </span>
          </div>
        ) : (
          <span className='px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full border border-yellow-200'>
            Pending
          </span>
        )}
      </td>
      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
        {formatDate(enrollment.assignedAt)}
      </td>
      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
        {formatDate(enrollment.enrolledAt)}
      </td>
      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
        <div className='relative'>
          <select
            className='block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md'
            defaultValue={enrollment.status}
            value={updatingStatus[enrollment._id]}
            onChange={(e) => onStatusUpdate(enrollment._id, e.target.value)}
            disabled={
              updatingStatus[enrollment._id] !== "enrolled"
            }
          >
            <option value=''>{updatingStatus[enrollment._id]|| "Select--Status"}</option>
            <option value='pending'>pending</option>
            <option value='enrolled'>enrolled</option>
            <option value='rejected'>Reject</option>
            <option value='cancelled'>Cancelled</option>
          </select>
          {/* {updatingStatus[enrollment._id] && (
            <div className='absolute inset-y-0 right-0 pr-3 flex items-center'>
              <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500'></div>
            </div>
          )} */}
        </div>
      </td>
    </tr>
  );
}

// EnrollmentTable.jsx
function EnrollmentTable({ enrollments, updatingStatus, onStatusUpdate }) {
  return (
    <div className='overflow-auto flex-1 border border-gray-200 rounded-lg'>
      <table className='min-w-full divide-y divide-gray-200'>
        <thead className='bg-gray-50'>
          <tr>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
              Student Name
            </th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
              Status
            </th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
              Payment Status
            </th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
              Assigned Date
            </th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
              Enrolled Date
            </th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
              Actions
            </th>
          </tr>
        </thead>
        <tbody className='bg-white divide-y divide-gray-200'>
          {enrollments.map((enrollment) => (
            <EnrollmentRow
              key={enrollment._id}
              enrollment={enrollment}
              updatingStatus={updatingStatus}
              onStatusUpdate={onStatusUpdate}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Pagination.jsx
function Pagination({ pagination, onPageChange }) {
  const handlePageChange = (page) => {
    onPageChange(page);
  };

  return (
    <div className='flex items-center justify-between mt-4 px-2'>
      <div className='text-sm text-gray-700'>
        Showing{" "}
        <span className='font-medium'>
          {(pagination.page - 1) * pagination.limit + 1}
        </span>{" "}
        to{" "}
        <span className='font-medium'>
          {Math.min(pagination.page * pagination.limit, pagination.total)}
        </span>{" "}
        of <span className='font-medium'>{pagination.total}</span> results
      </div>
      <div className='flex space-x-2'>
        <button
          onClick={() => handlePageChange(pagination.page - 1)}
          disabled={pagination.page === 1}
          className='relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
        >
          Previous
        </button>
        <div className='hidden md:flex'>
          {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
            let pageNum;
            if (pagination.pages <= 5) {
              pageNum = i + 1;
            } else if (pagination.page <= 3) {
              pageNum = i + 1;
            } else if (pagination.page >= pagination.pages - 2) {
              pageNum = pagination.pages - 4 + i;
            } else {
              pageNum = pagination.page - 2 + i;
            }

            return (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  pagination.page === pageNum
                    ? "bg-blue-500 text-white"
                    : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>
        <button
          onClick={() => handlePageChange(pagination.page + 1)}
          disabled={pagination.page === pagination.pages}
          className='relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
        >
          Next
        </button>
      </div>
    </div>
  );
}

// EmptyState.jsx
function EmptyState() {
  return (
    <div className='flex flex-col items-center justify-center py-12 px-4 text-center'>
      <svg
        className='w-16 h-16 text-gray-300 mb-4'
        fill='none'
        stroke='currentColor'
        viewBox='0 0 24 24'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
        />
      </svg>
      <h3 className='text-lg font-medium text-gray-700 mb-1'>
        No enrollments found
      </h3>
      <p className='text-sm text-gray-500'>
        Try adjusting your search or filter to find what you're looking for.
      </p>
    </div>
  );
}

// StudentPlanEnrollmentsModal.jsx
function StudentPlanEnrollmentsModal({ mode, onClose, planId }) {
  const [enrollments, setEnrollments] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  });
  const [filters, setFilters] = useState({
    status: "",
    search: "",
    page: 1,
    limit: 10,
  });
  const [loading, setLoading] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState({});

  const fetchEnrollments = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        status: filters.status,
        search: filters.search,
        page: filters.page.toString(),
        limit: filters.limit.toString(),
      });

      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/student/plans/admin/enrollments/${planId}?${queryParams}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      const data = await response.json();
      //   console.log(data?.data?);

      if (data.success) {
        setUpdatingStatus(
          Object.fromEntries(data?.data?.map((en) => [en._id, en.status]))
        );
        setEnrollments(data.data);
        setPagination(
          data.data.pagination || {
            total: data.data.length,
            page: 1,
            limit: 10,
            pages: Math.ceil(data.data.length / 10),
          }
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateEnrollmentStatus = async (enrollmentId, newStatus) => {
    setUpdatingStatus((prev) => ({ ...prev, [enrollmentId]: newStatus }));
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/student/plans/admin/enrollments/${enrollmentId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const data = await response.json();

      if (data.success) {
        fetchEnrollments();
      } else {
        console.error("Failed to update status:", data.message);
      }
    } catch (err) {
      console.error("Error updating status:", err);
    } finally {
      setUpdatingStatus((prev) => ({ ...prev, [enrollmentId]: newStatus }));
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (page) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  console.log(updatingStatus);
  console.log(enrollments);

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col'>
        <div className='flex justify-between items-center p-6 border-b bg-gray-50'>
          <h2 className='text-xl font-semibold text-gray-800'>
            Plan Enrollments
          </h2>
          <button
            onClick={onClose}
            className='text-gray-500 hover:text-gray-700 transition-colors'
          >
            <svg
              className='w-6 h-6'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          </button>
        </div>

        <div className='p-6 flex-1 overflow-hidden flex flex-col'>
          <EnrollmentFilters
            filters={filters}
            onFilterChange={handleFilterChange}
          />

          {loading ? (
            <div className='flex justify-center items-center h-64'>
              <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500'></div>
            </div>
          ) : (
            <>
              {enrollments.length > 0 ? (
                <>
                  <EnrollmentTable
                    enrollments={enrollments}
                    updatingStatus={updatingStatus}
                    onStatusUpdate={updateEnrollmentStatus}
                  />
                  {pagination.pages > 1 && (
                    <Pagination
                      pagination={pagination}
                      onPageChange={handlePageChange}
                    />
                  )}
                </>
              ) : (
                <EmptyState />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentPlanEnrollmentsModal;
