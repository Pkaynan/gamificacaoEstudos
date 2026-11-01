export interface Item {
  id: number;
  name: string;
  description: string;
  icon: string;
  type: string;
  owned: boolean;
  requiredExperience: number;
  equipped: boolean;
}
