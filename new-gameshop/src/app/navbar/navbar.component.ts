import { CommonModule } from '@angular/common';
import { Component, computed, HostListener, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule,RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

  private readonly auth = inject(AuthService);
  private readonly profileService = inject(UserService)

  hidePlatformBar = false;

  profileImageUrl = computed(() => this.profileService.profileImageUrl());

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.hidePlatformBar = window.scrollY > 50;
  }

  isLoggedIn:boolean = false;
  selected: string = '';

  platforms = [
    { name: 'PC', label: 'PC', icon: 'bi bi-display',background: 'bg-warning' },
    { name: 'PlayStation', label: 'PlayStation', icon: 'bi bi-playstation',background:'bg-primary' },
    { name: 'Xbox', label: 'Xbox', icon: 'bi bi-xbox',background: 'bg-success' },
    { name: 'Nintendo', label: 'Nintendo', icon: 'bi bi-nintendo-switch',background:'bg-danger' }
  ];

  ngOnInit(): void {
    const loggedInStatus = sessionStorage.getItem('isLoggedIn');
    this.isLoggedIn = loggedInStatus === 'true';
    this.loadProfileImage();
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
    console.log('Selected:', platform);
  }

  logout(){
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('userID');
    this.isLoggedIn = false;
    window.location.href = '/home';
  }
}
