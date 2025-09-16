import React, { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { IssueReportForm } from '@/components/IssueReportForm';
import { AdminDashboard } from '@/components/AdminDashboard';

const Index = () => {
  const [currentView, setCurrentView] = useState<'citizen' | 'admin'>('citizen');

  return (
    <div className="min-h-screen bg-background">
      <Navigation currentView={currentView} onViewChange={setCurrentView} />
      
      {currentView === 'citizen' ? (
        <IssueReportForm />
      ) : (
        <AdminDashboard />
      )}
    </div>
  );
};

export default Index;
