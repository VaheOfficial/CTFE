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
    missions: Mission[] | null;
    commendations: Commendation[] | null;
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

export interface Mission {
    _id: string | null;
    name: string | null;
    description: string | null;
    status: string | null;
    participants: string[] | null;
    commendations: string[] | null;
    createdAt: string | null;
    updatedAt: string | null;
    launch: string | null;
}

export interface Commendation {
    _id: string | null;
    name: string | null;
    description: string | null;    
    awardee: string | null;
    revoked: boolean | null;
    revokedDate: string | null;
    reason: string | null;
    createdAt: string | null;
    updatedAt: string | null;
}