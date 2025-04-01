export interface GlobalState {
    _id: string | null;
    state: "normal" | "warning" | "critical";
    reason: string | null;
    createdAt: string | null;
    updatedAt: string | null;
    timeout: number | null;
    timeoutStop: Date | null;
    associatedUser: string | null;
    createdUser: string | null;
}
