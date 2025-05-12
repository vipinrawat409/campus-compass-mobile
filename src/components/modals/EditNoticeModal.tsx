
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage 
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";

export interface NoticeData {
  id: number;
  title: string;
  content: string;
  date: string;
  author: string;
  target: string;
  important: boolean;
}

interface EditNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: NoticeData) => void;
  notice: NoticeData | null;
}

const EditNoticeModal = ({ isOpen, onClose, onSave, notice }: EditNoticeModalProps) => {
  const formSchema = z.object({
    title: z.string().min(1, "Title is required"),
    content: z.string().min(1, "Content is required"),
    date: z.string(),
    author: z.string().min(1, "Author is required"),
    target: z.string().min(1, "Target audience is required"),
    important: z.boolean().default(false),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: notice?.title || "",
      content: notice?.content || "",
      date: notice?.date || new Date().toISOString().split('T')[0],
      author: notice?.author || "",
      target: notice?.target || "All",
      important: notice?.important || false,
    },
  });

  // Update the form when the notice changes
  React.useEffect(() => {
    if (notice) {
      form.reset({
        title: notice.title,
        content: notice.content,
        date: notice.date,
        author: notice.author,
        target: notice.target,
        important: notice.important,
      });
    }
  }, [notice, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!notice) return;
    
    const updatedNotice: NoticeData = {
      ...notice,
      ...values,
    };
    
    onSave(updatedNotice);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Notice</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea rows={5} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Author</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="target"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Audience</FormLabel>
                  <FormControl>
                    <select
                      className="w-full border border-gray-300 rounded-md p-2"
                      {...field}
                    >
                      <option value="All">All</option>
                      <option value="Students">Students</option>
                      <option value="Teachers">Teachers</option>
                      <option value="Parents">Parents</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="important"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Mark as Important</FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                Update Notice
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditNoticeModal;
