import React, { useState } from "react";
import StudentPlans from "../components/StudentPlan/StudentPlans.comp";
import StudentPlanModal from "../components/StudentPlan/StudentPlanModal.comp";
import StudentPlanEnrollmentsModal from "../components/StudentPlan/StudentPlanEnrollmentsModal.comp";

function StudentPlan() {
  const [modalState, setModalState] = React.useState(null);
  const [selectedPlanId, setSelectedPlanId] = React.useState(null);
  const [refresh, setRefresh] = useState(false);
const [enrollmentModalState, setEnrollmentModalState] = useState(null);
  function handleCreatePlan() {
    setModalState("Create");
  }

  return (
    <div className='student-plan-page p-6'>
      {/* Header Section */}
      <div className='student_plan-header  bg-gray-50  flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-amber-50 p-5 mb-6'>
        <div>
          <h3 className='text-2xl font-semibold text-gray-800'>
            Student Plan and Payment
          </h3>
          <p className='mt-2 text-gray-600 text-sm md:text-base max-w-2xl'>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic, rerum.
            Quam facere vel quo, nam natus suscipit maiores eum alias eius quasi
            placeat doloribus hic distinctio aperiam modi totam vitae!
          </p>
        </div>
        <div>
          <button
            className='px-5 py-2 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition'
            onClick={handleCreatePlan}
          >
            Create Plan
          </button>
        </div>
      </div>

      {/* Body Section */}
      <div className=' bg-gray-50 rounded-xl  shadow-sm min-h-[200px]  text-gray-500'>
        <StudentPlans
          setModalState={setModalState}
          setEnrollmentModalState={setEnrollmentModalState}
          setSelectedPlanId={setSelectedPlanId}
          refresh={refresh}
          setRefresh={setRefresh}
        />
      </div>

      {modalState && (
        <StudentPlanModal
          mode={modalState}
          onClose={() => setModalState(null)}
          planId={selectedPlanId} // Pass planId for Edit/Delete modes
          setRefresh={setRefresh}
        />
      )}
      {enrollmentModalState && (
        <StudentPlanEnrollmentsModal
          mode={enrollmentModalState}
          onClose={() => setEnrollmentModalState(null)}
          planId={selectedPlanId} // Pass planId for Edit/Delete modes
        />
      )}

    </div>
  );
}

export default StudentPlan;
