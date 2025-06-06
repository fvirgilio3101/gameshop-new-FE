import { Component, computed, inject, OnInit } from '@angular/core';
import { VideogameService } from '../services/videogame.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-platform-page',
  imports: [CommonModule,RouterModule,BreadcrumbComponent],
  templateUrl: './platform-page.component.html',
  styleUrl: './platform-page.component.css'
})
export class PlatformPageComponent implements OnInit {

  private readonly service = inject(VideogameService);
  private readonly route = inject(ActivatedRoute);

  readonly games_ = computed(()=>this.service.videogames())

  readonly platform = this.route.snapshot.routeConfig?.path as string;

  ngOnInit(): void {
    this.service.getByPlatform(this.platform);
  }

}
