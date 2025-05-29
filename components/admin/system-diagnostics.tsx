'use client';

import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ApiService } from '../../lib/api.service';

interface SystemDiagnosticsProps {
  clientIP: string;
}

export function SystemDiagnostics({ clientIP }: SystemDiagnosticsProps) {
  const [target, setTarget] = useState('');
  const [command, setCommand] = useState('ping');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [history, setHistory] = useState<Array<{timestamp: string, command: string, target: string, output: string}>>([]);

  const apiService = new ApiService();

  const runDiagnostic = async () => {
    if (!target.trim()) {
      setOutput('Error: Please enter a target host or IP address');
      return;
    }

    setIsRunning(true);
    setOutput('Running diagnostic...\n');

    try {
      const result = await apiService.runSystemDiagnostic(command, target);
      
      if (result.success) {
        let commandOutput = result.result || 'Command executed successfully';
        
        // Append stderr if present
        if (result.stderr && result.stderr.trim()) {
          commandOutput += '\n--- Standard Error ---\n' + result.stderr;
        }
        
        setOutput(commandOutput);
        
        // Add to history
        const newEntry = {
          timestamp: new Date().toLocaleString(),
          command,
          target,
          output: commandOutput
        };
        setHistory(prev => [newEntry, ...prev.slice(0, 9)]); // Keep last 10 entries
      } else {
        setOutput(`Error: ${result.message}`);
      }
    } catch (error) {
      setOutput(`Network Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
    } finally {
      setIsRunning(false);
    }
  };

  const clearOutput = () => {
    setOutput('');
    setHistory([]);
  };

  const commonTargets = [
    '8.8.8.8',
    'google.com',
    'github.com',
    '127.0.0.1',
    '192.168.1.1'
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start space-x-4">
        <div className="bg-blue-500/20 p-2 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-blue-500">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
            <line x1="8" y1="21" x2="16" y2="21"/>
            <line x1="12" y1="17" x2="12" y2="21"/>
            <polyline points="6 7 10 11 6 15"/>
            <line x1="12" y1="13" x2="18" y2="13"/>
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-bold text-[#f5f5f5]">System Diagnostics</h2>
          <p className="text-[#a3a3a3]">
            Network connectivity and system diagnostic tools - Terminal: {clientIP}
          </p>
        </div>
      </div>

      <Card variant="bordered" className="border-[#2a2a2a] bg-[#121212]">
        <CardHeader>
          <CardTitle className="text-[#f5f5f5]">Network Diagnostic Tool</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="command">Diagnostic Command</Label>
              <select 
                id="command"
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#2a2a2a] rounded-md text-[#f5f5f5] focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ping">ping - Test connectivity</option>
                <option value="traceroute">traceroute - Trace network path</option>
                <option value="nslookup">nslookup - DNS lookup</option>
                <option value="netstat">netstat - Network statistics</option>
                <option value="ps">ps - Process status</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="target">Target Host/IP</Label>
              <Input 
                id="target"
                type="text"
                placeholder="e.g. google.com or 8.8.8.8"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="bg-[#0a0a0a] border-[#2a2a2a] text-[#f5f5f5]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Quick Targets</Label>
            <div className="flex flex-wrap gap-2">
              {commonTargets.map((host) => (
                <Button
                  key={host}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setTarget(host)}
                  className="text-xs bg-[#1a1a1a] border-[#2a2a2a] hover:bg-[#2a2a2a] text-[#e0e0e0]"
                >
                  {host}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              type="button"
              onClick={runDiagnostic}
              disabled={isRunning}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isRunning ? 'Running...' : 'Run Diagnostic'}
            </Button>
            <Button 
              type="button"
              onClick={clearOutput}
              variant="outline"
              className="bg-[#1a1a1a] border-[#2a2a2a] hover:bg-[#2a2a2a] text-[#e0e0e0]"
            >
              Clear
            </Button>
          </div>

          {output && (
            <div className="space-y-2">
              <Label>Command Output</Label>
              <div className="bg-black/80 p-4 rounded-md border border-[#2a2a2a]">
                <pre className="text-sm text-green-400 font-mono whitespace-pre-wrap overflow-auto max-h-64">
                  {output}
                </pre>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {history.length > 0 && (
        <Card variant="bordered" className="border-[#2a2a2a] bg-[#121212]">
          <CardHeader>
            <CardTitle className="text-[#f5f5f5]">Command History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {history.map((entry, index) => (
                <div key={index} className="bg-[#0a0a0a] p-3 rounded border border-[#1a1a1a]">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-mono text-blue-400">
                      {entry.command} {entry.target}
                    </span>
                    <span className="text-xs text-[#a3a3a3]">{entry.timestamp}</span>
                  </div>
                  <pre className="text-xs text-[#e0e0e0] font-mono whitespace-pre-wrap max-h-20 overflow-auto">
                    {entry.output.substring(0, 200)}{entry.output.length > 200 ? '...' : ''}
                  </pre>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="text-xs text-[#666666] space-y-1">
        <p>⚠️ Note: This tool directly executes system commands on the server</p>
        <p>🔒 Access restricted to authorized administrators only</p>
        <p>📝 All commands are logged for security auditing</p>
      </div>
    </div>
  );
} 