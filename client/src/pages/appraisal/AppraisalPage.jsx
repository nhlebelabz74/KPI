import React from 'react';
import { AppraisalForm } from "@/components/appraisal-form";

// get supervisor data here
const AppraisalPage = () => {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <AppraisalForm />
    </div>
  )
}

export default AppraisalPage;