import { Component, computed, inject, OnInit } from '@angular/core';
import { VideogameService } from '../services/videogame.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [CommonModule,RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  private readonly videogameService = inject(VideogameService);

  games = computed(()=>this.videogameService.videogames());
  bestSellerGames = computed(()=> this.videogameService.bestSellers())

  ngOnInit(): void {
    this.videogameService.getTrendingVideogames();
    this.videogameService.getBestSellingVideogames();
  }
}
