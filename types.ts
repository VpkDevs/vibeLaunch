import React from 'react';

export interface DeploymentOption {
  name: string;
  description: string;
  pros: string[];
  cons: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
  bestFor: string;
}

export interface AIPrompt {
  label: string;
  text: string;
  copyText: string;
}

export interface GuideSection {
  id: string;
  title: string;
  subtitle?: string;
  estimatedTime: string; // e.g., "5 mins"
  type: 'intro' | 'checklist' | 'tutorial' | 'troubleshooting' | 'success';
  content: React.ReactNode;
  prompts?: AIPrompt[];
  warning?: {
    title: string;
    text: string;
  };
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}