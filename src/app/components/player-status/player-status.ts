import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { GameState } from '../../services/game-state';

@Component({
  selector: 'app-player-status',
  imports: [FormsModule, DatePipe],
  templateUrl: './player-status.html',
  styleUrl: './player-status.css',
})
export class PlayerStatus {
  gameState = inject(GameState);

  playerName = 'Aventureiro';
  level = 1;
  experienceToNextLevel = 100;

  studyMinutes = 30;

  selectedSkillId = 1;

  registerStudy() {
    this.gameState.registerStudy(this.studyMinutes, this.selectedSkillId);
  }
}
