export interface Mission {
  id: number;
  title: string;
  description: string;
  reward: number;
  completed: boolean;
  category?: string;
}
