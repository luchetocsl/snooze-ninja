/// <reference types="chrome"/>

let checkInterval: number | undefined;

const checkSnoozedTabs = async () => {
  const { snoozedTabs = [] } = await chrome.storage.local.get("snoozedTabs");
  const now = Date.now();
  
  const tabsToWake = snoozedTabs.filter((tab: any) => tab.wakeTime <= now);
  const remainingTabs = snoozedTabs.filter((tab: any) => tab.wakeTime > now);
  
  // Open tabs that need to wake up
  for (const tab of tabsToWake) {
    await chrome.tabs.create({ url: tab.url });
  }
  
  // Update storage with remaining tabs
  if (tabsToWake.length > 0) {
    await chrome.storage.local.set({ snoozedTabs: remainingTabs });
  }
  
  // Clear interval if no more tabs to check
  if (remainingTabs.length === 0 && checkInterval) {
    clearInterval(checkInterval);
    checkInterval = undefined;
  }
};

// Start checking when a tab is snoozed
chrome.storage.onChanged.addListener((changes) => {
  if (changes.snoozedTabs && !checkInterval) {
    checkInterval = setInterval(checkSnoozedTabs, 30000) as unknown as number;
  }
});

// Initial check on extension load
checkSnoozedTabs();