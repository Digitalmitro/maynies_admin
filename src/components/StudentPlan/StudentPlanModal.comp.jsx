import { useState, useEffect } from 'react';

const round2 = (num) => Math.round((num + Number.EPSILON) * 100) / 100


function StudentPlanModal({ mode = "Create", onClose, planId = null,setRefresh }) {
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    paymentType: "tuition",
    customPaymentType: "",
    totalAmount: "",
    paymentMode: "one_time",
    status: "active",
    installments: [],
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);

  // Fetch plan details when in edit or view mode
  useEffect(() => {
    if ((mode === "Edit" || mode === "View") && planId) {
      fetchPlanDetails();
    }
  }, [mode, planId]);

  // Fetch plan details from API
  const fetchPlanDetails = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/student/plans/admin/${planId}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      
      if (!response.ok) {
        throw new Error("Failed to fetch plan details");
      }
      
      const data = await response.json();
      console.log(data?.data);
      
      // Format the data for the form
      setFormData({
        name: data?.data?.name || "",
        description: data?.data?.description || "",
        paymentType: data?.data?.paymentType || "tuition",
        customPaymentType: data?.data?.paymentType === "other" ? data?.data?.customPaymentType || "" : "",
        totalAmount: data?.data?.totalAmount || "",
        paymentMode: data?.data?.paymentMode || "one_time",
        status: data?.data?.status || "active",
        installments: data?.data?.installments || [],
      });
    } catch (err) {
      console.error("Error fetching plan details:", err);
      alert(`Failed to fetch plan: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Generate initial installments when payment mode or total amount changes
  useEffect(() => {
    if (
      (formData.paymentMode === "installments" || formData.paymentMode === "both") &&
      formData.totalAmount &&
      formData.totalAmount > 0
    ) {
      const count = formData.installments.length || 2;
      generateInstallments(count);
    } else if (formData.paymentMode === "one_time") {
      setFormData((prev) => ({ ...prev, installments: [] }));
    }
  }, [formData.paymentMode, formData.totalAmount]);

  // Generate installments with equal amounts
  const generateInstallments = (count) => {
    const amountPerInstallment = formData.totalAmount / count;
    const today = new Date();
    const newInstallments = [];
    
    for (let i = 0; i < count; i++) {
      const dueDate = new Date(today);
      dueDate.setMonth(today.getMonth() + i);
      
      newInstallments.push({
        amount: i === count - 1 
          ? formData.totalAmount - amountPerInstallment * (count - 1) 
          : amountPerInstallment,
        dueDate: dueDate.toISOString().split("T")[0],
      });
    }
    
    setFormData((prev) => ({ ...prev, installments: newInstallments }));
  };

  // Handle input changes
  const handleChange = (e) => {
    if (mode === "View") return;
    
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle installment changes
  const handleInstallmentChange = (index, field, value) => {
    if (mode === "View") return;
    
    const updatedInstallments = [...formData.installments];
    
    if (field === "amount") {
      // Parse amount as float
      const numValue = parseFloat(value) || 0;
      updatedInstallments[index][field] = numValue;
      
      // Auto-adjust last installment if not the last one being edited
      if (index !== updatedInstallments.length - 1) {
        const otherInstallmentsTotal = updatedInstallments
          .filter((_, i) => i !== updatedInstallments.length - 1)
          .reduce((sum, inst) => sum + inst.amount, 0);
        
        updatedInstallments[updatedInstallments.length - 1].amount = 
          formData.totalAmount - otherInstallmentsTotal;
      }
    } else {
      updatedInstallments[index][field] = value;
    }
    
    setFormData((prev) => ({ ...prev, installments: updatedInstallments }));
  };

  // Handle installment count change
  const handleInstallmentCountChange = (e) => {
    if (mode === "View") return;
    
    const count = parseInt(e.target.value);
    generateInstallments(count);
  };

  // Delete an installment
  const handleDeleteInstallment = (index) => {
    if (mode === "View") return;
    
    if (formData.installments.length <= 2) {
      alert("At least 2 installments are required");
      return;
    }
    
    const updatedInstallments = formData.installments.filter((_, i) => i !== index);
    
    // Rebalance amounts after deletion
    const equalAmount = formData.totalAmount / updatedInstallments.length;
    const rebalancedInstallments = updatedInstallments.map((inst, i) => ({
      ...inst,
      amount: i === updatedInstallments.length - 1 
        ? formData.totalAmount - equalAmount * (updatedInstallments.length - 1) 
        : equalAmount,
    }));
    
    setFormData((prev) => ({ ...prev, installments: rebalancedInstallments }));
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {}

    const total = Number(formData.totalAmount)

    if (!formData.name?.trim()) newErrors.name = "Plan name is required"
    if (!Number.isFinite(total) || total <= 0) newErrors.totalAmount = "Valid total amount is required"
    if (!formData.paymentType) newErrors.paymentType = "Payment type is required"
    if (formData.paymentType === "other" && !formData.customPaymentType?.trim()) {
      newErrors.customPaymentType = "Please specify the payment type"
    }

    if (formData.paymentMode !== "one_time") {
      if (!Array.isArray(formData.installments) || formData.installments.length < 2) {
        newErrors.installments = "At least 2 installments are required"
      } else {
        let sum = 0
        const dateSet = new Set()
        const todayStr = new Date().toISOString().split("T")[0]

        formData.installments.forEach((inst, idx) => {
          const amt = Number(inst.amount)

          if (!Number.isFinite(amt) || amt <= 0) {
            newErrors[`installment-${idx}-amount`] = "Amount must be greater than 0"
          }

          sum = round2(sum + round2(amt))

          const date = inst.dueDate
          if (!date) {
            newErrors[`installment-${idx}-date`] = "Due date is required"
          } else {
            if (dateSet.has(date)) {
              newErrors[`installment-${idx}-date`] = "Duplicate due date"
            }
            dateSet.add(date)
            if (date < todayStr) {
              newErrors[`installment-${idx}-date`] = "Due date cannot be in the past"
            }
          }
        })

        if (Math.abs(round2(sum - total)) > 0.01) {
          newErrors.installments = `Installments total (${sum.toFixed(2)}) doesn't match plan total`
        }
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e) => {

    e.preventDefault();
    // setRefresh(false);
    if (mode === "View") {
      onClose();
      return;
    }
    
    setTouched({
      name: true,
      totalAmount: true,
      paymentType: true,
      paymentMode: true,
    });
    
    if (!validateForm()) return;
    console.log("Submitting form in mode:", mode);
    
    // Prepare final data
    const finalData = {
      ...formData,
      totalAmount: Number(parseFloat(formData.totalAmount)),
      paymentType: formData.paymentType === "other" 
        ? formData.customPaymentType 
        : formData.paymentType,
    };
    
    try {
      const url = mode === "Edit" 
        ? `${import.meta.env.VITE_BACKEND_URL}/api/student/plans/admin/${planId}`
        : `${import.meta.env.VITE_BACKEND_URL}/api/student/plans/admin`;
      
      const method = mode === "Edit" ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Something went wrong");
      }
      
      const data = await response.json();
      console.log("API Response:", data);
      
      alert(`Plan ${mode === "Edit" ? "updated" : "created"} successfully!`);
      setRefresh(true);
      onClose();
    } catch (err) {
      console.error(`Error ${mode === "Edit" ? "updating" : "creating"} plan:`, err);
      alert(`Failed to ${mode === "Edit" ? "update" : "create"} plan: ${err.message}`);
    }
  };

  
 
  // Calculate today's date in YYYY-MM-DD format for date input min attribute
  const today = new Date().toISOString().split("T")[0];

  if (loading) {
    return (
      <div className='fixed inset-0 flex items-center justify-center z-50 p-4'>
        <div className='absolute inset-0 bg-gray-800/20 bg-opacity-70' onClick={onClose}></div>
        <div className='relative bg-white rounded-xl shadow-xl w-full max-w-md p-6 z-10'>
          <div className='flex justify-center items-center py-8'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
          </div>
          <p className='text-center text-gray-600'>Loading plan details...</p>
        </div>
      </div>
    );
  }


  // console.log(formData);
  return (
    <div className='fixed inset-0 flex items-center justify-center z-50 p-4'>
      {/* Overlay */}
      <div className='absolute inset-0 bg-gray-800/20 bg-opacity-70' onClick={onClose}></div>
      
      {/* Modal Box */}
      <div className='relative bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto z-10 animate-fadeIn'>
        {/* Header */}
        <div className='flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white z-10'>
          <h2 className='text-2xl font-bold text-gray-800'>
            {mode === "Edit" 
              ? "Edit Student Plan" 
              : mode === "View" 
                ? "View Student Plan" 
                : "Create Student Plan"}
          </h2>
          <span>{mode}</span>
          <button
            onClick={onClose}
            className='text-gray-500 hover:text-gray-700 text-2xl font-semibold p-1 rounded-full hover:bg-gray-100 w-8 h-8 flex items-center justify-center'
          >
            ×
          </button>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className='p-6 space-y-6'>
          {/* Basic Information Section */}
          <div className='space-y-6'>
            <h3 className='text-lg font-semibold text-gray-800 border-b pb-2'>Basic Information</h3>
            
            {/* Plan Name */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Plan Name <span className='text-red-500'>*</span>
              </label>
              <input
                type='text'
                name='name'
                value={formData.name}
                onChange={handleChange}
                onBlur={() => setTouched((prev) => ({ ...prev, name: true }))}
                placeholder='Enter plan name'
                readOnly={mode === "View"}
                className={`w-full border rounded-lg px-4 py-3 outline-none transition-colors ${
                  errors.name && touched.name
                    ? "border-red-500 focus:ring-2 focus:ring-red-500"
                    : mode === "View"
                    ? "border-gray-300 bg-gray-100"
                    : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                }`}
              />
              {errors.name && touched.name && (
                <p className='mt-2 text-sm text-red-600 flex items-center'>
                  <svg className='w-4 h-4 mr-1' fill='currentColor' viewBox='0 0 20 20'>
                    <path
                      fillRule='evenodd'
                      d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                      clipRule='evenodd'
                    />
                  </svg>
                  {errors.name}
                </p>
              )}
            </div>
            
            {/* Description */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Description</label>
              <textarea
                name='description'
                value={formData.description}
                onChange={handleChange}
                placeholder='Enter plan description'
                rows={3}
                readOnly={mode === "View"}
                className={`w-full border rounded-lg px-4 py-3 outline-none transition-colors ${
                  mode === "View"
                    ? "border-gray-300 bg-gray-100"
                    : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                }`}
              />
            </div>
            
            {/* Payment Type */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Payment Type <span className='text-red-500'>*</span>
              </label>
              <div className='flex gap-4'>
                <select
                  name='paymentType'
                  value={formData.paymentType}
                  onChange={handleChange}
                  onBlur={() => setTouched((prev) => ({ ...prev, paymentType: true }))}
                  disabled={mode === "View"}
                  className={`flex-1 border rounded-lg px-4 py-3 outline-none transition-colors ${
                    errors.paymentType && touched.paymentType
                      ? "border-red-500 focus:ring-2 focus:ring-red-500"
                      : mode === "View"
                      ? "border-gray-300 bg-gray-100"
                      : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                >
                  <option value='tuition'>Tuition</option>
                  <option value='hostel'>Hostel</option>
                  <option value='exam'>Exam</option>
                  <option value='other'>Other</option>
                </select>
                
                {formData.paymentType === "other" && (
                  <input
                    type='text'
                    name='customPaymentType'
                    value={formData.customPaymentType}
                    onChange={handleChange}
                    placeholder='Specify type'
                    readOnly={mode === "View"}
                    className={`flex-1 border rounded-lg px-4 py-3 outline-none transition-colors ${
                      mode === "View"
                        ? "border-gray-300 bg-gray-100"
                        : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    }`}
                  />
                )}
              </div>
              {errors.paymentType && touched.paymentType && (
                <p className='mt-2 text-sm text-red-600 flex items-center'>
                  <svg className='w-4 h-4 mr-1' fill='currentColor' viewBox='0 0 20 20'>
                    <path
                      fillRule='evenodd'
                      d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                      clipRule='evenodd'
                    />
                  </svg>
                  {errors.paymentType}
                </p>
              )}
            </div>
            
            {/* Total Amount */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Total Amount <span className='text-red-500'>*</span>
              </label>
              <div className='relative'>
                <span className='absolute left-4 top-3.5 text-gray-500'>$</span>
                <input
                  type='number'
                  name='totalAmount'
                  value={formData.totalAmount}
                  onChange={handleChange}
                  onBlur={() => setTouched((prev) => ({ ...prev, totalAmount: true }))}
                  placeholder='0.00'
                  min='0'
                  step='0.01'
                  readOnly={mode === "View"}
                  className={`w-full border rounded-lg pl-8 pr-4 py-3 outline-none transition-colors ${
                    errors.totalAmount && touched.totalAmount
                      ? "border-red-500 focus:ring-2 focus:ring-red-500"
                      : mode === "View"
                      ? "border-gray-300 bg-gray-100"
                      : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                />
              </div>
              {errors.totalAmount && touched.totalAmount && (
                <p className='mt-2 text-sm text-red-600 flex items-center'>
                  <svg className='w-4 h-4 mr-1' fill='currentColor' viewBox='0 0 20 20'>
                    <path
                      fillRule='evenodd'
                      d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                      clipRule='evenodd'
                    />
                  </svg>
                  {errors.totalAmount}
                </p>
              )}
            </div>
            
            {/* Payment Mode */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Payment Mode <span className='text-red-500'>*</span>
              </label>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
                {["one_time", "installments", "both"].map((modeValue) => (
                  <label
                    key={modeValue}
                    className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                      formData.paymentMode === modeValue
                        ? "border-blue-500 bg-blue-50"
                        : mode === "View"
                        ? "border-gray-300 bg-gray-100"
                        : "border-gray-300 hover:border-blue-300"
                    } ${mode === "View" ? "cursor-default" : ""}`}
                  >
                    <input
                      type='radio'
                      name='paymentMode'
                      value={modeValue}
                      checked={formData.paymentMode === modeValue}
                      onChange={handleChange}
                      disabled={mode === "View"}
                      className='text-blue-600 focus:ring-blue-500 mr-3'
                    />
                    <span>
                      {modeValue === "one_time" && "One Time"}
                      {modeValue === "installments" && "Installments"}
                      {modeValue === "both" && "Both"}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          
          {/* One-time Payment Section */}
          {(formData.paymentMode === "one_time" || formData.paymentMode === "both") && (
            <div className='space-y-4 p-5 bg-blue-50 rounded-xl border border-blue-100'>
              <h3 className='text-lg font-semibold text-gray-800 flex items-center'>
                <svg
                  className='w-5 h-5 mr-2 text-blue-600'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path
                    fillRule='evenodd'
                    d='M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z'
                    clipRule='evenodd'
                  />
                </svg>
                One-time Payment
              </h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Amount</label>
                  <div className='relative'>
                    <span className='absolute left-4 top-3.5 text-gray-500'>$</span>
                    <input
                      type='number'
                      value={formData.totalAmount}
                      readOnly
                      className='w-full border border-gray-300 rounded-lg pl-8 pr-4 py-3 bg-gray-50'
                    />
                  </div>
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Due Date</label>
                  <input
                    type='date'
                    value={today}
                    readOnly
                    className='w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50'
                  />
                </div>
              </div>
            </div>
          )}
          
          {/* Installments Section */}
          {(formData.paymentMode === "installments" || formData.paymentMode === "both") && (
            <div className='space-y-4 p-5 bg-gray-50 rounded-xl border border-gray-200'>
              <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
                <h3 className='text-lg font-semibold text-gray-800 flex items-center'>
                  <svg
                    className='w-5 h-5 mr-2 text-gray-700'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zm5 0a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4z'
                      clipRule='evenodd'
                    />
                  </svg>
                  Installments
                </h3>
                
                {formData.totalAmount > 0 && mode !== "View" && (
                  <div className='flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-300'>
                    <label className='text-sm font-medium text-gray-700 whitespace-nowrap'>
                      Number of installments:
                    </label>
                    <select
                      value={formData.installments.length}
                      onChange={handleInstallmentCountChange}
                      className='border-0 outline-none focus:ring-2 focus:ring-blue-500 rounded-md'
                    >
                      {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                        <option key={num} value={num}>
                          {num}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              
              {formData.installments.length > 0 && (
                <div className='space-y-4'>
                  <div className='grid grid-cols-12 gap-3 text-xs font-medium text-gray-600 uppercase tracking-wide px-2'>
                    <div className='col-span-1'>#</div>
                    <div className='col-span-4'>Amount</div>
                    <div className='col-span-5'>Due Date</div>
                    {mode !== "View" && <div className='col-span-2'></div>}
                  </div>
                  
                  {formData.installments.map((installment, index) => (
                    <div
                      key={index}
                      className='grid grid-cols-12 gap-3 items-center p-3 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow transition-shadow'
                    >
                      <div className='col-span-1 text-sm font-medium text-gray-600'>
                        #{index + 1}
                      </div>
                      
                      <div className='col-span-4'>
                        <div className='relative'>
                          <span className='absolute left-3 top-2.5 text-gray-500 text-sm'>$</span>
                          <input
                            type='number'
                            value={installment.amount}
                            onChange={(e) =>
                              handleInstallmentChange(index, "amount", e.target.value)
                            }
                            readOnly={mode === "View"}
                            className={`w-full border rounded-lg pl-7 pr-3 py-2 outline-none ${
                              mode === "View"
                                ? "border-gray-300 bg-gray-100"
                                : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            }`}
                            step='0.01'
                          />
                        </div>
                      </div>
                      
                      <div className='col-span-5'>
                        <input
                          type='date'
                          value={installment.dueDate}
                          onChange={(e) =>
                            handleInstallmentChange(index, "dueDate", e.target.value)
                          }
                          min={today}
                          readOnly={mode === "View"}
                          className={`w-full border rounded-lg px-3 py-2 outline-none ${
                            errors[`installment-${index}-date`]
                              ? "border-red-500"
                              : mode === "View"
                              ? "border-gray-300 bg-gray-100"
                              : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          }`}
                        />
                        {errors[`installment-${index}-date`] && (
                          <p className='mt-1 text-xs text-red-600'>
                            {errors[`installment-${index}-date`]}
                          </p>
                        )}
                      </div>
                      
                      {mode !== "View" && (
                        <div className='col-span-2 flex justify-end'>
                          {formData.installments.length > 2 && (
                            <button
                              type='button'
                              onClick={() => handleDeleteInstallment(index)}
                              className='text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors'
                              title='Remove installment'
                            >
                              <svg
                                className='w-5 h-5'
                                fill='currentColor'
                                viewBox='0 0 20 20'
                              >
                                <path
                                  fillRule='evenodd'
                                  d='M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z'
                                  clipRule='evenodd'
                                />
                              </svg>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {errors.installments && (
                    <div className='p-3 bg-red-50 border border-red-200 rounded-lg'>
                      <p className='text-sm text-red-600 flex items-center'>
                        <svg
                          className='w-4 h-4 mr-2'
                          fill='currentColor'
                          viewBox='0 0 20 20'
                        >
                          <path
                            fillRule='evenodd'
                            d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                            clipRule='evenodd'
                          />
                        </svg>
                        {errors.installments}
                      </p>
                    </div>
                  )}
                  
                  <div className='flex justify-between items-center pt-2 border-t border-gray-200'>
                    <div className='text-sm text-gray-600'>
                      Total:{" "}
                      <span className='font-medium'>
                        ${" "}
                        {formData.installments
                          .reduce((sum, inst) => sum + inst.amount, 0)
                          .toFixed(2)}
                      </span>{" "}
                      / ${formData.totalAmount}
                    </div>
                    
                    {Math.abs(
                      formData.installments.reduce((sum, inst) => sum + inst.amount, 0) -
                        formData.totalAmount
                    ) > 0.01 && (
                      <div className='text-sm text-red-600 flex items-center'>
                        <svg
                          className='w-4 h-4 mr-1'
                          fill='currentColor'
                          viewBox='0 0 20 20'
                        >
                          <path
                            fillRule='evenodd'
                            d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                            clipRule='evenodd'
                          />
                        </svg>
                        Amounts don't match total!
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Status */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Status</label>
            <div className='flex gap-4'>
              {["active", "inactive"].map((status) => (
                <label
                  key={status}
                  className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                    formData.status === status
                      ? status === "active"
                        ? "border-green-500 bg-green-50"
                        : "border-red-500 bg-red-50"
                      : mode === "View"
                      ? "border-gray-300 bg-gray-100"
                      : "border-gray-300 hover:border-green-300"
                  } ${mode === "View" ? "cursor-default" : ""}`}
                >
                  <input
                    type='radio'
                    name='status'
                    value={status}
                    checked={formData.status === status}
                    onChange={handleChange}
                    disabled={mode === "View"}
                    className={`${
                      status === "active" ? "text-green-600" : "text-red-600"
                    } focus:ring-${status === "active" ? "green" : "red"}-500 mr-3`}
                  />
                  <span className='flex items-center'>
                    <svg
                      className={`w-4 h-4 mr-1 ${
                        status === "active" ? "text-green-600" : "text-red-600"
                      }`}
                      fill='currentColor'
                      viewBox='0 0 20 20'
                    >
                      {status === "active" ? (
                        <path
                          fillRule='evenodd'
                          d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                          clipRule='evenodd'
                        />
                      ) : (
                        <path
                          fillRule='evenodd'
                          d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                          clipRule='evenodd'
                        />
                      )}
                    </svg>
                    {status === "active" ? "Active" : "Inactive"}
                  </span>
                </label>
              ))}
            </div>
          </div>
          
          {/* Preview Section */}
          <div className='p-5 bg-gray-50 rounded-xl border border-gray-200'>
            <h3 className='text-lg font-semibold text-gray-800 mb-3 flex items-center'>
              <svg
                className='w-5 h-5 mr-2 text-gray-700'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z'
                  clipRule='evenodd'
                />
              </svg>
              Plan Preview
            </h3>
            <div className='text-sm space-y-2 bg-white p-4 rounded-lg'>
              <div className='flex'>
                <div className='w-32 font-medium text-gray-600'>Name:</div>
                <div>{formData.name || "Not specified"}</div>
              </div>
              <div className='flex'>
                <div className='w-32 font-medium text-gray-600'>Description:</div>
                <div>{formData.description || "None"}</div>
              </div>
              <div className='flex'>
                <div className='w-32 font-medium text-gray-600'>Payment Type:</div>
                <div>
                  {formData.paymentType === "other"
                    ? formData.customPaymentType
                    : formData.paymentType}
                </div>
              </div>
              <div className='flex'>
                <div className='w-32 font-medium text-gray-600'>Total Amount:</div>
                <div>
                  ${" "}
                  {formData.totalAmount
                    ? parseFloat(formData.totalAmount).toFixed(2)
                    : "0.00"}
                </div>
              </div>
              <div className='flex'>
                <div className='w-32 font-medium text-gray-600'>Payment Mode:</div>
                <div>
                  {formData.paymentMode === "one_time" && "One-time"}
                  {formData.paymentMode === "installments" && "Installments"}
                  {formData.paymentMode === "both" && "Both one-time and installments"}
                </div>
              </div>
              <div className='flex'>
                <div className='w-32 font-medium text-gray-600'>Status:</div>
                <div
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    formData.status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {formData.status}
                </div>
              </div>
              
              {formData.installments.length > 0 && (
                <div className='mt-3'>
                  <div className='font-medium text-gray-600 mb-2'>Installments:</div>
                  <div className='space-y-2'>
                    {formData.installments.map((inst, idx) => (
                      <div
                        key={idx}
                        className='flex items-center justify-between py-2 border-b border-gray-100 last:border-0'
                      >
                        <div className='flex items-center'>
                          <div className='w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-medium mr-3'>
                            {idx + 1}
                          </div>
                          <div>
                            <div className='font-medium'>${inst.amount.toFixed(2)}</div>
                            <div className='text-xs text-gray-500'>
                              Due on {new Date(inst.dueDate).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div
                          className={`text-xs px-2 py-1 rounded-full ${
                            new Date(inst.dueDate) < new Date()
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {new Date(inst.dueDate) < new Date() ? "Overdue" : "Upcoming"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Footer */}
          <div className='flex justify-end gap-4 pt-6 border-t border-gray-200'>
            <button
              type='button'
              onClick={onClose}
              className='px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium'
            >
              {mode === "View" ? "Close" : "Cancel"}
            </button>
            
            {mode !== "View" && (
              <button
                type='submit'
                className='px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium flex items-center'
              >
                <svg className='w-4 h-4 mr-2' fill='currentColor' viewBox='0 0 20 20'>
                  <path
                    fillRule='evenodd'
                    d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                    clipRule='evenodd'
                  />
                </svg>
                {mode === "Edit" ? "Update Plan" : "Create Plan"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default StudentPlanModal;