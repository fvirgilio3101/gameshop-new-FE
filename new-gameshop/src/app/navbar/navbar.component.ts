import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, computed, effect, HostListener, inject,OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { filter} from 'rxjs';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit{

  private readonly auth = inject(AuthService);
  private readonly profileService = inject(UserService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);


  hidePlatformBar = false;
  profileImageUrl = computed(() => this.profileService.profileImageUrl());
  readonly isLoggedIn = computed(() => this.auth.isLoggedIn());
  readonly _role = computed(()=>this.auth.role());
  selected: string = '';

  platforms = [
    { name: 'PC', label: 'PC', icon: 'bi bi-display', background: 'pc' },
    { name: 'PlayStation', label: 'PlayStation', icon: 'bi bi-playstation', background: 'playstation' },
    { name: 'Xbox', label: 'Xbox', icon: 'bi bi-xbox', background: 'xbox' },
    { name: 'Nintendo', label: 'Nintendo', icon: 'bi bi-nintendo-switch', background: 'nintendo' }
  ];

  ngOnInit(): void {
  this.auth.checkAuth().subscribe({
    next: () => {
      this.auth.isLoggedIn.set(true);
      this.loadProfileImage(); // <-- spostato qui
    },
    error: () => this.auth.isLoggedIn.set(false)
  });

  this.router.events.pipe(
    filter(event => event instanceof NavigationEnd)
  ).subscribe(() => {
    const urlPlatform = this.router.url.split('/')[1]?.toLowerCase() || '';
    const matchedPlatform = this.platforms.find(p => p.name.toLowerCase() === urlPlatform);
    this.selected = matchedPlatform ? matchedPlatform.name : '';
  });
}



  loadProfileImage() {
    this.profileService.getProfileImage().subscribe({
      next: (url) => {
        const oldUrl = this.profileService.profileImageUrl();
        if (oldUrl) URL.revokeObjectURL(oldUrl);
        this.profileService.profileImageUrl.set(url);
        this.cdr.detectChanges();
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
