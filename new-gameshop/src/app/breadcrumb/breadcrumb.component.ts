import { Component, OnInit,inject } from '@angular/core';
import { Router,ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-breadcrumb',
  imports: [],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.css'
})
export class BreadcrumbComponent implements OnInit {

  breadcrumb : string = '';

  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  ngOnInit(): void {
      this.router.events
        .pipe(filter(event => event instanceof NavigationEnd))
        .subscribe(() => {
          const path = this.route.root.firstChild?.snapshot.routeConfig?.path;
          this.breadcrumb = path ?? 'home';
        });
    }
  }
