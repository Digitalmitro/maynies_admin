import { useState } from "react";
import {
  IoIosAdd,
  IoIosRemove,
  IoIosClose,
  IoIosOptions,
} from "react-icons/io";

// Define the FormField interface

function CreateFormModal({ setIsCreateFormModalOpen }) {
  const [formTemplate, setFormTemplate] = useState({
    name: "",
    description: "",
    isActive: true,
    fields: [],
  });

  const addField = () => {
    const newField = {
      id: `field_${formTemplate.fields.length + 1}`,
      name: "",
      label: "",
      type: "text",
      required: false,
      options: [],
      validations: {},
    };

    setFormTemplate({
      ...formTemplate,
      fields: [...formTemplate.fields, newField],
    });
  };

  const removeField = (index) => {
    const updatedFields = formTemplate.fields.filter((_, i) => i !== index);
    setFormTemplate({
      ...formTemplate,
      fields: updatedFields,
    });
  };

  const updateField = (index, key, value) => {
    const updatedFields = [...formTemplate.fields];
    updatedFields[index] = {
      ...updatedFields[index],
      [key]: value,
    };

    // If type is changed to not be dropdown or radio, clear options
    if (key === "type" && value !== "dropdown" && value !== "radio") {
      updatedFields[index].options = [];
    }

    setFormTemplate({
      ...formTemplate,
      fields: updatedFields,
    });
  };

  const addOption = (fieldIndex) => {
    const updatedFields = [...formTemplate.fields];
    updatedFields[fieldIndex].options = [
      ...(updatedFields[fieldIndex].options || []),
      { label: "", value: "" },
    ];
    setFormTemplate({
      ...formTemplate,
      fields: updatedFields,
    });
  };

  const removeOption = (fieldIndex, optionIndex) => {
    const updatedFields = [...formTemplate.fields];
    updatedFields[fieldIndex].options =
      updatedFields[fieldIndex].options?.filter((_, i) => i !== optionIndex) ||
      [];
    setFormTemplate({
      ...formTemplate,
      fields: updatedFields,
    });
  };

  const updateOption = (fieldIndex, optionIndex, key, value) => {
    const updatedFields = [...formTemplate.fields];
    if (updatedFields[fieldIndex].options) {
      updatedFields[fieldIndex].options[optionIndex] = {
        ...updatedFields[fieldIndex].options[optionIndex],
        [key]: value,
      };
    }
    setFormTemplate({
      ...formTemplate,
      fields: updatedFields,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/employer/form/template`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(formTemplate),
        }
      );
  
      if (!response.ok) {
        throw new Error("Failed to create form template");
      }
  
      const data = await response.json();
      console.log("Form Template Created:", data);
  
      // modal band kardo
      setIsCreateFormModalOpen(false);
  
    } catch (error) {
      console.error("Error creating form template:", error.message);
    }
  };

  return (
    <div className='fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto'>
        {/* Header */}
        <div className='bg-white p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sticky top-0 z-10'>
          <div className=''>
            <h2 className='font-semibold text-xl text-gray-800'>
              Create Form Template
            </h2>
            <p className='text-gray-500 text-sm'>
              Create and manage form templates for your employees
            </p>
          </div>
          <button
            className='bg-[#007a3123] hover:bg-[#007a3138] text-[#007a30] font-semibold p-2 rounded transition-all duration-300 flex items-center justify-center cursor-pointer'
            onClick={() => setIsCreateFormModalOpen(false)}
          >
            <IoIosClose size={24} />
          </button>
        </div>

        {/* Form Content */}
        <div className='p-6'>
          <form onSubmit={handleSubmit}>
            {/* Basic Information */}
            <div className='mb-8'>
              <h3 className='text-lg font-medium text-gray-800 mb-4'>
                Basic Information
              </h3>
              <div className='grid grid-cols-1  gap-6'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Form Name *
                  </label>
                  <input
                    type='text'
                    required
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00953B] focus:border-[#00953B]'
                    value={formTemplate.name}
                    onChange={(e) =>
                      setFormTemplate({ ...formTemplate, name: e.target.value })
                    }
                    placeholder='e.g., Expense Report Form'
                  />
                </div>
              </div>

              <div className='mt-6'>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Description
                </label>
                <textarea
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00953B] focus:border-[#00953B]'
                  rows={3}
                  value={formTemplate.description}
                  onChange={(e) =>
                    setFormTemplate({
                      ...formTemplate,
                      description: e.target.value,
                    })
                  }
                  placeholder='Describe the purpose of this form...'
                />
              </div>
            </div>

            {/* Form Fields */}
            <div className='mb-8'>
              <div className='flex justify-between items-center mb-6'>
                <h3 className='text-lg font-medium text-gray-800'>
                  Form Fields
                </h3>
                <button
                  type='button'
                  className='bg-[#00953B] hover:bg-[#007a30] text-white font-medium py-2 px-4 rounded-lg flex items-center'
                  onClick={addField}
                >
                  <IoIosAdd size={20} className='mr-1' />
                  Add Field
                </button>
              </div>

              <div className='space-y-6'>
                {formTemplate.fields.map((field, index) => (
                  <div
                    key={field.id}
                    className='bg-gray-50 p-5 rounded-lg border border-gray-200'
                  >
                    <div className='flex justify-between items-center mb-4'>
                      <h4 className='font-medium text-gray-700'>
                        Field {index + 1}
                      </h4>
                      <button
                        type='button'
                        className='text-red-500 hover:text-red-700'
                        onClick={() => removeField(index)}
                      >
                        <IoIosRemove size={20} />
                      </button>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div>
                        <label className='block text-sm text-gray-600 mb-1'>
                          Field ID *
                        </label>
                        <input
                          type='text'
                          required
                          className='w-full px-3 py-2 border border-gray-300 rounded-lg'
                          value={field.id}
                          onChange={(e) =>
                            updateField(index, "id", e.target.value)
                          }
                          placeholder='e.g., expense_date'
                        />
                      </div>

                      <div>
                        <label className='block text-sm text-gray-600 mb-1'>
                          Name *
                        </label>
                        <input
                          type='text'
                          required
                          className='w-full px-3 py-2 border border-gray-300 rounded-lg'
                          value={field.name}
                          onChange={(e) =>
                            updateField(index, "name", e.target.value)
                          }
                          placeholder='e.g., expenseDate'
                        />
                      </div>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'>
                      <div>
                        <label className='block text-sm text-gray-600 mb-1'>
                          Label *
                        </label>
                        <input
                          type='text'
                          required
                          className='w-full px-3 py-2 border border-gray-300 rounded-lg'
                          value={field.label}
                          onChange={(e) =>
                            updateField(index, "label", e.target.value)
                          }
                          placeholder='e.g., Date of Expense'
                        />
                      </div>

                      <div>
                        <label className='block text-sm text-gray-600 mb-1'>
                          Type *
                        </label>
                        <select
                          className='w-full px-3 py-2 border border-gray-300 rounded-lg'
                          value={field.type}
                          onChange={(e) =>
                            updateField(index, "type", e.target.value)
                          }
                        >
                          <option value='text'>Text</option>
                          <option value='number'>Number</option>
                          <option value='email'>Email</option>
                          <option value='date'>Date</option>
                          <option value='dropdown'>Dropdown</option>
                          <option value='checkbox'>Checkbox</option>
                          <option value='radio'>Radio</option>
                          <option value='file'>File Upload</option>
                          <option value='textarea'>Text Area</option>
                        </select>
                      </div>
                    </div>

                    <div className='mt-4 flex items-center'>
                      <input
                        type='checkbox'
                        className='h-4 w-4 text-[#00953B]'
                        checked={field.required}
                        onChange={(e) =>
                          updateField(index, "required", e.target.checked)
                        }
                      />
                      <label className='ml-2 text-sm text-gray-600'>
                        Required Field
                      </label>
                    </div>

                    {(field.type === "dropdown" || field.type === "radio") && (
                      <div className='mt-4'>
                        <div className='flex items-center justify-between mb-2'>
                          <label className='block text-sm text-gray-600'>
                            Options
                          </label>
                          <button
                            type='button'
                            className='text-[#00953B] hover:text-[#007a30] flex items-center text-sm'
                            onClick={() => addOption(index)}
                          >
                            <IoIosAdd size={16} className='mr-1' />
                            Add Option
                          </button>
                        </div>

                        <div className='space-y-3'>
                          {field.options?.map((option, optionIndex) => (
                            <div
                              key={optionIndex}
                              className='flex items-center gap-3'
                            >
                              <div className='flex-1 grid grid-cols-2 gap-2'>
                                <div>
                                  <label className='block text-xs text-gray-500 mb-1'>
                                    Label
                                  </label>
                                  <input
                                    type='text'
                                    className='w-full px-3 py-2 border border-gray-300 rounded-lg text-sm'
                                    value={option.label}
                                    onChange={(e) =>
                                      updateOption(
                                        index,
                                        optionIndex,
                                        "label",
                                        e.target.value
                                      )
                                    }
                                    placeholder='Option label'
                                  />
                                </div>
                                <div>
                                  <label className='block text-xs text-gray-500 mb-1'>
                                    Value
                                  </label>
                                  <input
                                    type='text'
                                    className='w-full px-3 py-2 border border-gray-300 rounded-lg text-sm'
                                    value={option.value}
                                    onChange={(e) =>
                                      updateOption(
                                        index,
                                        optionIndex,
                                        "value",
                                        e.target.value
                                      )
                                    }
                                    placeholder='Option value'
                                  />
                                </div>
                              </div>
                              <button
                                type='button'
                                className='text-red-500 hover:text-red-700 mt-4'
                                onClick={() => removeOption(index, optionIndex)}
                              >
                                <IoIosRemove size={18} />
                              </button>
                            </div>
                          ))}

                          {(!field.options || field.options.length === 0) && (
                            <div className='text-center py-3 text-gray-400 text-sm border border-dashed border-gray-300 rounded-lg'>
                              No options added yet
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {formTemplate.fields.length === 0 && (
                  <div className='text-center py-8 border border-dashed border-gray-300 rounded-lg'>
                    <IoIosOptions
                      size={40}
                      className='mx-auto text-gray-300 mb-2'
                    />
                    <p className='text-gray-500'>No fields added yet</p>
                    <button
                      type='button'
                      className='text-[#00953B] hover:text-[#007a30] font-medium mt-2'
                      onClick={addField}
                    >
                      Add your first field
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className='mt-6'>
              <div className='flex items-center'>
                <input
                  type='checkbox'
                  id='isActive'
                  className='h-4 w-4 text-[#00953B] focus:ring-[#00953B] border-gray-300 rounded'
                  checked={formTemplate.isActive}
                  onChange={(e) =>
                    setFormTemplate({
                      ...formTemplate,
                      isActive: e.target.checked,
                    })
                  }
                />
                <label
                  htmlFor='isActive'
                  className='ml-2 block text-sm text-gray-700'
                >
                  Form is active
                </label>
              </div>
            </div>
            {/* Form Actions */}
            <div className='flex justify-end gap-4 pt-6 border-t border-gray-200'>
              <button
                type='button'
                className='px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50'
                onClick={() => setIsCreateFormModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type='submit'
                className='px-5 py-2 bg-[#00953B] text-white rounded-lg hover:bg-[#007a30]'
                disabled={
                  formTemplate.fields.length === 0 || !formTemplate.name
                }
              >
                Create Template
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateFormModal;
