import React from "react";
import { useLocation } from "react-router-dom";

function AdmissionDetails() {
  const location = useLocation();
  const admission = location.state?.admission;

  if (!admission) return <div className="p-6">No admission data found.</div>;

  const { personal, address, academic, parent, status, submitted_at, createdAt } = admission;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white shadow-xl rounded-xl p-8 space-y-6">
        <h2 className="text-3xl font-bold text-emerald-700">Admission Details</h2>

        {/* Personal Info */}
        <Section title=" Personal Information">
          <Info label="Name" value={`${personal.first_name} ${personal.last_name}`} />
          <Info label="Email" value={personal.email} />
          <Info label="Mobile" value={personal.mobile} />
          <Info label="Date of Birth" value={new Date(personal.dob).toLocaleDateString()} />
          <Info label="Gender" value={personal.gender} />
          <Info label="Marital Status" value={personal.marital_status} />
          <Info label="Country" value={personal.country} />
        </Section>

        {/* Address Info */}
        <Section title="Address">
          <Info label="Street" value={address.street} />
          <Info label="City" value={address.city} />
          <Info label="State" value={address.state} />
          <Info label="ZIP" value={address.zip} />
        </Section>

        {/* Academic Info */}
        <Section title="Academic Details">
          <Info label="Institute" value={academic.institute} />
          <Info label="Qualification" value={academic.qualification} />
          <Info label="Grade" value={academic.grade} />
          <Info label="Passing Year" value={academic.passing_year} />
        </Section>

        {/* Parent Info */}
        <Section title="Parent / Guardian">
          <Info label="Name" value={`${parent.first_name} ${parent.last_name}`} />
          <Info label="Email" value={parent.email} />
          <Info label="Contact" value={parent.contact} />
          <Info
            label="Address"
            value={`${parent.address.street}, ${parent.address.city}, ${parent.address.state} - ${parent.address.zip}`}
          />
        </Section>

        {/* Application Info */}
        <Section title="Application Info">
          <Info label="Status" value={status} />
          <Info label="Submitted At" value={new Date(submitted_at).toLocaleString()} />
          
        </Section>
      </div>
    </div>
  );
}

const Section = ({ title, children }) => (
  <div className="space-y-2">
    <h3 className="text-xl font-semibold text-gray-700 border-b pb-1">{title}</h3>
    <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3">{children}</div>
  </div>
);

const Info = ({ label, value }) => (
  <p className="text-gray-700">
    <span className="font-medium text-gray-900">{label}:</span> {value || "—"}
  </p>
);

export default AdmissionDetails;
