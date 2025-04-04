export interface User {
    name: string | null;
    email: string | null;
    role: string | null;
    clearanceLevel: string | null;
    temperaturePreference: string | null;
    accountStatus: string | null;
    lastActive: string | null;
    lastLogin: string | null;
    lastPasswordChange: string | null;
    logEntries: LogEntry[] | null;
    activeSessions: ActiveSession[] | null;
    createdAt: string | null;
    updatedAt: string | null;
    _id: string | null;
}

export interface LogEntry {
    _id: string | null;
    userId: string | null;
    location: string | null;
    date: string | null;
    description: string | null;
    type: string | null;
    status: string | null;
    createdAt: string | null;
    updatedAt: string | null;
}

export interface ActiveSession {
    _id: string | null;
    userId: string | null;
    sessionId: string | null;
    browser: string | null;
    device: string | null;
    ipAddress: string | null;
    location: string | null;
    createdAt: string | null;
    lastActive: string | null;
}

