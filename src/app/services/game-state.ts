import { Injectable, signal } from '@angular/core';
import { Mission } from '../models/mission';
import { Skill } from '../models/skill';
import { Achievement } from '../models/achievement';
import { Item } from '../models/item';

@Injectable({
  providedIn: 'root',
})
export class GameState {
  experience = signal(0);

  activities: {
    minutes: number;
    experience: number;
    date: Date;
  }[] = [];

  achievementNotifications = signal<Achievement[]>([]);

  skills = signal<Skill[]>([
    {
      id: 1,
      name: 'Java',
      description: 'Programação e orientação a objetos.',
      experience: 0,
    },
    {
      id: 2,
      name: 'Angular',
      description: 'Desenvolvimento frontend.',
      experience: 0,
    },
    {
      id: 3,
      name: 'Banco de dados',
      description: 'SQL e modelagem de dados.',
      experience: 0,
    },
    {
      id: 4,
      name: 'Algoritmos',
      description: 'Lógica e resolução de problemas.',
      experience: 0,
    },
  ]);

  missions: Mission[] = [
    {
      id: 1,
      title: 'Primeiros passos em Java',
      description: 'Estudar Java por 2 horas.',
      reward: 40,
      completed: false,
    },
    {
      id: 2,
      title: 'Desafio de programação',
      description: 'Resolver 3 desafios de programação.',
      reward: 30,
      completed: false,
    },
    {
      id: 3,
      title: 'Explorador de conhecimento',
      description: 'Estudar um assunto completamente novo.',
      reward: 50,
      completed: false,
    },
  ];

  items = signal<Item[]>([
    {
      id: 1,
      name: 'Espada de madeira',
      description: 'Uma arma simples para quem está começando.',
      icon: '🗡️',
      type: 'Arma',
      owned: false,
      requiredExperience: 50,
      equipped: false,
    },
    {
      id: 2,
      name: 'Livro do conhecimento',
      description: 'Um símbolo da dedicação aos estudos.',
      icon: '📖',
      type: 'Acessório',
      owned: false,
      requiredExperience: 100,
      equipped: false,
    },
    {
      id: 3,
      name: 'Armadura do estudante',
      description: 'Conquistada por quem completa seus desafios.',
      icon: '🛡️',
      type: 'Armadura',
      owned: false,
      requiredExperience: 200,
      equipped: false,
    },
    {
      id: 4,
      name: 'Coroa do mestre',
      description: 'Uma recompensa para jogadores experientes.',
      icon: '👑',
      type: 'Acessório',
      owned: false,
      requiredExperience: 500,
      equipped: false,
    },
  ]);

  constructor() {
    this.loadProgress();
  }

  registerStudy(minutes: number, skillId: number) {
    if (minutes <= 0) {
      return;
    }

    const earnedExperience = Math.floor(minutes / 30) * 10;

    if (earnedExperience === 0) {
      return;
    }

    const skillExists = this.skills().some((skill) => skill.id === skillId);

    if (!skillExists) {
      return;
    }

    // XP geral
    this.experience.update((current) => current + earnedExperience);

    // XP da habilidade selecionada
    this.skills.update((skills) =>
      skills.map((skill) =>
        skill.id === skillId
          ? {
              ...skill,
              experience: skill.experience + earnedExperience,
            }
          : skill,
      ),
    );

    this.activities.push({
      minutes,
      experience: earnedExperience,
      date: new Date(),
    });

    this.checkAchievements();
  }

  private saveProgress() {
    const progress = {
      experience: this.experience(),
      activities: this.activities,
      missions: this.missions,
      skills: this.skills(),
      achievements: this.achievements(),
      items: this.items(),
    };

    localStorage.setItem('level-up-progress', JSON.stringify(progress));
  }

  private loadProgress() {
    try {
      const savedProgress = localStorage.getItem('level-up-progress');

      if (!savedProgress) {
        return;
      }

      const progress = JSON.parse(savedProgress);

      this.experience.set(progress.experience ?? 0);

      this.activities = (progress.activities ?? []).map((activity: any) => ({
        ...activity,
        date: new Date(activity.date),
      }));

      if (progress.missions) {
        this.missions = progress.missions;
      }

      if (progress.skills) {
        this.skills.set(progress.skills);
      }

      if (progress.achievements) {
        this.achievements.set(progress.achievements);
      }

      if (progress.items) {
        this.items.update((defaultItems) =>
          defaultItems.map((defaultItem) => {
            const savedItem = progress.items.find((item: Item) => item.id === defaultItem.id);

            if (!savedItem) {
              return defaultItem;
            }

            return {
              ...defaultItem,
              ...savedItem,
              requiredExperience: savedItem.requiredExperience ?? defaultItem.requiredExperience,
              equipped: savedItem.equipped ?? false,
            };
          }),
        );
      }
    } catch (error) {
      console.error('Erro ao carregar o progresso:', error);
    }
  }

