export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  attachments?: {
    name: string;
    type: string;
    size: number;
    url?: string;
  }[];
}

export interface Chat {
  id: string;
  title: string;
  timestamp: Date;
  messages: Message[];
}
