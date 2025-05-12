
import React, { useState } from 'react';
import { Bell, Search, Calendar, Eye, Download } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/sonner";

const NoticesView = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedNotice, setSelectedNotice] = useState<number | null>(null);
  const [readNotices, setReadNotices] = useState<number[]>([]);
  
  if (!user) return null;

  // Mock notices data
  const noticesData = [
    { 
      id: 1, 
      title: 'Annual Day Celebration', 
      content: 'Annual day celebration will be held on 30th May 2025 at the school auditorium from 10 AM to 2 PM. All students are requested to participate. Parents are cordially invited to attend the function. Cultural programs, prize distribution, and various performances will be part of the event. Please contact your class teacher for more details.',
      date: '2025-05-22', 
      author: 'Principal', 
      target: 'All',
      important: true,
      attachment: true 
    },
    { 
      id: 2, 
      title: 'Parent-Teacher Meeting', 
      content: 'PTM will be held on 25th May 2025 from 10 AM to 1 PM. Parents are requested to attend without fail to discuss the academic progress of their wards. Teachers will be available in their respective classrooms. Please carry the student diary and previous report cards for reference.',
      date: '2025-05-20', 
      author: 'Vice Principal',  
      target: 'Parents',
      important: true,
      attachment: false 
    },
    { 
      id: 3, 
      title: 'Fee Payment Reminder', 
      content: 'Last date for fee payment is 31st May 2025. Late fee will be applicable after the due date. Payments can be made through online transfer or at the school accounts office during working hours (9 AM to 3 PM). Please keep the payment receipt safe for future reference.',
      date: '2025-05-15', 
      author: 'Accounts Officer',
      target: 'Parents', 
      important: false,
      attachment: false 
    },
    { 
      id: 4, 
      title: 'Sports Day', 
      content: 'Inter-house sports competition will be held from 10th to 12th June 2025 at the school playground. Students participating in events should report to their respective house captains by 8:30 AM. Sports uniform is compulsory for all participants. Track events, field events, and team games will be part of the competition.',
      date: '2025-05-15', 
      author: 'Sports Coordinator', 
      target: 'Students',
      important: false,
      attachment: true 
    },
    { 
      id: 5, 
      title: 'Exam Schedule', 
      content: 'Final examination schedule has been released. Examinations will commence from 15th June 2025. Detailed schedule is available in the attachment. Students are advised to prepare well and maintain good attendance. Any clarification regarding the schedule can be addressed to the class teacher.',
      date: '2025-05-18', 
      author: 'Examination Department', 
      target: 'Students',
      important: true,
      attachment: true 
    }
  ];
  
  // Filter notices based on search term and active tab
  const filteredNotices = noticesData.filter(notice => 
    (activeTab === 'all' || 
     (activeTab === 'important' && notice.important) ||
     (activeTab === 'attachments' && notice.attachment)) &&
    (
      notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notice.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notice.author.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Get target badge color
  const getTargetBadge = (target: string) => {
    switch (target)  {
      case 'All':
        return 'bg-purple-100 text-purple-800';
      case 'Parents':
        return 'bg-blue-100 text-blue-800';
      case 'Students':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleMarkAsRead = (id: number) => {
    if (!readNotices.includes(id)) {
      setReadNotices([...readNotices, id]);
      toast("Notice marked as read", {
        description: "This notice has been marked as read"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Notices</h1>
        <p className="text-gray-500">View school notices and announcements</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card-wrapper">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="important">Important</TabsTrigger>
                  <TabsTrigger value="attachments">With Attachments</TabsTrigger>
                </TabsList>
              </Tabs>
              <div className="w-full sm:w-auto relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search notices..."
                  className="pl-9 w-full sm:w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              {filteredNotices.length > 0 ? (
                filteredNotices.map((notice) => (
                  <div 
                    key={notice.id} 
                    className={`border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                      selectedNotice === notice.id ? 'border-primary bg-soft-blue/20' : ''
                    } ${readNotices.includes(notice.id) ? 'bg-gray-50/70' : ''}`}
                    onClick={() => setSelectedNotice(notice.id)}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div className="flex items-start gap-3">
                        {notice.important && (
                          <Bell size={18} className="text-yellow-500 mt-1" />
                        )}
                        <div>
                          <h3 className="font-semibold text-lg">{notice.title}</h3>
                          <div className="flex flex-wrap gap-3 mt-1 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Calendar size={14} />
                              <span>{new Date(notice.date).toLocaleDateString()}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">By:</span> {notice.author}
                            </div>
                            <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${getTargetBadge(notice.target)}`}>
                              {notice.target}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600 mt-2 line-clamp-2">{notice.content}</p>
                    {readNotices.includes(notice.id) && (
                      <div className="mt-2 text-xs text-green-600 font-medium">Read</div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-gray-500">
                  No notices found matching your criteria.
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          {selectedNotice ? (
            <NoticeDetail 
              notice={noticesData.find(notice => notice.id === selectedNotice)!}
              isRead={readNotices.includes(selectedNotice)}
              onMarkAsRead={() => handleMarkAsRead(selectedNotice)}
            />
          ) : (
            <div className="card-wrapper h-full flex flex-col items-center justify-center py-10 text-center text-gray-500">
              <Bell size={48} className="mb-3 text-gray-300" />
              <h3 className="text-lg font-medium">Select a notice</h3>
              <p className="text-sm max-w-xs mt-1">Click on any notice from the list to view its details here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface NoticeDetailProps {
  notice: any;
  isRead: boolean;
  onMarkAsRead: () => void;
}

const NoticeDetail = ({ notice, isRead, onMarkAsRead }: NoticeDetailProps) => {
  return (
    <div className="card-wrapper sticky top-4">
      <div className="mb-4 pb-4 border-b">
        {notice.important && (
          <div className="mb-2 inline-block px-3 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
            Important Notice
          </div>
        )}
        <h2 className="text-xl font-bold">{notice.title}</h2>
        <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            <span>{new Date(notice.date).toLocaleDateString()}</span>
          </div>
          <div>
            <span className="text-gray-500">By:</span> {notice.author}
          </div>
        </div>
      </div>
      
      <div className="mb-4">
        <p className="text-gray-700 whitespace-pre-line">{notice.content}</p>
      </div>
      
      {notice.attachment && (
        <div className="mt-6 pt-4 border-t">
          <h3 className="text-sm font-medium mb-3">Attachments</h3>
          <div className="p-3 bg-soft-blue rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-blue-500 rounded flex items-center justify-center text-white">
                PDF
              </div>
              <div>
                <div className="text-sm font-medium">Notice-{notice.id}.pdf</div>
                <div className="text-xs text-gray-500">215 KB</div>
              </div>
            </div>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Download size={14} />
              Download
            </Button>
          </div>
        </div>
      )}
      
      <div className="mt-6 flex justify-between items-center">
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getTargetBadge(notice.target)}`}>
          For: {notice.target}
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1"
          onClick={onMarkAsRead}
          disabled={isRead}
        >
          <Eye size={14} />
          {isRead ? 'Marked as Read' : 'Mark as Read'}
        </Button>
      </div>
    </div>
  );
};

// Helper function to get target badge color
const getTargetBadge = (target: string) => {
  switch (target)  {
    case 'All':
      return 'bg-purple-100 text-purple-800';
    case 'Parents':
      return 'bg-blue-100 text-blue-800';
    case 'Students':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default NoticesView;
