import { useNavigate } from "react-router-dom";

function StudentManagement() {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Admission",
      description: "Manage student admissions",
      path: "/admission",
    },
    {
      title: "Student Plan",
      description: "Set up payment plans",
      path: "/student-plan",
    },
    // {
    //   title: "Student Plan Request",
    //   description: " payment Requests  plans",
    //   path: "/plan-requests",
    // },
    // {
    //   title: "Student Enrolled Plans",
    //   description: " Enrolled  plans",
    //   path: "/enrolled-plans",
    // },
  ];

  return (
    <div className="p-6 mt-10">
      <h2 className="text-2xl font-bold mb-6">Student Management</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {cards.map((card, index) => (
          <div
            key={index}
            onClick={() => navigate(card.path)}
            className="bg-white shadow-md rounded-lg p-6 cursor-pointer hover:shadow-lg transition"
          >
            <h3 className="text-lg font-semibold">{card.title}</h3>
            <p className="text-gray-500">{card.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StudentManagement;
