import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GameState } from '../../services/game-state';
import { Mission } from '../../models/mission';

@Component({
  selector: 'app-mission-list',
  imports: [FormsModule],
  templateUrl: './mission-list.html',
  styleUrl: './mission-list.css',
})
export class MissionList {
  gameState = inject(GameState);

  categories = [
    'Estudos',
    'Projetos',
    'Programação',
    'Desafios pessoais'
  ];

  // Criação de missão
  newMissionTitle = '';
  newMissionDescription = '';
  newMissionReward = 20;
  newMissionCategory = 'Estudos';

  // Edição de missão
  editingMissionId: number | null = null;

  editMissionTitle = '';
  editMissionDescription = '';
  editMissionReward = 20;
  editMissionCategory = 'Estudos';

  addMission() {
    if (!this.newMissionTitle.trim() || this.newMissionReward <= 0) {
      return;
    }

    this.gameState.addMission(
      this.newMissionTitle,
      this.newMissionDescription,
      Number(this.newMissionReward),
      this.newMissionCategory
    );

    this.newMissionTitle = '';
    this.newMissionDescription = '';
    this.newMissionReward = 20;
    this.newMissionCategory = 'Estudos';
  }

  deleteMission(missionId: number) {
    const confirmed = confirm(
      'Tem certeza que deseja excluir esta missão?'
    );

    if (confirmed) {
      this.gameState.deleteMission(missionId);
    }
  }

  startEditing(mission: Mission) {
    this.editingMissionId = mission.id;
    this.editMissionTitle = mission.title;
    this.editMissionDescription = mission.description;
    this.editMissionReward = mission.reward;
    this.editMissionCategory = mission.category ?? 'Estudos';
  }

  cancelEditing() {
    this.editingMissionId = null;
  }

  saveMission() {
    if (
      this.editingMissionId === null ||
      !this.editMissionTitle.trim() ||
      this.editMissionReward <= 0
    ) {
      return;
    }

    this.gameState.updateMission(
      this.editingMissionId,
      this.editMissionTitle,
      this.editMissionDescription,
      Number(this.editMissionReward),
      this.editMissionCategory
    );

    this.cancelEditing();
  }
}
