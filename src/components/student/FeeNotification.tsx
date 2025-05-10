
import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface FeeNotification {
  id: number;
  title: string;
  message: string;
  dueDate: string;
  amount: number;
  isRead: boolean;
}

const FeeNotification = () => {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<FeeNotification[]>([]);
  const [showAll, setShowAll] = useState(false);

  // Mock data for pending fee notifications
  useEffect(() => {
    // In a real app, this would be fetched from an API
    const mockNotifications: FeeNotification[] = [
      {
        id: 1,
        title: 'Term 2 Fees Due',
        message: 'Your Term 2 fees of ₹15,000 is due. Please make the payment before the due date to avoid late fee charges.',
        dueDate: '2025-05-20',
        amount: 15000,
        isRead: false
      },
      {
        id: 2,
        title: 'Library Fee Pending',
        message: 'Your library fee of ₹500 is pending. Please make the payment at the earliest.',
        dueDate: '2025-05-15',
        amount: 500,
        isRead: false
      },
      {
        id: 3,
        title: 'Sports Fee Due',
        message: 'Your annual sports fee of ₹2,000 is pending. Please make the payment before the due date.',
        dueDate: '2025-05-25',
        amount: 2000,
        isRead: true
      }
    ];
    
    setNotifications(mockNotifications);
  }, []);

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, isRead: true } : notification
    ));
  };

  const displayNotifications = showAll 
    ? notifications 
    : notifications.filter(notification => !notification.isRead);

  const unreadCount = notifications.filter(notification => !notification.isRead).length;

  return (
    <Card className="p-4 relative">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Bell className="text-primary" />
          <h3 className="font-semibold text-lg">Fee Notifications</h3>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
              {unreadCount}
            </span>
          )}
        </div>
        <Button 
          variant="link" 
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? 'Show Unread' : 'Show All'}
        </Button>
      </div>

      {displayNotifications.length > 0 ? (
        <div className="space-y-3">
          {displayNotifications.map((notification) => (
            <div 
              key={notification.id}
              className={`border rounded-md p-3 relative ${notification.isRead ? 'bg-gray-50' : 'bg-yellow-50 border-yellow-200'}`}
            >
              <div className="flex justify-between">
                <h4 className="font-medium text-sm">{notification.title}</h4>
                <span className="text-xs text-gray-500">
                  Due: {new Date(notification.dueDate).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm mt-1 text-gray-600">{notification.message}</p>
              <div className="flex justify-between items-center mt-2">
                <span className="font-semibold text-sm">₹{notification.amount.toLocaleString()}</span>
                {!notification.isRead && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => markAsRead(notification.id)}
                  >
                    Mark as Read
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4 text-gray-500">
          No {showAll ? '' : 'unread'} notifications
        </div>
      )}
    </Card>
  );
};

export default FeeNotification;
