import React, { useState, useEffect } from 'react';

const StudentPlan = () => {
  // State for form data
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    paymentType: '',
    totalAmount: '',
    paymentMode: 'one_time',
    oneTimePaymentAmount: '',
    installmentCount: 0,
    installmentAmounts: [],
    lateFeeType: 'fixed',
    lateFeeValue: '',
    startDate: '',
    endDate: '',
    status: 'active'
  });

  // State for errors
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate installments automatically when totalAmount, installmentCount, startDate or paymentMode changes
  useEffect(() => {
    if (formData.paymentMode !== 'one_time' && formData.installmentCount > 0 && formData.totalAmount && formData.startDate) {
      const total = parseFloat(formData.totalAmount);
      const count = parseInt(formData.installmentCount);
      const installmentAmount = total / count;
      
      const newInstallments = [];
      const startDate = new Date(formData.startDate);
      
      for (let i = 0; i < count; i++) {
        const dueDate = new Date(startDate);
        dueDate.setMonth(startDate.getMonth() + i);
        
        newInstallments.push({
          amount: installmentAmount,
          dueDate: dueDate.toISOString().split('T')[0]
        });
      }
      
      setFormData(prev => ({
        ...prev,
        installmentAmounts: newInstallments,
        oneTimePaymentAmount: prev.paymentMode === 'both' ? total : prev.oneTimePaymentAmount
      }));
    }
  }, [formData.totalAmount, formData.installmentCount, formData.startDate, formData.paymentMode]);

  // Update oneTimePaymentAmount when totalAmount changes for one_time mode
  useEffect(() => {
    if (formData.paymentMode === 'one_time' && formData.totalAmount) {
      setFormData(prev => ({
        ...prev,
        oneTimePaymentAmount: prev.totalAmount
      }));
    }
  }, [formData.totalAmount, formData.paymentMode]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle installment amount changes
  const handleInstallmentChange = (index, field, value) => {
    const updatedInstallments = [...formData.installmentAmounts];
    updatedInstallments[index] = {
      ...updatedInstallments[index],
      [field]: field === 'amount' ? parseFloat(value) || 0 : value
    };
    
    setFormData({
      ...formData,
      installmentAmounts: updatedInstallments
    });
  };

  // Add new installment
  const addInstallment = () => {
    const newInstallments = [...formData.installmentAmounts, { amount: 0, dueDate: '' }];
    setFormData({
      ...formData,
      installmentAmounts: newInstallments,
      installmentCount: newInstallments.length
    });
  };

  // Remove installment
  const removeInstallment = (index) => {
    const updatedInstallments = formData.installmentAmounts.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      installmentAmounts: updatedInstallments,
      installmentCount: updatedInstallments.length
    });
  };

  // Form validation
  const validateForm = () => {
    const errors = {};
    
    if (!formData.name) errors.name = 'Name is required';
    if (!formData.paymentType) errors.paymentType = 'Payment type is required';
    if (!formData.totalAmount || formData.totalAmount <= 0) 
      errors.totalAmount = 'Valid total amount is required';
    
    if (formData.paymentMode !== 'installments') {
      if (!formData.oneTimePaymentAmount || formData.oneTimePaymentAmount <= 0) 
        errors.oneTimePaymentAmount = 'Valid one-time amount is required';
    }
    
    if (formData.paymentMode !== 'one_time') {
      if (formData.installmentCount <= 0) 
        errors.installmentCount = 'At least one installment is required';
      
      formData.installmentAmounts.forEach((installment, index) => {
        if (!installment.amount || installment.amount <= 0) 
          errors[`installmentAmount_${index}`] = `Valid amount required for installment ${index + 1}`;
        if (!installment.dueDate) 
          errors[`installmentDueDate_${index}`] = `Due date required for installment ${index + 1}`;
      });
    }
    
    if (!formData.lateFeeValue || formData.lateFeeValue <= 0) 
      errors.lateFeeValue = 'Valid late fee value is required';
    if (!formData.startDate) errors.startDate = 'Start date is required';
    if (!formData.endDate) errors.endDate = 'End date is required';
    
    return errors;
  };

  // Handle form submission with API call
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous states
    setErrors({});
    setSubmitError("");
    setSubmitSuccess(false);

    // Validate form
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare data for API
      const payload = {
        ...formData,
        totalAmount: Number.parseFloat(formData.totalAmount),
        oneTimePaymentAmount:
          formData.paymentMode === "installments" ? null : Number.parseFloat(formData.oneTimePaymentAmount),
        installmentCount: Number(formData.paymentMode === "one_time" ? 0 : formData.installmentCount),
        lateFeeValue: Number.parseFloat(formData.lateFeeValue),
        installmentAmounts: formData.installmentAmounts.map((installment) => ({
          amount: Number.parseFloat(installment.amount),
          dueDate: installment.dueDate,
        })),
      };

      // API call using fetch
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/student/plans/admin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Add authentication token if needed
          // "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create payment plan");
      }

      // Success handling
      setSubmitSuccess(true);

      // Reset form after successful submission
      setFormData({
        name: "",
        description: "",
        paymentType: "",
        totalAmount: "",
        paymentMode: "one_time",
        oneTimePaymentAmount: "",
        installmentCount: 0,
        installmentAmounts: [],
        lateFeeType: "fixed",
        lateFeeValue: "",
        startDate: "",
        endDate: "",
        status: "active",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitError(error.message || "Failed to create payment plan. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate total of installments
  const installmentsTotal = formData.installmentAmounts.reduce((sum, installment) => sum + (parseFloat(installment.amount) || 0), 0);
  
  // Check if installments match total amount
  const installmentsMatchTotal = Math.abs(installmentsTotal - parseFloat(formData.totalAmount || 0)) < 0.01;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800">Create Payment Plan</h2>
            <p className="mt-1 text-sm text-gray-600">Create a new payment plan for tuition, hostel, or exam fees</p>
          </div>
          
          {/* Success and Error Messages */}
          {submitSuccess && (
            <div className="m-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
              Payment plan created successfully!
            </div>
          )}
          
          {submitError && (
            <div className="m-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {submitError}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
            {/* Basic Information */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-6">
                <div className="sm:col-span-6">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Plan Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full border rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    name="description"
                    id="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="paymentType" className="block text-sm font-medium text-gray-700">
                    Payment Type
                  </label>
                  <select
                    name="paymentType"
                    id="paymentType"
                    value={formData.paymentType}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full border rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                      errors.paymentType ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select Type</option>
                    <option value="tuition">Tuition</option>
                    <option value="hostel">Hostel</option>
                    <option value="exam">Exam</option>
                  </select>
                  {errors.paymentType && <p className="mt-1 text-sm text-red-600">{errors.paymentType}</p>}
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="totalAmount" className="block text-sm font-medium text-gray-700">
                    Total Amount (₹)
                  </label>
                  <input
                    type="number"
                    name="totalAmount"
                    id="totalAmount"
                    value={formData.totalAmount}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full border rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                      errors.totalAmount ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.totalAmount && <p className="mt-1 text-sm text-red-600">{errors.totalAmount}</p>}
                </div>
              </div>
            </div>

            {/* Payment Mode */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Mode</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-6">
                <div className="sm:col-span-6">
                  <label htmlFor="paymentMode" className="block text-sm font-medium text-gray-700">
                    Payment Mode
                  </label>
                  <select
                    name="paymentMode"
                    id="paymentMode"
                    value={formData.paymentMode}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="one_time">One Time Payment</option>
                    <option value="installments">Installments</option>
                    <option value="both">Both Options</option>
                  </select>
                </div>

                {(formData.paymentMode === 'one_time' || formData.paymentMode === 'both') && (
                  <div className="sm:col-span-3">
                    <label htmlFor="oneTimePaymentAmount" className="block text-sm font-medium text-gray-700">
                      One-Time Payment Amount (₹)
                      {formData.paymentMode === 'both' && (
                        <span className="text-xs text-gray-500 ml-1">(Admin can adjust)</span>
                      )}
                    </label>
                    <input
                      type="number"
                      name="oneTimePaymentAmount"
                      id="oneTimePaymentAmount"
                      value={formData.oneTimePaymentAmount}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full border rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                        errors.oneTimePaymentAmount ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.oneTimePaymentAmount && (
                      <p className="mt-1 text-sm text-red-600">{errors.oneTimePaymentAmount}</p>
                    )}
                  </div>
                )}

                {(formData.paymentMode === 'installments' || formData.paymentMode === 'both') && (
                  <div className="sm:col-span-6">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h4 className="text-md font-medium text-gray-700">Installments</h4>
                        <p className="text-sm text-gray-500">
                          Amounts are automatically calculated but can be adjusted
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div>
                          <label htmlFor="installmentCount" className="block text-sm font-medium text-gray-700">
                            Number of Installments
                          </label>
                          <select
                            name="installmentCount"
                            id="installmentCount"
                            value={formData.installmentCount}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          >
                            {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(num => (
                              <option key={num} value={num}>{num}</option>
                            ))}
                          </select>
                        </div>
                        <button
                          type="button"
                          onClick={addInstallment}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          + Add Custom
                        </button>
                      </div>
                    </div>

                    {!installmentsMatchTotal && (
                      <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                        <p className="text-sm text-yellow-800">
                          <span className="font-medium">Warning:</span> The total of installments (₹{installmentsTotal.toFixed(2)}) does not match the total amount (₹{formData.totalAmount}).
                        </p>
                      </div>
                    )}

                    {formData.installmentAmounts.map((installment, index) => (
                      <div key={index} className="grid grid-cols-1 gap-4 sm:grid-cols-6 mb-4 p-4 bg-gray-50 rounded-md">
                        <div className="sm:col-span-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Amount #{index + 1} (₹)
                          </label>
                          <input
                            type="number"
                            value={installment.amount}
                            onChange={(e) => handleInstallmentChange(index, 'amount', e.target.value)}
                            className={`mt-1 block w-full border rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                              errors[`installmentAmount_${index}`] ? 'border-red-500' : 'border-gray-300'
                            }`}
                          />
                          {errors[`installmentAmount_${index}`] && (
                            <p className="mt-1 text-sm text-red-600">{errors[`installmentAmount_${index}`]}</p>
                          )}
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Due Date #{index + 1}
                          </label>
                          <input
                            type="date"
                            value={installment.dueDate}
                            onChange={(e) => handleInstallmentChange(index, 'dueDate', e.target.value)}
                            className={`mt-1 block w-full border rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                              errors[`installmentDueDate_${index}`] ? 'border-red-500' : 'border-gray-300'
                            }`}
                          />
                          {errors[`installmentDueDate_${index}`] && (
                            <p className="mt-1 text-sm text-red-600">{errors[`installmentDueDate_${index}`]}</p>
                          )}
                        </div>

                        <div className="sm:col-span-2 flex items-end">
                          <button
                            type="button"
                            onClick={() => removeInstallment(index)}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Late Fee Details */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Late Fee Details</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="lateFeeType" className="block text-sm font-medium text-gray-700">
                    Late Fee Type
                  </label>
                  <select
                    name="lateFeeType"
                    id="lateFeeType"
                    value={formData.lateFeeType}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="fixed">Fixed Amount</option>
                    <option value="percentage">Percentage</option>
                  </select>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="lateFeeValue" className="block text-sm font-medium text-gray-700">
                    {formData.lateFeeType === 'fixed' ? 'Late Fee Amount (₹)' : 'Late Fee Percentage (%)'}
                  </label>
                  <input
                    type="number"
                    name="lateFeeValue"
                    id="lateFeeValue"
                    value={formData.lateFeeValue}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full border rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                      errors.lateFeeValue ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.lateFeeValue && <p className="mt-1 text-sm text-red-600">{errors.lateFeeValue}</p>}
                </div>
              </div>
            </div>

            {/* Date Information */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Date Information</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    id="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full border rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                      errors.startDate ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.startDate && <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>}
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                    End Date
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    id="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full border rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                      errors.endDate ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.endDate && <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>}
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="pb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Status</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    name="status"
                    id="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                  isSubmitting ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                {isSubmitting ? 'Creating...' : 'Create Plan'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentPlan;