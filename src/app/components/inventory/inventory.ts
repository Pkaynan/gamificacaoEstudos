import { Component, inject } from '@angular/core';
import { GameState } from '../../services/game-state';

@Component({
  selector: 'app-inventory',
  imports: [],
  templateUrl: './inventory.html',
  styleUrl: './inventory.css',
})
export class Inventory {
  gameState = inject(GameState);
}
