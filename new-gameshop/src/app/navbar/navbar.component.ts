import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  selected: string = '';

  platforms = [
    { name: 'PC', label: 'PC', icon: 'bi bi-display' },
    { name: 'PlayStation', label: 'PlayStation', icon: 'bi bi-playstation' },
    { name: 'Xbox', label: 'Xbox', icon: 'bi bi-xbox' },
    { name: 'Nintendo', label: 'Nintendo', icon: 'bi bi-nintendo-switch' }
  ];

  selectPlatform(platform: string) {
    this.selected = platform;
    console.log('Selected:', platform);
  }
}
