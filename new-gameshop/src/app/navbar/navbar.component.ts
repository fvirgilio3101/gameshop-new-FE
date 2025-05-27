import { CommonModule } from '@angular/common';
import { Component, computed, HostListener, inject, OnDestroy, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {

  private readonly auth = inject(AuthService);
  private readonly profileService = inject(UserService);
  private readonly router = inject(Router);

  hidePlatformBar = false;
  profileImageUrl = computed(() => this.profileService.profileImageUrl());

  private loginSub?: Subscription;

  isLoggedIn: boolean = false;
  selected: string = '';

  platforms = [
    { name: 'PC', label: 'PC', icon: 'bi bi-display', background: 'bg-warning' },
    { name: 'PlayStation', label: 'PlayStation', icon: 'bi bi-playstation', background: 'bg-primary' },
    { name: 'Xbox', label: 'Xbox', icon: 'bi bi-xbox', background: 'bg-success' },
    { name: 'Nintendo', label: 'Nintendo', icon: 'bi bi-nintendo-switch', background: 'bg-danger' }
  ];

  ngOnInit(): void {
    this.loginSub = this.auth.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
      if (status) {
        this.loadProfileImage();
      }
    });

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      const urlPlatform = this.router.url.split('/')[1]?.toLowerCase() || '';
      const matchedPlatform = this.platforms.find(p => p.name.toLowerCase() === urlPlatform);
      this.selected = matchedPlatform ? matchedPlatform.name : '';
    });
  }

  ngOnDestroy(): void {
    this.loginSub?.unsubscribe();
  }

  loadProfileImage() {
    this.profileService.getProfileImage().subscribe({
      next: (url) => {
        const oldUrl = this.profileService.profileImageUrl();
        if (oldUrl) URL.revokeObjectURL(oldUrl);
        this.profileService.profileImageUrl.set(url);
      }
    });
  }

  selectPlatform(platform: string) {
    this.selected = platform;
    this.router.navigate(['/', platform.toLowerCase()]);
  }

  logout() {
  this.auth.logout();
  const oldUrl = this.profileService.profileImageUrl();
  if (oldUrl) URL.revokeObjectURL(oldUrl);
  this.profileService.profileImageUrl.set(null);
  
  this.router.navigate(['/home']);
}

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.hidePlatformBar = window.scrollY > 50;
  }
}
