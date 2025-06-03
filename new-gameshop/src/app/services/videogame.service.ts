import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal} from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Videogame } from '../models/videogame';

@Injectable({
  providedIn: 'root',
})
export class VideogameService {

  private readonly http = inject(HttpClient);
  baseUrl = 'http://localhost:8082/it.ecubit.gameshop/api/videogame';
   videogameSignal = signal<Videogame[]>([]);

  videogames = this.videogameSignal.asReadonly();

  bestSellerSignal = signal<Videogame[]>([]);
  bestSellers = this.bestSellerSignal.asReadonly();

  readAllVideogame(){
    this.http.get<Videogame[]>(this.baseUrl, {withCredentials : true}).subscribe(data => this.videogameSignal.set(data));
  }

  readVideogame(id:number):Observable<Videogame>{
    return this.http.get<Videogame>(this.baseUrl + '/'+ id);
  }

  createVideogame(videogame: Videogame){
    return this.http.post<Videogame>(this.baseUrl, videogame, {
      withCredentials: true,
    }).pipe(tap(videogame => this.videogameSignal.update(list => [...list, videogame])))
  }

  updateVideogame(videogame: Videogame): Observable<Videogame> {
    return this.http.put<Videogame>(this.baseUrl, videogame, {
      withCredentials: true,
    }).pipe(
      tap((updatedGame : Videogame) => {
        this.videogameSignal.set(
          this.videogameSignal().map(game => game.idVideogame === updatedGame.idVideogame ? updatedGame : game)
        )
      })
    );
  }

  deleteVideogame(videogame: Videogame): void {
    this.http.delete<void>(this.baseUrl, { withCredentials: true }).subscribe();
  }

  setGenres(id: number, genres: number[]): Observable<Videogame> {
    return this.http.put<Videogame>(`${this.baseUrl}/${id}/genre`, genres, {
      withCredentials: true,
    });
  }

 getTrendingVideogames() {
  this.http
    .get<Videogame[]>('http://localhost:8082/it.ecubit.gameshop/api/index/trendings')
    .subscribe(data => this.videogameSignal.set(data));
}

getBestSellingVideogames() {
  this.http
    .get<Videogame[]>('http://localhost:8082/it.ecubit.gameshop/api/index/best-sellers')
    .subscribe(data => this.bestSellerSignal.set(data));
}



}
