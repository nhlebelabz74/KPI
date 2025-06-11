import React from 'react';
import { AppraisalForm } from "@/components/appraisal-form";
import { useParams } from 'react-router-dom';

const AppraisalPage = () => {
  const { email } = useParams();
  const isSupervisor = !!email;

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <AppraisalForm supervisor={ isSupervisor ? { superviseeEmail: decodeURIComponent(email) } : null }/>
    </div>
  );
}

export default AppraisalPage;