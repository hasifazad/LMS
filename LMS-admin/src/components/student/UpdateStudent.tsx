import { useState } from "react";
import PersonalDetailsForm from "./forms/PersonalDetailsForm";

const sections = [
  "Personal Details",
  "Address",
  "Education",
  "Documents",
];

const UpdateStudent = () => {
  const [activeSection, setActiveSection] = useState("Personal Details");

  return (
    <div className="w-full min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto bg-white border border-gray-200 rounded-2xl overflow-hidden flex">
        
        {/* Sidebar */}
        <div className="w-72 border-r border-gray-100 bg-gray-50 p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">
            Add Student
          </h2>

          <div className="space-y-2">
            {sections.map((section) => (
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium
                  ${
                    activeSection === section
                      ? "bg-white border border-gray-200 text-black"
                      : "text-gray-500 hover:bg-white hover:text-black"
                  }`}
              >
                {section}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-8">
          {activeSection === "Personal Details" && (
            <PersonalDetailsForm />
          )}

          {activeSection === "Address" && (
            <div>Address Form</div>
          )}

          {activeSection === "Education" && (
            <div>Education Form</div>
          )}

          {activeSection === "Documents" && (
            <div>Documents Form</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpdateStudent;