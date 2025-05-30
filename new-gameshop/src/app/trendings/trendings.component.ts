import { Component, inject, OnInit } from '@angular/core';
import { VideogameService } from '../services/videogame.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-trendings',
  imports: [CommonModule],
  templateUrl: './trendings.component.html',
  styleUrl: './trendings.component.css'
})
export class TrendingsComponent implements OnInit {
  private videogameService = inject(VideogameService);
 
  games = this.videogameService.videogames;
 
  ngOnInit(): void {
    this.videogameService.getTrendingVideogames();
  }

}
