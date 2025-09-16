import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Camera, MapPin, FileText, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ISSUE_TYPES = [
  { value: 'pothole', label: 'Pothole', icon: '🕳️' },
  { value: 'streetlight', label: 'Broken Streetlight', icon: '💡' },
  { value: 'trash', label: 'Overflowing Trash Bin', icon: '🗑️' },
  { value: 'graffiti', label: 'Graffiti', icon: '🎨' },
  { value: 'traffic', label: 'Traffic Signal Issue', icon: '🚦' },
  { value: 'drainage', label: 'Blocked Drain', icon: '🌊' },
  { value: 'other', label: 'Other', icon: '📝' }
];

const STATUS_CONFIG = {
  submitted: { label: 'Submitted', icon: FileText, color: 'status-submitted' },
  'in-progress': { label: 'In Progress', icon: Clock, color: 'status-in-progress' },
  resolved: { label: 'Resolved', icon: CheckCircle2, color: 'status-resolved' }
};

export const IssueReportForm = () => {
  const [formData, setFormData] = useState({
    type: '',
    description: '',
    location: '',
    priority: 'medium'
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mockStatus, setMockStatus] = useState<'idle' | 'submitted' | 'in-progress' | 'resolved'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImageCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            location: `${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`
          }));
          toast({
            title: "Location captured",
            description: "Your current location has been added to the report.",
          });
        },
        () => {
          toast({
            title: "Location unavailable",
            description: "Please enter your location manually.",
            variant: "destructive",
          });
        }
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.type || !formData.description) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Mock submission process
    setTimeout(() => {
      setMockStatus('submitted');
      setIsSubmitting(false);
      toast({
        title: "Issue reported successfully!",
        description: "Your report has been submitted and is being processed.",
      });
      
      // Simulate status progression
      setTimeout(() => {
        setMockStatus('in-progress');
        toast({
          title: "Update: Issue In Progress",
          description: "Your report has been assigned to the relevant department.",
        });
      }, 3000);

      setTimeout(() => {
        setMockStatus('resolved');
        toast({
          title: "Issue Resolved!",
          description: "Your reported issue has been successfully addressed.",
        });
      }, 8000);
    }, 2000);
  };

  if (mockStatus !== 'idle') {
    const statusInfo = STATUS_CONFIG[mockStatus as keyof typeof STATUS_CONFIG];
    const StatusIcon = statusInfo.icon;
    
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <Card className="w-full max-w-md card-shadow civic-transition">
          <CardContent className="p-8 text-center space-y-6">
            <div className={`mx-auto w-16 h-16 rounded-full ${statusInfo.color} flex items-center justify-center`}>
              <StatusIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Report {statusInfo.label}
              </h2>
              <p className="text-muted-foreground">
                {mockStatus === 'submitted' && 'Your issue has been logged and assigned a tracking ID.'}
                {mockStatus === 'in-progress' && 'Our team is actively working on resolving your issue.'}
                {mockStatus === 'resolved' && 'Thank you for helping improve our community!'}
              </p>
            </div>
            
            {mockStatus === 'submitted' && (
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm font-medium">Tracking ID</p>
                <p className="text-lg font-mono">CIV-2024-{Math.floor(Math.random() * 10000)}</p>
              </div>
            )}

            <Button 
              onClick={() => {
                setMockStatus('idle');
                setFormData({ type: '', description: '', location: '', priority: 'medium' });
                setSelectedImage(null);
                setImagePreview(null);
              }}
              className="w-full civic-gradient button-shadow"
            >
              Report Another Issue
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 civic-gradient rounded-full civic-shadow">
            <AlertCircle className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Report Civic Issue</h1>
            <p className="text-muted-foreground">Help improve your community by reporting local issues</p>
          </div>
        </div>

        <Card className="card-shadow civic-transition">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Issue Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Issue Type Selection */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">Issue Type *</label>
                <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger className="focus-civic">
                    <SelectValue placeholder="Select issue type" />
                  </SelectTrigger>
                  <SelectContent>
                    {ISSUE_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <span>{type.icon}</span>
                          {type.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Photo Upload */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">Photo Evidence</label>
                <div className="space-y-3">
                  {imagePreview ? (
                    <div className="relative">
                      <img 
                        src={imagePreview} 
                        alt="Issue preview" 
                        className="w-full h-48 object-cover rounded-lg border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => {
                          setSelectedImage(null);
                          setImagePreview(null);
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full h-24 civic-transition focus-civic"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <div className="text-center">
                        <Camera className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Tap to capture or upload photo</p>
                      </div>
                    </Button>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleImageCapture}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">Location</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter location or coordinates"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    className="focus-civic"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={getCurrentLocation}
                    className="civic-transition"
                  >
                    <MapPin className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">Description *</label>
                <Textarea
                  placeholder="Describe the issue in detail..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="min-h-24 focus-civic"
                />
              </div>

              {/* Priority */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">Priority Level</label>
                <div className="flex gap-2">
                  {[
                    { value: 'low', label: 'Low', color: 'bg-secondary text-secondary-foreground' },
                    { value: 'medium', label: 'Medium', color: 'bg-accent text-accent-foreground' },
                    { value: 'high', label: 'High', color: 'bg-destructive text-destructive-foreground' }
                  ].map((priority) => (
                    <Badge
                      key={priority.value}
                      variant={formData.priority === priority.value ? "default" : "outline"}
                      className={`cursor-pointer civic-transition ${formData.priority === priority.value ? priority.color : ''}`}
                      onClick={() => setFormData(prev => ({ ...prev, priority: priority.value }))}
                    >
                      {priority.label}
                    </Badge>
                  ))}
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full civic-gradient button-shadow text-lg py-6"
              >
                {isSubmitting ? 'Submitting Report...' : 'Submit Issue Report'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};