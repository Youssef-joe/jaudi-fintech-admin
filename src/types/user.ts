export interface User {
    _id: string;
    username: string;
    email: string;
    role: "partner-sender" | "partner-receiver" | "regional-admin" | "global-admin";
    region: string;
}