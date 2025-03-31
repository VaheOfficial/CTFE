import { NextResponse } from 'next/server';

// In a real application, these would be stored in a database
let systemSettings = {
  maintenanceMode: false,
  debugMode: false,
  // Other system settings would go here
};

export async function GET() {
  return NextResponse.json(systemSettings);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Update system settings
    systemSettings = {
      ...systemSettings,
      ...data
    };
    
    // In a real application, you would persist these changes to a database
    
    return NextResponse.json(
      { success: true, message: 'Settings updated successfully', settings: systemSettings },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating system settings:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update settings' },
      { status: 500 }
    );
  }
} 