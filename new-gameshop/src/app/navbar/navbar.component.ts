import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule,RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

  private readonly auth = inject(AuthService);

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
