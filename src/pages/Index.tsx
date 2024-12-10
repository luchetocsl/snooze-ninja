import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Calendar as CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

interface SnoozedTab {
  url: string;
  title: string;
  wakeTime: number;
}

// Mock chrome.storage for development
const mockChromeStorage = {
  snoozedTabs: [] as SnoozedTab[],
};

const isExtension = typeof chrome !== 'undefined' && chrome.storage;

const Index = () => {
  const [snoozedTabs, setSnoozedTabs] = useState<SnoozedTab[]>([]);
  const [date, setDate] = useState<Date>(new Date());
  const [customTime, setCustomTime] = useState<string>("12:00");

  useEffect(() => {
    if (isExtension) {
      // Real extension environment
      chrome.storage.local.get(["snoozedTabs"], (result) => {
        setSnoozedTabs(result.snoozedTabs || []);
      });
    } else {
      // Development environment
      setSnoozedTabs(mockChromeStorage.snoozedTabs);
    }
  }, []);

  const snoozeCurrentTab = async (minutes?: number) => {
    try {
      let tab: chrome.tabs.Tab;
      
      if (isExtension) {
        [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      } else {
        // Mock tab for development
        tab = {
          url: "https://example.com",
          title: "Example Tab",
          id: 1,
        } as chrome.tabs.Tab;
      }

      if (!tab.url || !tab.title) return;

      let wakeTime: number;
      if (minutes) {
        wakeTime = Date.now() + minutes * 60 * 1000;
      } else {
        const [hours, mins] = customTime.split(":");
        const selectedDate = new Date(date);
        selectedDate.setHours(parseInt(hours), parseInt(mins));
        wakeTime = selectedDate.getTime();
      }

      const newSnoozedTab = {
        url: tab.url,
        title: tab.title,
        wakeTime,
      };

      const updatedTabs = [...snoozedTabs, newSnoozedTab];
      
      if (isExtension) {
        await chrome.storage.local.set({ snoozedTabs: updatedTabs });
        await chrome.tabs.remove(tab.id!);
      } else {
        mockChromeStorage.snoozedTabs = updatedTabs;
      }
      
      setSnoozedTabs(updatedTabs);
      toast.success("Tab snoozed successfully!");
    } catch (error) {
      toast.error("Failed to snooze tab");
      console.error(error);
    }
  };

  const cancelSnooze = async (url: string) => {
    const updatedTabs = snoozedTabs.filter((tab) => tab.url !== url);
    
    if (isExtension) {
      await chrome.storage.local.set({ snoozedTabs: updatedTabs });
    } else {
      mockChromeStorage.snoozedTabs = updatedTabs;
    }
    
    setSnoozedTabs(updatedTabs);
    toast.success("Snooze cancelled");
  };

  return (
    <div className="w-[350px] p-4 bg-white">
      <h1 className="text-2xl font-bold text-primary mb-4">Tab Snoozer</h1>
      
      <Tabs defaultValue="quick" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="quick">Quick Snooze</TabsTrigger>
          <TabsTrigger value="custom">Custom Time</TabsTrigger>
        </TabsList>
        
        <TabsContent value="quick" className="space-y-2">
          <Button
            onClick={() => snoozeCurrentTab(15)}
            className="w-full mb-2"
            variant="outline"
          >
            <Clock className="mr-2 h-4 w-4" />
            Snooze for 15 minutes
          </Button>
          
          <Button
            onClick={() => snoozeCurrentTab(45)}
            className="w-full"
            variant="outline"
          >
            <Clock className="mr-2 h-4 w-4" />
            Snooze for 45 minutes
          </Button>
        </TabsContent>
        
        <TabsContent value="custom" className="space-y-4">
          <div className="grid gap-2">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(date) => date && setDate(date)}
              className="rounded-md border"
            />
            <input
              type="time"
              value={customTime}
              onChange={(e) => setCustomTime(e.target.value)}
              className="w-full p-2 border rounded-md"
            />
            <Button onClick={() => snoozeCurrentTab()} className="w-full">
              <CalendarIcon className="mr-2 h-4 w-4" />
              Snooze until selected time
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      {snoozedTabs.length > 0 && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">Snoozed Tabs</h2>
          <div className="space-y-2">
            {snoozedTabs.map((tab) => (
              <div
                key={tab.url}
                className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
              >
                <div className="truncate flex-1">
                  <p className="text-sm font-medium truncate">{tab.title}</p>
                  <p className="text-xs text-gray-500">
                    Wakes at {format(tab.wakeTime, "PPp")}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => cancelSnooze(tab.url)}
                  className="ml-2"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;