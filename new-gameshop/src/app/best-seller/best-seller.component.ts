import { Component, computed, inject, OnInit } from '@angular/core';
import { VideogameService } from '../services/videogame.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-best-seller',
  imports: [CommonModule,RouterModule],
  templateUrl: './best-seller.component.html',
  styleUrl: './best-seller.component.css'
})
export class BestSellerComponent implements OnInit{
   private readonly videogameService = inject(VideogameService);

  games = computed(()=>this.videogameService.bestSellers());

  ngOnInit(): void {
    this.videogameService.getBestSellingVideogames();
  }

}
