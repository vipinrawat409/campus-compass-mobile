
import React, { useState } from 'react';
import { Bell, Search, Plus, Calendar, User, Star, Edit, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const NoticeManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock notices data
  const noticesData = [
    { 
      id: 1, 
      title: 'Annual Day Celebration', 
      content: 'Annual day celebration will be held on 30th May 2025 at the school auditorium. All students are requested to participate.', 
      date: '2025-05-22', 
      author: 'Principal', 
      target: 'All',
      important: true 
    },
    { 
      id: 2, 
      title: 'Parent-Teacher Meeting', 
      content: 'PTM will be held on 25th May 2025 from 10 AM to 1 PM. Parents are requested to attend without fail.', 
      date: '2025-05-20', 
      author: 'Vice Principal',  
      target: 'Parents',
      important: true 
    },
    { 
      id: 3, 
      title: 'Fee Payment Reminder', 
      content: 'Last date for fee payment is 31st May 2025. Late fee will be applicable after the due date.', 
      date: '2025-05-15', 
      author: 'Accounts Officer',
      target: 'Parents', 
      important: false 
    },
    { 
      id: 4, 
      title: 'Sports Day', 
      content: 'Inter-house sports competition will be held from 10th to 12th June 2025.', 
      date: '2025-05-15', 
      author: 'Sports Coordinator', 
      target: 'Students',
      important: false 
    },
    { 
      id: 5, 
      title: 'Staff Meeting', 
      content: 'All staff members are requested to attend the meeting on 23rd May 2025 at 3 PM in the conference hall.', 
      date: '2025-05-18', 
      author: 'Principal', 
      target: 'Teachers',
      important: true 
    }
  ];
  
  // Filter notices based on search term
  const filteredNotices = noticesData.filter(notice => 
    notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    notice.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    notice.target.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get target badge color
  const getTargetBadge = (target: string) => {
    switch (target) {
      case 'All':
        return 'bg-purple-100 text-purple-800';
      case 'Parents':
        return 'bg-blue-100 text-blue-800';
      case 'Teachers':
        return 'bg-green-100 text-green-800';
      case 'Students':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Notice Management</h1>
        <p className="text-gray-500">Create and manage school notices</p>
      </div>

      <div className="card-wrapper">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="w-full sm:w-auto flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search notices..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button className="flex gap-2">
            <Plus size={16} />
            Create Notice
          </Button>
        </div>

        <div className="space-y-4">
          {filteredNotices.map((notice) => (
            <div key={notice.id} className="border rounded-lg p-4 hover:bg-gray-50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-start gap-3">
                  {notice.important && (
                    <Star size={18} className="text-yellow-500 mt-1" />
                  )}
                  <div>
                    <h3 className="font-semibold text-lg">{notice.title}</h3>
                    <div className="flex flex-wrap gap-3 mt-1 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>{new Date(notice.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User size={14} />
                        <span>{notice.author}</span>
                      </div>
                      <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${getTargetBadge(notice.target)}`}>
                        {notice.target}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <Edit size={16} />
                  </Button>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-500">
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
              <p className="text-gray-600 mt-2">{notice.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NoticeManagement;
