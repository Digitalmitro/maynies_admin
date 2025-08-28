import React from "react";
import { FaEdit, FaTrash, FaEye, FaAlignRight } from "react-icons/fa";
import CreateFormModal from "../components/FormTemplates/CreateFormModal";
import SubmissionFormModal from "../components/FormTemplates/SubmissionFormModal";

function EmployeeFormTemplate() {
  const [modalState, setModalState] = React.useState(null);
  const [templates, setTemplates] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [templateId, setTemplateId] = React.useState(null);
  const [refresh, setRefresh] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);
  const [submissionModalState, setSubmissionModalState] = React.useState(null);

  // 🔍 Filters
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState("");

  React.useEffect(() => {
    const fetchTemplates = async () => {
      setLoading(true);
      setError("");

      try {
        const params = new URLSearchParams();
        if (search.trim()) params.append("search", search.trim());
        if (status) params.append("isActive", status === "active" ? true : false);

        const url = `${import.meta.env.VITE_BACKEND_URL}/api/employer/form/templates?${params.toString()}`;

        const response = await fetch(url, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          if (errorData?.message === "Invalid or expired refresh token") {
            setError("Invalid or expired refresh token");
          } else {
            setError(errorData?.message || "Failed to fetch templates");
          }
          setTemplates([]);
          return;
        }

        const data = await response.json();
        setTemplates(data.data || []);
      } catch (err) {
        console.error("Error fetching templates:", err.message);
        setError(err.message || "Failed to fetch templates");
      } finally {
        setLoading(false);
        setRefresh(false);
      }
    };

    fetchTemplates();
  }, [refresh, search, status]);

  function createFormModal() {
    setModalState("Create");
  }

  function handleView(mode, templateId) {
    setModalState(mode);
    setTemplateId(templateId);
  }

  function handleEdit(mode, templateId) {
    setModalState(mode);
    setTemplateId(templateId);
  }

  async function handleDelete(templateId) {
    if (!templateId) return;

    if (!window.confirm("Are you sure you want to delete this template?")) {
      return;
    }

    try {
      setDeleting(true);

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/employer/form/template/${templateId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Server error: ${response.status}`);
      }

      const data = await response.json();
      console.log("Template deleted:", data);

      setTemplates((prev) => prev.filter((t) => t._id !== templateId));
    } catch (error) {
      console.error("Error deleting template:", error.message);
      alert(error.message || "Failed to delete template");
    } finally {
      setDeleting(false);
    }
  }

  function handleSubmissionModal(templateId) {
    setSubmissionModalState("open");
    setTemplateId(templateId);
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-semibold text-xl text-gray-800">Employee Form Templates</h2>
          <p className="text-gray-500 mt-1 text-sm">
            Create and manage form templates for your employees
          </p>
        </div>
        <button
          className="bg-[#007a3123] hover:bg-[#007a3138] text-[#007a30] font-semibold py-2 px-6 rounded transition-all duration-300 ease-in-out transform flex items-center justify-center gap-2 cursor-pointer"
          onClick={createFormModal}
        >
          <i className="fas fa-plus-circle"></i>
          Create Template
        </button>
      </div>

      {/* Filters + Table */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mt-6 overflow-x-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          {/* 🔍 Search */}
          <div className="relative w-full md:w-1/3">
            <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
            <input
              type="text"
              placeholder="Search templates..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2.5 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
            />
          </div>

          {/* Status Filter */}
          <div className="flex flex-wrap gap-2">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 bg-white hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-200"
            >
              <option value="">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-500 border-b border-gray-200">
              <th className="pb-4 font-medium">Template</th>
              <th className="pb-4 font-medium">Description</th>
              <th className="pb-4 font-medium">Last Modified</th>
              <th className="pb-4 font-medium text-center">Status</th>
              <th className="pb-4 font-medium text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan="5" className="py-6 text-center text-gray-500">
                  Loading templates...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="5" className="py-6 text-center text-red-500 space-y-3">
                  <div>{error}</div>
                  {error === "Invalid or expired refresh token" && (
                    <button
                      onClick={() => setRefresh(true)}
                      className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200"
                    >
                      Refresh Session
                    </button>
                  )}
                </td>
              </tr>
            ) : templates?.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-6 text-center text-gray-500">
                  No templates found
                </td>
              </tr>
            ) : (
              templates.map((template) => (
                <tr key={template._id} className="table-row">
                  <td className="py-4">
                    <div className="flex items-center">
                      <div className="bg-blue-100 p-3 rounded-lg mr-4">
                        <i className="fas fa-file-alt text-primary text-lg"></i>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{template.title}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 text-gray-600">{template.description}</td>
                  <td className="py-4 text-gray-600">
                    {new Date(template.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 text-center">
                    <span
                      className={`${
                        template.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      } text-xs font-medium px-2.5 py-0.5 rounded-full`}
                    >
                      {template.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <button
                        className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-blue-500 hover:text-white transition duration-200 shadow-sm"
                        title="View"
                        onClick={() => handleView("View", template._id)}
                      >
                        <FaEye size={16} />
                      </button>
                      <button
                        className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-green-500 hover:text-white transition duration-200 shadow-sm"
                        title="Edit"
                        onClick={() => handleEdit("Edit", template._id)}
                      >
                        <FaEdit size={16} />
                      </button>
                      <button
                        className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-red-500 hover:text-white transition duration-200 shadow-sm"
                        title="Delete"
                        onClick={() => handleDelete(template._id)}
                      >
                        <FaTrash size={16} />
                      </button>
                      <button
                        className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-purple-500 hover:text-white transition duration-200 shadow-sm"
                        title="Submissions"
                        onClick={() => handleSubmissionModal(template._id)}
                      >
                        <FaAlignRight size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      {modalState && (
        <CreateFormModal
          modalState={modalState}
          setModalState={setModalState}
          templateId={templateId}
          setRefresh={setRefresh}
        />
      )}
      {submissionModalState && (
        <SubmissionFormModal
          modalState={submissionModalState}
          setModalState={setSubmissionModalState}
          templateId={templateId}
        />
      )}

      {/* Deleting Overlay */}
      {deleting && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
            <div className="animate-spin h-8 w-8 border-4 border-green-600 border-t-transparent rounded-full mb-4"></div>
            <p className="text-gray-700 font-medium">Deleting template...</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmployeeFormTemplate;
