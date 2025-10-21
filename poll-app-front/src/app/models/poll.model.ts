import { Vote } from "./vote.model";

export interface Poll {
id: number;
question: string;
options: string[];
createdAt: string; // ISO
expiresAt?: string | null;
user?: { id: number; email: string; username?: string };
votes?: Vote[];
}