  get level(): number {
    return Math.floor(this.experience() / 100) + 1;
  }

  get experienceInCurrentLevel(): number {
    return this.experience() % 100;
  }

  get experienceToNextLevel(): number {
    return 100;
  }

  addMission(title: string, description: string, reward: number, category: string) {
    const newMission: Mission = {
      id: Math.max(0, ...this.missions.map((mission) => mission.id)) + 1,
      title,
      description,
      reward,
      completed: false,
      category,
    };

    this.missions.push(newMission);

    this.saveProgress();
  }
  deleteMission(missionId: number) {
    this.missions = this.missions.filter((mission) => mission.id !== missionId);

    this.saveProgress();
  }

  updateMission(
    missionId: number,
    title: string,
    description: string,
    reward: number,
    category: string,
  ) {
    this.missions = this.missions.map((mission) =>
      mission.id === missionId
        ? {
            ...mission,
            title,
            description,
            reward,
            category,
          }
        : mission,
    );

    this.saveProgress();
  }

  addSkill(name: string, description: string) {
    const newSkill: Skill = {
      id: Math.max(0, ...this.skills().map((skill) => skill.id)) + 1,
      name,
      description,
      experience: 0,
    };

    this.skills.update((skills) => [...skills, newSkill]);

    this.saveProgress();
    this.checkAchievements();
  }

  deleteSkill(skillId: number) {
    this.skills.update((skills) => skills.filter((skill) => skill.id !== skillId));

    this.saveProgress();
  }

  updateSkill(skillId: number, name: string, description: string) {
    this.skills.update((skills) =>
      skills.map((skill) =>
        skill.id === skillId
          ? {
              ...skill,
              name,
              description,
            }
          : skill,
      ),
    );

    this.saveProgress();
  }

  achievements = signal<Achievement[]>([
    {
      id: 1,
      title: 'Primeiro passo',
      description: 'Registre sua primeira sessão de estudos.',
      icon: '📚',
      unlocked: false,
    },
    {
      id: 2,
      title: 'Estudante dedicado',
      description: 'Acumule 5 horas de estudo.',
      icon: '⏳',
      unlocked: false,
    },
    {
      id: 3,
      title: 'Subindo de nível',
      description: 'Alcance o nível 2.',
      icon: '⭐',
      unlocked: false,
    },
    {
      id: 4,
      title: 'Explorador',
      description: 'Cadastre 5 habilidades.',
      icon: '🧭',
      unlocked: false,
    },
  ]);

  checkAchievements() {
    const totalStudyMinutes = this.activities.reduce(
      (total, activity) => total + activity.minutes,
      0,
    );

    const conditions: Record<number, boolean> = {
      1: this.activities.length >= 1,
      2: totalStudyMinutes >= 300,
      3: this.experience() >= 100,
      4: this.skills().length >= 5,
    };

    const newlyUnlocked: Achievement[] = [];

    this.achievements.update((achievements) =>
      achievements.map((achievement) => {
        if (conditions[achievement.id] && !achievement.unlocked) {
          newlyUnlocked.push(achievement);

          return { ...achievement, unlocked: true };
        }

        return achievement;
      }),
    );

    this.saveProgress();

    if (newlyUnlocked.length > 0) {
      this.achievementNotifications.update((notifications) => [...notifications, ...newlyUnlocked]);
    }
  }

  dismissAchievementNotification() {
    this.achievementNotifications.update((notifications) => notifications.slice(1));
  }

  buyItem(itemId: number) {
    const item = this.items().find((item) => item.id === itemId);

    if (!item || item.owned) {
      return;
    }

    if (this.experience() < item.requiredExperience) {
      return;
    }

    this.items.update((items) =>
      items.map((item) => (item.id === itemId ? { ...item, owned: true } : item)),
    );

    this.saveProgress();
  }

  toggleEquipItem(itemId: number) {
    this.items.update((items) => {
      const selectedItem = items.find((item) => item.id === itemId);

      if (!selectedItem || !selectedItem.owned) {
        return items;
      }

      return items.map((item) => {
        if (item.type !== selectedItem.type) {
          return item;
        }

        if (item.id === selectedItem.id) {
          return { ...item, equipped: !item.equipped };
        }

        return { ...item, equipped: false };
      });
    });

    this.saveProgress();
  }

  completeMission(missionId: number) {
    const mission = this.missions.find((mission) => mission.id === missionId);

    if (!mission || mission.completed) {
      return;
    }

    this.missions = this.missions.map((mission) =>
      mission.id === missionId ? { ...mission, completed: true } : mission,
    );

    this.experience.update((current) => current + mission.reward);

    this.checkAchievements();
  }
}
