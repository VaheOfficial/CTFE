import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Slider } from '../ui/slider';
import { Switch } from '../ui/switch';
import { Textarea } from '../ui/textarea';
import { Alert, AlertTitle, AlertDescription } from '../ui/alert';
import { useState } from 'react';

type SystemConfig = {
  apiEndpoint: string;
  refreshRate: number;
  maxConnections: number;
  dataRetentionDays: number;
  maintenanceMode: boolean;
  debugMode: boolean;
  notificationEmail: string;
  systemMessage: string;
};

type MessageState = {
  type: 'success' | 'error';
  text: string;
} | null;

export function SystemSettings() {
  const [message, setMessage] = useState<MessageState>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Hardcoded initial configuration
  const [config, setConfig] = useState<SystemConfig>({
    apiEndpoint: 'https://api.example.com/v1',
    refreshRate: 5,
    maxConnections: 15,
    dataRetentionDays: 30,
    maintenanceMode: false,
    debugMode: false,
    notificationEmail: 'admin@example.com',
    systemMessage: 'Welcome to the system. Please contact admin for support.'
  });

  // Handle text input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setConfig(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle slider changes
  const handleSliderChange = (name: keyof SystemConfig, value: number[]) => {
    setConfig(prev => ({
      ...prev,
      [name]: value[0]
    }));
  };

  // Handle switch changes
  const handleSwitchChange = (name: keyof SystemConfig, checked: boolean) => {
    setConfig(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  // Handle save settings
  const handleSaveSettings = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setMessage({
        type: 'success',
        text: 'System settings saved successfully'
      });
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage(null);
      }, 3000);
    }, 1000);
  };

  return (
    <div className="p-6 space-y-8">
      {message && (
        <Alert variant={message.type === 'success' ? 'default' : 'destructive'} className="mb-6">
          <AlertTitle>{message.type === 'success' ? 'Success' : 'Error'}</AlertTitle>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}
    
      <div>
        <h2 className="text-lg font-semibold mb-6">System Configuration</h2>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="apiEndpoint" className="text-[#e0e0e0] mb-1 block">API Endpoint</Label>
              <Input
                id="apiEndpoint"
                name="apiEndpoint"
                value={config.apiEndpoint}
                onChange={handleInputChange}
                className="bg-[#121212] border-[#2a2a2a]"
              />
              <p className="text-xs text-[#a3a3a3] mt-1">
                Base URL for API communications
              </p>
            </div>
            
            <div>
              <Label htmlFor="notificationEmail" className="text-[#e0e0e0] mb-1 block">Notification Email</Label>
              <Input
                id="notificationEmail"
                name="notificationEmail"
                type="email"
                value={config.notificationEmail}
                onChange={handleInputChange}
                className="bg-[#121212] border-[#2a2a2a]"
              />
              <p className="text-xs text-[#a3a3a3] mt-1">
                Email for system notifications and alerts
              </p>
            </div>
          </div>

          <div>
            <Label htmlFor="systemMessage" className="text-[#e0e0e0] mb-1 block">System Message</Label>
            <Textarea
              id="systemMessage"
              name="systemMessage"
              value={config.systemMessage}
              onChange={handleInputChange}
              className="bg-[#121212] border-[#2a2a2a] h-24"
            />
            <p className="text-xs text-[#a3a3a3] mt-1">
              Message displayed to all users on login
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="refreshRate" className="text-[#e0e0e0] mb-1 block">
                Data Refresh Rate: {config.refreshRate} seconds
              </Label>
              <Slider
                defaultValue={[config.refreshRate]}
                min={1}
                max={30}
                step={1}
                onValueChange={(value: number[]) => handleSliderChange('refreshRate', value)}
                className="my-4"
              />
              <p className="text-xs text-[#a3a3a3]">
                How frequently data is updated from the server
              </p>
            </div>
            
            <div>
              <Label htmlFor="maxConnections" className="text-[#e0e0e0] mb-1 block">
                Max Connections: {config.maxConnections}
              </Label>
              <Slider
                defaultValue={[config.maxConnections]}
                min={5}
                max={50}
                step={5}
                onValueChange={(value: number[]) => handleSliderChange('maxConnections', value)}
                className="my-4"
              />
              <p className="text-xs text-[#a3a3a3]">
                Maximum number of concurrent connections
              </p>
            </div>
          </div>
          
          <div>
            <Label htmlFor="dataRetentionDays" className="text-[#e0e0e0] mb-1 block">
              Data Retention Period: {config.dataRetentionDays} days
            </Label>
            <Slider
              defaultValue={[config.dataRetentionDays]}
              min={7}
              max={90}
              step={1}
              onValueChange={(value: number[]) => handleSliderChange('dataRetentionDays', value)}
              className="my-4"
            />
            <p className="text-xs text-[#a3a3a3]">
              How long historical data is stored before automatic deletion
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-[#1a1a1a] pt-6">
        <h3 className="text-md font-medium mb-4">System Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center justify-between p-4 rounded bg-[#121212]">
            <div>
              <Label htmlFor="maintenanceMode" className="font-medium">Maintenance Mode</Label>
              <p className="text-xs text-[#a3a3a3]">
                Restricts access to admin users only
              </p>
              {config.maintenanceMode && (
                <p className="text-xs text-[#ff6b00] mt-1 font-medium">
                  Warning: Regular users are redirected to maintenance page
                </p>
              )}
            </div>
            <Switch
              id="maintenanceMode"
              checked={config.maintenanceMode}
              onCheckedChange={(checked: boolean) => handleSwitchChange('maintenanceMode', checked)}
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded bg-[#121212]">
            <div>
              <Label htmlFor="debugMode" className="font-medium">Debug Mode</Label>
              <p className="text-xs text-[#a3a3a3]">
                Enables verbose logging and debugging tools
              </p>
              {config.debugMode && (
                <p className="text-xs text-[#ff6b00] mt-1 font-medium">
                  Active: Debug information is visible in console and network
                </p>
              )}
            </div>
            <Switch
              id="debugMode"
              checked={config.debugMode}
              onCheckedChange={(checked: boolean) => handleSwitchChange('debugMode', checked)}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-[#1a1a1a]">
        <Button
          type="button"
          onClick={handleSaveSettings}
          className="bg-[#ff6b00] hover:bg-[#ff6b00]/80 text-white"
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : 'Save Configuration'}
        </Button>
      </div>
    </div>
  );
} 