import type { UserRecord } from "firebase-admin/auth";


export interface User extends UserRecord {
    username?: string;
}

export interface SettingsMap {
    [key: string]: string;
}

export interface Message {
    id: number;
    author: string;
    content: string;
  }