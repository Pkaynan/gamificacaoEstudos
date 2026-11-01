import { Component } from '@angular/core';
import { PlayerStatus } from './components/player-status/player-status';
import { MissionList } from './components/mission-list/mission-list';
import { SkillList } from './components/skill-list/skill-list';
import { AchievementList } from './components/achievement-list/achievement-list';
import { inject } from '@angular/core';
import { GameState } from './services/game-state';
import { Inventory } from './components/inventory/inventory';

@Component({
  selector: 'app-root',
  imports: [PlayerStatus, MissionList, SkillList, AchievementList, Inventory],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  gameState = inject(GameState);
}
