import { Component, inject } from '@angular/core';
import { GameState } from '../../services/game-state';
import { FormsModule } from '@angular/forms';
import { Skill } from '../../models/skill';

@Component({
  selector: 'app-skill-list',
  imports: [FormsModule],
  templateUrl: './skill-list.html',
  styleUrl: './skill-list.css',
})
export class SkillList {
  gameState = inject(GameState);

  newSkillName = '';
  newSkillDescription = '';

  editingSkillId: number | null = null;

  editSkillName = '';
  editSkillDescription = '';

  getSkillLevel(experience: number): number {
    return Math.floor(experience / 100) + 1;
  }

  getSkillProgress(experience: number): number {
    return experience % 100;
  }

  addSkill() {
    if (!this.newSkillName.trim()) {
      return;
    }

    this.gameState.addSkill(this.newSkillName, this.newSkillDescription);

    this.newSkillName = '';
    this.newSkillDescription = '';
  }

  deleteSkill(skillId: number) {
    const confirmed = confirm('Tem certeza que deseja excluir esta habilidade?');

    if (confirmed) {
      this.gameState.deleteSkill(skillId);
    }
  }

  startEditing(skill: Skill) {
    this.editingSkillId = skill.id;
    this.editSkillName = skill.name;
    this.editSkillDescription = skill.description;
  }

  cancelEditing() {
    this.editingSkillId = null;
  }

  saveSkill() {
    if (this.editingSkillId === null || !this.editSkillName.trim()) {
      return;
    }

    this.gameState.updateSkill(this.editingSkillId, this.editSkillName, this.editSkillDescription);

    this.cancelEditing();
  }
}
