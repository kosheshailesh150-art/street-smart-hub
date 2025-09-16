import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  MapPin,
  Camera,
  Filter,
  Search,
  BarChart3,
  Users,
  TrendingUp,
  Calendar
} from 'lucide-react';

const MOCK_REPORTS = [
  {
    id: 'CIV-2024-1001',
    type: 'pothole',
    description: 'Large pothole on Main Street causing vehicle damage',
    location: '40.7589, -73.9851',
    priority: 'high',
    status: 'submitted',
    submittedAt: '2024-01-15T10:30:00Z',
    assignee: null,
    department: 'Roads & Infrastructure',
    citizen: 'John Doe',
    image: true
  },
  {
    id: 'CIV-2024-1002',
    type: 'streetlight',
    description: 'Broken streetlight at Park Avenue intersection',
    location: '40.7614, -73.9776',
    priority: 'medium',
    status: 'in-progress',
    submittedAt: '2024-01-14T16:45:00Z',
    assignee: 'Mike Johnson',
    department: 'Electrical Services',
    citizen: 'Sarah Smith',
    image: true
  },
  {
    id: 'CIV-2024-1003',
    type: 'trash',
    description: 'Overflowing garbage bin attracting pests',
    location: '40.7505, -73.9934',
    priority: 'medium',
    status: 'resolved',
    submittedAt: '2024-01-13T09:15:00Z',
    assignee: 'Lisa Chen',
    department: 'Waste Management',
    citizen: 'Robert Wilson',
    image: false
  }
];

const STATUS_CONFIG = {
  submitted: { label: 'Submitted', icon: AlertCircle, color: 'status-submitted' },
  'in-progress': { label: 'In Progress', icon: Clock, color: 'status-in-progress' },
  resolved: { label: 'Resolved', icon: CheckCircle2, color: 'status-resolved' }
};

const ISSUE_TYPE_ICONS = {
  pothole: '🕳️',
  streetlight: '💡',
  trash: '🗑️',
  graffiti: '🎨',
  traffic: '🚦',
  drainage: '🌊',
  other: '📝'
};

export const AdminDashboard = () => {
  const [reports, setReports] = useState(MOCK_REPORTS);
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredReports = reports.filter(report => {
    const matchesStatus = filterStatus === 'all' || report.status === filterStatus;
    const matchesSearch = searchTerm === '' || 
      report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.citizen.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const updateReportStatus = (reportId: string, newStatus: string, assignee?: string) => {
    setReports(prevReports =>
      prevReports.map(report =>
        report.id === reportId
          ? { ...report, status: newStatus as any, assignee: assignee || report.assignee }
          : report
      )
    );
  };

  const getStatusCount = (status: string) => {
    return reports.filter(report => report.status === status).length;
  };

  const ReportCard = ({ report }: { report: typeof MOCK_REPORTS[0] }) => {
    const StatusIcon = STATUS_CONFIG[report.status].icon;
    
    return (
      <Card className={`card-shadow civic-transition cursor-pointer hover:shadow-lg ${
        selectedReport === report.id ? 'ring-2 ring-primary' : ''
      }`} onClick={() => setSelectedReport(selectedReport === report.id ? null : report.id)}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="text-2xl">{ISSUE_TYPE_ICONS[report.type as keyof typeof ISSUE_TYPE_ICONS]}</div>
              <div>
                <p className="font-medium text-sm text-muted-foreground">{report.id}</p>
                <h3 className="font-semibold text-foreground">{report.description}</h3>
              </div>
            </div>
            <div className={`p-1 rounded-full ${STATUS_CONFIG[report.status].color}`}>
              <StatusIcon className="w-4 h-4 text-white" />
            </div>
          </div>

          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{report.location}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Priority: <Badge variant={report.priority === 'high' ? 'destructive' : report.priority === 'medium' ? 'default' : 'secondary'} className="ml-1">{report.priority}</Badge></span>
              {report.image && <Camera className="w-4 h-4 text-muted-foreground" />}
            </div>
            <div className="flex items-center justify-between">
              <span>Reported by: {report.citizen}</span>
              <span>{new Date(report.submittedAt).toLocaleDateString()}</span>
            </div>
            {report.assignee && (
              <div className="text-xs bg-muted p-2 rounded">
                Assigned to: {report.assignee} ({report.department})
              </div>
            )}
          </div>

          {selectedReport === report.id && (
            <div className="mt-4 pt-4 border-t space-y-3">
              <div className="flex gap-2">
                {report.status === 'submitted' && (
                  <>
                    <Button
                      size="sm"
                      className="civic-gradient flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        updateReportStatus(report.id, 'in-progress', 'Alex Thompson');
                      }}
                    >
                      Assign & Start Work
                    </Button>
                  </>
                )}
                {report.status === 'in-progress' && (
                  <Button
                    size="sm"
                    className="success-gradient flex-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      updateReportStatus(report.id, 'resolved');
                    }}
                  >
                    Mark as Resolved
                  </Button>
                )}
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Civic Issues Dashboard</h1>
              <p className="text-muted-foreground">Manage and track community issue reports</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-sm">
                Active Reports: {getStatusCount('submitted') + getStatusCount('in-progress')}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="card-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Reports</p>
                  <p className="text-2xl font-bold text-foreground">{reports.length}</p>
                </div>
                <BarChart3 className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Submitted</p>
                  <p className="text-2xl font-bold text-status-submitted">{getStatusCount('submitted')}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-status-submitted" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                  <p className="text-2xl font-bold text-status-in-progress">{getStatusCount('in-progress')}</p>
                </div>
                <Clock className="w-8 h-8 text-status-in-progress" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Resolved</p>
                  <p className="text-2xl font-bold text-status-resolved">{getStatusCount('resolved')}</p>
                </div>
                <CheckCircle2 className="w-8 h-8 text-status-resolved" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="reports" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 max-w-md">
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="map">Map View</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="reports" className="space-y-4">
            {/* Filters */}
            <Card className="card-shadow">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex items-center gap-2 flex-1">
                    <Search className="w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search reports..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="focus-civic"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-muted-foreground" />
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="submitted">Submitted</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reports List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredReports.map((report) => (
                <ReportCard key={report.id} report={report} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="card-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Response Times
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Average Response Time</span>
                      <span className="font-semibold">2.4 hours</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Fastest Resolution</span>
                      <span className="font-semibold text-secondary">45 minutes</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">This Week</span>
                      <span className="font-semibold">15 resolved</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    Top Issue Types
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span>🕳️</span>
                        <span className="text-sm">Potholes</span>
                      </div>
                      <Badge variant="secondary">42%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span>💡</span>
                        <span className="text-sm">Streetlights</span>
                      </div>
                      <Badge variant="secondary">28%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span>🗑️</span>
                        <span className="text-sm">Waste Issues</span>
                      </div>
                      <Badge variant="secondary">20%</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="map">
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Issue Map View
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96 bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Interactive map integration coming soon</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Will show all reported issues plotted on a city map
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle>Dashboard Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Configure notification preferences, department assignments, and workflow automation.
                  </p>
                  <Button className="civic-gradient">
                    Open Settings Panel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};