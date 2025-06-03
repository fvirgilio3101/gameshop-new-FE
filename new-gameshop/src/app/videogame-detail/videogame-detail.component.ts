import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { VideogameService } from '../services/videogame.service';

@Component({
  selector: 'app-videogame-detail',
  imports: [CommonModule],
  templateUrl: './videogame-detail.component.html',
  styleUrl: './videogame-detail.component.css'
})
export class VideogameDetailComponent {

  private readonly service = inject(VideogameService);
  private readonly route = inject(ActivatedRoute);

  private readonly id = Number(this.route.snapshot.paramMap.get('id'));

  game_ = toSignal(this.service.readVideogame(this.id));


}
