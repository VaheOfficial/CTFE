import { ApiService } from '../lib/api.service';
import { store } from '../redux/store';
import { clearAllStateItems, addStateItem } from '../redux/globalStateSlice';
import { v4 as uuidv4 } from 'uuid';
import type { StatusSeverity } from '../redux/globalStateSlice';
import type { GlobalState } from '../types/global.types';
import { toast } from 'sonner';

// Define API response type
interface ApiResponse {
  success: boolean;
  message?: string;
  data?: GlobalState[];
}

// Create a singleton API service instance
const apiService = new ApiService();

// Map API state values to our StatusSeverity type
const mapStateToSeverity = (state: string): StatusSeverity => {
  switch (state) {
    case 'critical': return 'critical';
    case 'warning': return 'warning';
    default: return 'normal';
  }
};

// Check if a global state item has timed out
const isItemTimedOut = (item: GlobalState): boolean => {
  if (!item.timeout) return false;
  
  const timeoutMs = item.timeout * 1000; // Convert to milliseconds
  const createdAt = item.createdAt ? new Date(item.createdAt).getTime() : 0;
  const now = Date.now();
  
  return now - createdAt > timeoutMs;
};

// Handle fetching global states and updating the Redux store
export async function fetchGlobalStates(): Promise<void> {
  try {
    // Clear existing items before fetching new ones
    store.dispatch(clearAllStateItems());
    
    const response = await apiService.getGlobalState() as ApiResponse;
    
    // Check if the fetch was successful
    if (!response.success) {
      console.error('Failed to fetch global states:', response.message);
      return;
    }
    
    // Filter out timed-out items and add the rest to the store
    const globalStates: GlobalState[] = response.data || [];
    const validStates = globalStates.filter(item => !isItemTimedOut(item));
    
    // Use for...of instead of forEach to satisfy linter
    for (const item of validStates) {
      const id = item._id ?? uuidv4();
      const message = item.reason ?? 'System status update';
      const severity = mapStateToSeverity(item.state);
      
      store.dispatch(
        addStateItem({
          id,
          message,
          severity,
        })
      );
    }
  } catch (error) {
    console.error('Error fetching global states:', error);
  }
}

// Set up interval for fetching global states (every minute)
let intervalId: NodeJS.Timeout | null = null;

export function startGlobalStatePolling(): void {
  // Fetch immediately on start
  fetchGlobalStates();
  
  // Then set up the interval (every 60 seconds)
  if (!intervalId) {
    intervalId = setInterval(fetchGlobalStates, 60000); // 60 seconds
  }
}

export function stopGlobalStatePolling(): void {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

// Add a warning for unauthorized access, preventing duplicates
export async function addUnauthorizedAccessWarning(): Promise<void> {
  const message = "SECURITY ALERT: Unauthorized system access attempt has been detected and logged";
  const currentState = store.getState().globalState.items;

  // Check if a similar warning already exists to prevent duplicates
  const duplicateExists = currentState.some(item => 
    item.message.includes("Unauthorized system access") && 
    item.severity === 'critical'
  );

  // Only add if no duplicate exists
  if (!duplicateExists) {
    // Add to Redux store for immediate display
    const id = uuidv4();
    store.dispatch(
      addStateItem({
        id,
        message,
        severity: 'warning'
      })
    );
    
    // Add to backend through API
    try {
      const globalStateData: Partial<GlobalState> = {
        _id: id,
        state: 'warning',
        reason: message,
        timeout: 3600, // 1 hour in seconds
        createdAt: new Date().toISOString(),
      };

      await apiService.createGlobalState(globalStateData as GlobalState);
    } catch (error) {
      console.error('Failed to add unauthorized access warning to server:', error);
    }
  }
} 