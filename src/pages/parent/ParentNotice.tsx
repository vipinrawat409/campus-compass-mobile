
import React, { useState } from 'react';
import { Bell, Eye, Check } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ChildSelector, { ChildData } from '@/components/parent/ChildSelector';
import { toast } from '@/components/ui/sonner';

interface Notice {
  id: number;
  childId: number | null; // null means for all children
  title: string;
  content: string;
  date: string;
  important: boolean;
  read: boolean;
}

const ParentNotice = () => {
  // Mock children data
  const children = [
    { id: 1, name: "Sarah Wilson", class: "10-A", rollNo: "SD201" },
    { id: 2, name: "John Wilson", class: "7-B", rollNo: "SD202" }
  ];

  const [selectedChild, setSelectedChild] = useState<ChildData>(children[0]);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  
  // Mock notices data
  const [notices, setNotices] = useState<Notice[]>([
    {
      id: 1,
      childId: null, // for all children
      title: "Annual Day Celebration",
      content: "We are pleased to announce the Annual Day Celebration on May 30th, 2025. All parents are cordially invited to attend the function. The event will start at 10:00 AM and continue till 4:00 PM. Students are required to come in proper school uniform.",
      date: "2025-05-12",
      important: true,
      read: false
    },
    {
      id: 2,
      childId: 1, // specifically for Sarah
      title: "Class 10 Parent-Teacher Meeting",
      content: "A parent-teacher meeting for Class 10 students will be held on May 20th, 2025 from 9:00 AM to 12:00 PM. Your presence is mandatory to discuss your child's academic progress.",
      date: "2025-05-10",
      important: true,
      read: true
    },
    {
      id: 3,
      childId: 2, // specifically for John
      title: "Class 7 Science Exhibition",
      content: "The Class 7 Science Exhibition will be held on May 25th, 2025. Students are required to bring their science projects by May 20th for preliminary evaluation.",
      date: "2025-05-08",
      important: false,
      read: false
    },
    {
      id: 4,
      childId: null, // for all children
      title: "Fee Payment Reminder",
      content: "This is a gentle reminder that the last date for fee payment for the current term is May 31st, 2025. Kindly ensure that all dues are cleared before the deadline.",
      date: "2025-05-05",
      important: true,
      read: true
    }
  ]);
  
  // Filter notices for the selected child (include null childId notices which are for all children)
  const filteredNotices = notices.filter(notice => 
    notice.childId === null || notice.childId === selectedChild.id
  );
  
  const handleReadNotice = (notice: Notice) => {
    setSelectedNotice(notice);
    
    // Mark as read if not already
    if (!notice.read) {
      const updatedNotices = notices.map(n => 
        n.id === notice.id ? { ...n, read: true } : n
      );
      setNotices(updatedNotices);
    }
  };
  
  const closeNoticeDialog = () => {
    setSelectedNotice(null);
  };
  
  // Count unread notices
  const unreadCount = filteredNotices.filter(notice => !notice.read).length;
  
  // Mark notice as read explicitly
  const markAsRead = (notice: Notice) => {
    const updatedNotices = notices.map(n => 
      n.id === notice.id ? { ...n, read: true } : n
    );
    setNotices(updatedNotices);
    toast("Notice marked as read");
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Notices</h1>
        {unreadCount > 0 && (
          <div className="flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
            <Bell size={16} />
            {unreadCount} unread {unreadCount === 1 ? 'notice' : 'notices'}
          </div>
        )}
      </div>
      
      <ChildSelector 
        children={children} 
        selectedChild={selectedChild}
        onSelectChild={setSelectedChild}
      />
      
      <div className="card-wrapper">
        <h2 className="text-lg font-medium mb-4">
          Notices for {selectedChild.name}
        </h2>
        
        <div className="space-y-4">
          {filteredNotices.map((notice) => (
            <div 
              key={notice.id} 
              className={`p-4 border rounded-lg hover:bg-gray-50 ${notice.read ? '' : 'border-l-4 border-l-primary'}`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{notice.title}</h3>
                    {notice.important && (
                      <span className="px-2 py-0.5 bg-red-100 text-red-800 rounded-full text-xs">Important</span>
                    )}
                    {!notice.read && (
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs">New</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(notice.date).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-700 mt-2 line-clamp-2">
                    {notice.content}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex gap-2"
                    onClick={() => handleReadNotice(notice)}
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </Button>
                  {!notice.read && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex gap-2"
                      onClick={() => markAsRead(notice)}
                    >
                      <Check className="h-4 w-4" />
                      Mark as Read
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredNotices.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Bell className="h-12 w-12 mx-auto text-gray-300 mb-3" />
            <p>No notices found for {selectedChild.name}.</p>
          </div>
        )}
      </div>
      
      {/* Notice Details Dialog */}
      <Dialog open={!!selectedNotice} onOpenChange={() => closeNoticeDialog()}>
        {selectedNotice && (
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{selectedNotice.title}</DialogTitle>
            </DialogHeader>
            <div className="mt-2">
              <div className="flex flex-wrap gap-2 text-sm">
                <span className="text-gray-500">
                  Date: {new Date(selectedNotice.date).toLocaleDateString()}
                </span>
                {selectedNotice.important && (
                  <span className="px-2 py-0.5 bg-red-100 text-red-800 rounded-full text-xs">
                    Important
                  </span>
                )}
              </div>
              <div className="mt-4 whitespace-pre-line">
                {selectedNotice.content}
              </div>
              {!selectedNotice.read && (
                <div className="mt-4 flex justify-end">
                  <Button 
                    size="sm"
                    onClick={() => {
                      markAsRead(selectedNotice);
                      closeNoticeDialog();
                    }}
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Mark as Read
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default ParentNotice;
