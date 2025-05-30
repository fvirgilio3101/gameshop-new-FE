import { Component, computed, inject, OnInit } from '@angular/core';
import { VideogameService } from '../services/videogame.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-trendings',
  imports: [CommonModule,RouterModule],
  templateUrl: './trendings.component.html',
  styleUrl: './trendings.component.css'
})
export class TrendingsComponent implements OnInit {
  private readonly videogameService = inject(VideogameService);

  games = computed(()=>this.videogameService.videogames());

  ngOnInit(): void {
    this.videogameService.getTrendingVideogames();
  }

}
