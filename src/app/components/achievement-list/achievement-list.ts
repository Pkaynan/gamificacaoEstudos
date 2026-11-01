import { Component, inject } from '@angular/core';
import { GameState } from '../../services/game-state';

@Component({
  selector: 'app-achievement-list',
  imports: [],
  templateUrl: './achievement-list.html',
  styleUrl: './achievement-list.css',
})
export class AchievementList {
  gameState = inject(GameState);

  getAchievementProgress(achievementId: number): string {
    const totalStudyMinutes = this.gameState.activities.reduce(
      (total, activity) => total + activity.minutes,
      0,
    );

    switch (achievementId) {
      case 1:
        return `${Math.min(this.gameState.activities.length, 1)}/1 sessões`;

      case 2:
        return `${Math.min(totalStudyMinutes, 300)}/300 minutos`;

      case 3:
        return `${Math.min(this.gameState.experience(), 100)}/100 XP`;

      case 4:
        return `${Math.min(this.gameState.skills().length, 5)}/5 habilidades`;

      default:
        return '';
    }
  }
}
