export interface Vote {
id: number;
chosenOptionIndex: number;
votedAt: string;
user?: { id: number; email?: string; username?: string } | null;
}