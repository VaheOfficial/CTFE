import { useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Slider } from '../ui/slider';
import { Switch } from '../ui/switch';
import { Textarea } from '../ui/textarea';

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

export function SystemSettings() {
  const [isLoading, setIsLoading] = useState(false);
  const [config, setConfig] = useState<SystemConfig>({
    apiEndpoint: 'https://api.mission-control.gov/v2',
    refreshRate: 5,
    maxConnections: 20,
    dataRetentionDays: 30,
    maintenanceMode: false,
    debugMode: false,
    notificationEmail: 'sysadmin@mission-control.gov',
    systemMessage: 'Welcome to Mission Control System v2.1.5',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setConfig({ ...config, [name]: value });
  };

  const handleSliderChange = (name: keyof SystemConfig, value: number[]) => {
    setConfig({ ...config, [name]: value[0] });
  };

  const handleSwitchChange = (name: keyof SystemConfig, checked: boolean) => {
    setConfig({ ...config, [name]: checked });
  };

  const handleSaveSettings = async () => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In a real app, this would send data to an API
    console.log('Saving system settings:', config);
    
    setIsLoading(false);
  };

  return (
    <div className="p-6 space-y-8">
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