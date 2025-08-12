import React, { useState } from "react";

export default function StudentPlan() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    paymentType: "",
    totalAmount: "",
    currency: "INR",
    paymentMode: "",
    installmentCount: "",
    installmentAmounts: [],
    lateFeeEnabled: false,
    lateFeeType: "",
    lateFeeValue: "",
    startDate: "",
    endDate: "",
    status: "active",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleInstallmentChange = (index, field, value) => {
    const updated = [...form.installmentAmounts];
    if (!updated[index]) updated[index] = { amount: "", dueDate: "" };
    updated[index][field] = value;
    setForm((prev) => ({ ...prev, installmentAmounts: updated }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  // Convert string fields to numbers
  const payload = {
    ...form,
    totalAmount: Number(form.totalAmount),
    installmentCount: Number(form.installmentCount),
    lateFeeValue: Number(form.lateFeeValue),
    installmentAmounts: form.installmentAmounts.map(item => ({
      ...item,
      amount: Number(item.amount) // in case these also need numbers
    }))
  };

  console.log("Form submitted:", payload);

  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/student/plans/admin`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (res.ok) {
    console.log("Plan created successfully:", data);
  } else {
    console.error("Error creating plan:", data);
  }
};


  return (
  <form
  onSubmit={handleSubmit}
  className="max-w-4xl mx-auto p-4 sm:p-6 bg-white shadow rounded-lg space-y-6"
>
  <h2 className="text-xl sm:text-2xl font-bold">Create Plan</h2>

  {/* Plan Name */}
  <div>
    <label className="block font-medium">Plan Name</label>
    <input
      type="text"
      name="name"
      value={form.name}
      onChange={handleChange}
      className="border rounded p-2 w-full"
    />
  </div>

  {/* Description */}
  <div>
    <label className="block font-medium">Description</label>
    <textarea
      name="description"
      value={form.description}
      onChange={handleChange}
      className="border rounded p-2 w-full"
    />
  </div>

  {/* Payment Type */}
  <div>
    <label className="block font-medium">Payment Type</label>
    <div className="flex flex-wrap gap-4">
      {["tuition", "hostel", "exam"].map((type) => (
        <label key={type} className="flex items-center gap-1">
          <input
            type="radio"
            name="paymentType"
            value={type}
            checked={form.paymentType === type}
            onChange={handleChange}
          />
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </label>
      ))}
    </div>
  </div>

  {/* Total Amount + Currency */}
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div>
      <label className="block font-medium">Total Amount</label>
      <input
        type="number"
        name="totalAmount"
        value={form.totalAmount}
        onChange={handleChange}
        className="border rounded p-2 w-full"
      />
    </div>
    <div>
      <label className="block font-medium">Currency</label>
      <select
        name="currency"
        value={form.currency}
        onChange={handleChange}
        className="border rounded p-2 w-full"
      >
        <option value="INR">INR</option>
        <option value="USD">USD</option>
      </select>
    </div>
  </div>

  {/* Payment Mode */}
  <div>
    <label className="block font-medium">Payment Mode</label>
    <div className="flex flex-wrap gap-4">
      {["one_time", "installments", "both"].map((mode) => (
        <label key={mode} className="flex items-center gap-1">
          <input
            type="radio"
            name="paymentMode"
            value={mode}
            checked={form.paymentMode === mode}
            onChange={handleChange}
          />
          {mode.replace("_", " ").toUpperCase()}
        </label>
      ))}
    </div>
  </div>

  {/* Installments */}
  {(form.paymentMode === "installments" ||
    form.paymentMode === "both") && (
    <>
      <div>
        <label className="block font-medium">Installment Count</label>
        <input
          type="number"
          name="installmentCount"
          value={form.installmentCount}
          onChange={handleChange}
          className="border rounded p-2 w-full"
        />
      </div>

      {/* Installment Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse min-w-[500px]">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">#</th>
              <th className="border p-2">Amount</th>
              <th className="border p-2">Due Date</th>
            </tr>
          </thead>
          <tbody>
            {Array.from(
              { length: Number(form.installmentCount) || 0 },
              (_, i) => (
                <tr key={i}>
                  <td className="border p-2">{i + 1}</td>
                  <td className="border p-2">
                    <input
                      type="number"
                      value={form.installmentAmounts[i]?.amount || ""}
                      onChange={(e) =>
                        handleInstallmentChange(
                          i,
                          "amount",
                          e.target.value
                        )
                      }
                      className="border rounded p-1 w-full"
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      type="date"
                      value={form.installmentAmounts[i]?.dueDate || ""}
                      onChange={(e) =>
                        handleInstallmentChange(
                          i,
                          "dueDate",
                          e.target.value
                        )
                      }
                      className="border rounded p-1 w-full"
                    />
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </>
  )}

  {/* Late Fee */}
  <div>
    <label className="block font-medium">
      <input
        type="checkbox"
        name="lateFeeEnabled"
        checked={form.lateFeeEnabled}
        onChange={handleChange}
      />{" "}
      Enable Late Fee
    </label>
    {form.lateFeeEnabled && (
      <div className="mt-2 space-y-2">
        <div className="flex flex-wrap gap-4">
          {["fixed", "percentage"].map((type) => (
            <label key={type} className="flex items-center gap-1">
              <input
                type="radio"
                name="lateFeeType"
                value={type}
                checked={form.lateFeeType === type}
                onChange={handleChange}
              />
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </label>
          ))}
        </div>
        <input
          type="number"
          name="lateFeeValue"
          value={form.lateFeeValue}
          onChange={handleChange}
          placeholder="Late fee value"
          className="border rounded p-2 w-full"
        />
      </div>
    )}
  </div>

  {/* Plan Duration */}
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div>
      <label className="block font-medium">Start Date</label>
      <input
        type="date"
        name="startDate"
        value={form.startDate}
        onChange={handleChange}
        className="border rounded p-2 w-full"
      />
    </div>
    <div>
      <label className="block font-medium">End Date</label>
      <input
        type="date"
        name="endDate"
        value={form.endDate}
        onChange={handleChange}
        className="border rounded p-2 w-full"
      />
    </div>
  </div>

  {/* Status */}
  <div>
    <label className="block font-medium">Status</label>
    <div className="flex flex-wrap gap-4">
      {["active", "inactive"].map((status) => (
        <label key={status} className="flex items-center gap-1">
          <input
            type="radio"
            name="status"
            value={status}
            checked={form.status === status}
            onChange={handleChange}
          />
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </label>
      ))}
    </div>
  </div>

  {/* Submit */}
  <button
    type="submit"
    className="bg-blue-600 hover:bg-blue-700 transition text-white px-4 py-2 rounded w-full sm:w-auto"
  >
    Save Plan
  </button>
</form>

  );
}
