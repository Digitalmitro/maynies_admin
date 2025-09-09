import  { useEffect, useState } from "react";
import {
  FaEye,
  FaEdit,
  FaTrash,
  FaUsers,
  FaSearch,
  FaFilter,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

function StudentPlans({
  setModalState,
  setSelectedPlanId,
  refresh,
  setRefresh,
  setEnrollmentModalState
}) {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [query, setQuery] = useState({
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
    search: "",
    paymentType: "",
    paymentMode: "",
    status: "",
    minAmount: "",
    maxAmount: "",
    hasInstallments: "",
  });

  // API call
  const fetchPlans = async () => {
    setLoading(true);

    try {
      const params = new URLSearchParams(
        Object.fromEntries(
          Object.entries(query).filter(([_, v]) => v !== "" && v !== null)
        )
      );

      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/student/plans/admin?${params}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!res.ok) throw new Error("Failed to fetch plans");
      const data = await res.json();

      setPlans(data.data || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("Error fetching plans:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (refresh) {
      fetchPlans();
      setRefresh(false); // refresh complete hone ke baad hi false kar
    }
  }, [refresh]);

  useEffect(() => {
    fetchPlans();
    // setRefresh(false);
  }, [query]);

  // Handlers
  const handleView = (plan) => {
    setRefresh(false);
    setModalState("View");
    setSelectedPlanId(plan._id);
    // console.log("View:", plan);
  };

  const handleEdit = (plan) => {
    setRefresh(false);
    setSelectedPlanId(plan._id);
    setModalState("Edit");
  };
  
  const handleDelete = async (plan) => {
    if (!plan?._id) return;
  
    const confirmDelete = window.confirm(
      `Are you sure you want to delete the plan: "${plan.name}"?`
    );
    if (!confirmDelete) return;
    setRefresh(false);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/student/plans/admin/${plan._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
  
      if (!res.ok) throw new Error("Failed to delete plan");
  
      alert("Plan deleted successfully ✅");
      setRefresh(true); // list ko refresh karega
    } catch (err) {
      console.error("Error deleting plan:", err);
      alert("Error deleting plan ❌");
    }
  };

  function handleEnrollments(plan){
    setEnrollmentModalState("View");
    setSelectedPlanId(plan._id);
  }
  
  // const handleEnrollments = (plan) => console.log("Enrollments:", plan);

  const handleSearchChange = (e) => {
    setQuery({ ...query, search: e.target.value, page: 1 });
  };

  const handleFilterChange = (field, value) => {
    setQuery({ ...query, [field]: value, page: 1 });
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setQuery({ ...query, page: newPage });
    }
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className='p-6 bg-gray-50 min-h-screen'>
      <div className='w-full'>
        {/* Search and Filter Section */}
        <div className='bg-white rounded-lg shadow-sm p-4 mb-6'>
          <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
            <div className='relative flex-1'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <FaSearch className='text-gray-400' />
              </div>
              <input
                type='text'
                placeholder='Search plans by name or description...'
                value={query.search}
                onChange={handleSearchChange}
                className='pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              />
            </div>

            <button
              onClick={toggleFilters}
              className='flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors'
            >
              <FaFilter className='text-gray-600' />
              <span>Filters</span>
            </button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className='mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 border border-gray-200 rounded-lg'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Status
                </label>
                <select
                  value={query.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                  className='w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                >
                  <option value=''>All Statuses</option>
                  <option value='active'>Active</option>
                  <option value='inactive'>Inactive</option>
                </select>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Payment Type
                </label>
                <select
                  value={query.paymentType}
                  onChange={(e) =>
                    handleFilterChange("paymentType", e.target.value)
                  }
                  className='w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                >
                  <option value=''>All Types</option>
                  <option value='one-time'>One-time</option>
                  <option value='recurring'>Recurring</option>
                </select>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Min Amount
                </label>
                <input
                  type='number'
                  value={query.minAmount}
                  onChange={(e) =>
                    handleFilterChange("minAmount", e.target.value)
                  }
                  className='w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                  placeholder='Min amount'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Max Amount
                </label>
                <input
                  type='number'
                  value={query.maxAmount}
                  onChange={(e) =>
                    handleFilterChange("maxAmount", e.target.value)
                  }
                  className='w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                  placeholder='Max amount'
                />
              </div>
            </div>
          )}
        </div>

        {/* Plans Table */}
        <div className='bg-white rounded-lg shadow-sm overflow-hidden'>
          {loading ? (
            <div className='flex justify-center items-center py-20'>
              <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500'></div>
            </div>
          ) : (
            <>
              <div className='overflow-x-auto'>
                <table className='min-w-full divide-y divide-gray-200'>
                  <thead className='bg-gray-50'>
                    <tr>
                      <th
                        scope='col'
                        className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                      >
                        Plan Name
                      </th>
                      <th
                        scope='col'
                        className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                      >
                        Description
                      </th>
                      <th
                        scope='col'
                        className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                      >
                        Status
                      </th>
                      <th
                        scope='col'
                        className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className='bg-white divide-y divide-gray-200'>
                    {plans.length > 0 ? (
                      plans.map((plan) => (
                        <tr
                          key={plan._id}
                          className='hover:bg-gray-50 transition-colors'
                        >
                          <td className='px-6 py-4 whitespace-nowrap'>
                            <div className='text-sm font-medium text-gray-900'>
                              {plan.name}
                            </div>
                          </td>
                          <td className='px-6 py-4'>
                            <div className='text-sm text-gray-500 truncate max-w-xs'>
                              {plan.description}
                            </div>
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap'>
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                plan.status === "active"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {plan.status}
                            </span>
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                            <div className='flex items-center gap-3'>
                              <button
                                onClick={() => handleView(plan)}
                                className='text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50 transition-colors'
                                title='View details'
                              >
                                <FaEye size={16} />
                              </button>
                              <button
                                onClick={() => handleEdit(plan)}
                                className='text-green-600 hover:text-green-900 p-1 rounded-full hover:bg-green-50 transition-colors'
                                title='Edit plan'
                              >
                                <FaEdit size={16} />
                              </button>
                              <button
                                onClick={() => handleDelete(plan)}
                                className='text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50 transition-colors'
                                title='Delete plan'
                              >
                                <FaTrash size={16} />
                              </button>
                              <button
                                onClick={() => handleEnrollments(plan)}
                                className='text-purple-600 hover:text-purple-900 p-1 rounded-full hover:bg-purple-50 transition-colors'
                                title='View enrollments'
                              >
                                <FaUsers size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan='4' className='px-6 py-12 text-center'>
                          <div className='flex flex-col items-center justify-center text-gray-500'>
                            <FaUsers className='text-4xl mb-2 opacity-50' />
                            <p className='text-lg font-medium'>
                              No plans found
                            </p>
                            <p className='text-sm'>
                              Try adjusting your search or filters
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {plans.length > 0 && (
                <div className='px-6 py-4 border-t border-gray-200 flex items-center justify-between'>
                  <div className='text-sm text-gray-700'>
                    Showing page{" "}
                    <span className='font-medium'>{query.page}</span> of{" "}
                    <span className='font-medium'>{totalPages}</span>
                  </div>
                  <div className='flex space-x-2'>
                    <button
                      onClick={() => handlePageChange(query.page - 1)}
                      disabled={query.page === 1}
                      className={`flex items-center px-3 py-1.5 rounded-lg border border-gray-300 text-sm ${
                        query.page === 1
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <FaChevronLeft size={12} className='mr-1' />
                      Previous
                    </button>
                    <button
                      onClick={() => handlePageChange(query.page + 1)}
                      disabled={query.page === totalPages}
                      className={`flex items-center px-3 py-1.5 rounded-lg border border-gray-300 text-sm ${
                        query.page === totalPages
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      Next
                      <FaChevronRight size={12} className='ml-1' />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentPlans;
