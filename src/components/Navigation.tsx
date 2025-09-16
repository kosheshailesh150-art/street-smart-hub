import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, LayoutDashboard, FileText, Users } from 'lucide-react';

interface NavigationProps {
  currentView: 'citizen' | 'admin';
  onViewChange: (view: 'citizen' | 'admin') => void;
}

export const Navigation = ({ currentView, onViewChange }: NavigationProps) => {
  return (
    <nav className="bg-card border-b sticky top-0 z-50 card-shadow">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 civic-gradient rounded-lg flex items-center justify-center civic-shadow">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-foreground">CivicReport</h1>
              <p className="text-xs text-muted-foreground">Community Issue Tracker</p>
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-2">
            <Button
              variant={currentView === 'citizen' ? 'default' : 'ghost'}
              className={currentView === 'citizen' ? 'civic-gradient button-shadow' : ''}
              onClick={() => onViewChange('citizen')}
            >
              <FileText className="w-4 h-4 mr-2" />
              Report Issue
            </Button>
            <Button
              variant={currentView === 'admin' ? 'default' : 'ghost'}
              className={currentView === 'admin' ? 'civic-gradient button-shadow' : ''}
              onClick={() => onViewChange('admin')}
            >
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Admin Dashboard
              <Badge variant="secondary" className="ml-2">3</Badge>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};