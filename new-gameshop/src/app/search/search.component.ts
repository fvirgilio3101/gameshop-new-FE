import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { VideogameService } from '../services/videogame.service';
import { Videogame } from '../models/videogame';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  standalone: true,
  imports: [RouterModule, CommonModule]
})
export class SearchComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly videogameService = inject(VideogameService);

  searchResults: Videogame[] = [];

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const query = params['q'];
      if (query) {
        this.searchVideogames(query);
      }
    });
  }

  searchVideogames(query: string) {
    this.videogameService.searchVideogames(query).subscribe(result => {
      this.searchResults = result;
    });
  }
}
