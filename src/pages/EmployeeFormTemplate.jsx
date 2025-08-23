import React from "react";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import CreateFormModal from "../components/FormTemplates/CreateFormModal";

function EmployeeFormTemplate() {

  const [iscreateFormModalOpen, setIsCreateFormModalOpen] = React.useState(false);


  function createFormModal(){
    console.log("clicked");
    setIsCreateFormModalOpen(true);
  }
  return (
    <div className='max-w-7xl mx-auto'>
      <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <div>
          <h2 className='font-semibold text-xl text-gray-800'>
            Employee Form Templates
          </h2>
          <p className='text-gray-500 mt-1 text-sm'>
            Create and manage form templates for your employees
          </p>
        </div>
        <button className='  bg-[#007a3123] hover:bg-[#007a3138] text-[#007a30] font-semibold py-2 px-6 rounded transition-all duration-300 ease-in-out transform  flex items-center justify-center gap-2 cursor-pointer' onClick={createFormModal}>
          <i class='fas fa-plus-circle'></i>
          Create Template
        </button>
      </div>

      <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-100 mt-6 overflow-x-auto'>
        <div className='flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4'>
          <div className='relative w-full md:w-1/3'>
            <i className='fas fa-search absolute left-3 top-3 text-gray-400'></i>
            <input
              type='text'
              placeholder='Search templates...'
              className='pl-10 pr-4 py-2.5 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200'
            />
          </div>

          <div className='flex flex-wrap gap-2'>
            <select className='border border-gray-300 rounded-lg px-4 py-2 text-gray-700 bg-white hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-200'>
              <option value=''>---Please Choose---</option>
              <option value='active'>Active</option>
              <option value='inactive'>Inactive</option>
            </select>
          </div>
        </div>
        <table className='w-full'>
          <thead>
            <tr className='text-left text-gray-500 border-b border-gray-200'>
              <th className='pb-4 font-medium'>Template</th>
              <th className='pb-4 font-medium'>Description</th>
              <th className='pb-4 font-medium'>Last Modified</th>
              <th className='pb-4 font-medium text-center'>Status</th>
              <th className='pb-4 font-medium text-center'>Actions</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-100'>
            <tr className='table-row'>
              <td className='py-4'>
                <div className='flex items-center'>
                  <div className='bg-blue-100 p-3 rounded-lg mr-4'>
                    <i className='fas fa-file-alt text-primary text-lg'></i>
                  </div>
                  <div>
                    <p className='font-medium text-gray-800'>Onboarding Form</p>
                    <p className='text-sm text-gray-500'>12 fields</p>
                  </div>
                </div>
              </td>
              <td className='py-4 text-gray-600'>
                Template for new employee onboarding process
              </td>
              <td className='py-4 text-gray-600'>2 days ago</td>
              <td className='py-4 text-center'>
                <span className='bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full'>
                  Active
                </span>
              </td>
              <td className='py-4 text-right'>
                <div className='flex justify-end space-x-2'>
                  <button
                    className='p-2 cursor-pointer rounded-lg bg-gray-100 text-gray-600 hover:bg-blue-500 hover:text-white transition duration-200 shadow-sm'
                    title='View'
                  >
                    <FaEye size={16} />
                  </button>
                  <button
                    className='p-2 cursor-pointer rounded-lg bg-gray-100 text-gray-600 hover:bg-green-500 hover:text-white transition duration-200 shadow-sm'
                    title='Edit'
                  >
                    <FaEdit size={16} />
                  </button>
                  <button
                    className='p-2 cursor-pointer rounded-lg bg-gray-100 text-gray-600 hover:bg-red-500 hover:text-white transition duration-200 shadow-sm'
                    title='Delete'
                  >
                    <FaTrash size={16} />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

      
      </div>

      {iscreateFormModalOpen &&   <CreateFormModal setIsCreateFormModalOpen={setIsCreateFormModalOpen} />}
    </div>
  );
}

export default EmployeeFormTemplate;
