import { CommonModule, DOCUMENT } from '@angular/common';
import { ChangeDetectorRef, Component, computed, effect, ElementRef, HostListener, inject,OnInit, signal, viewChild } from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { filter} from 'rxjs';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule,FormsModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit{

  private readonly auth = inject(AuthService);
  private readonly profileService = inject(UserService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly document = inject(DOCUMENT);

  profileImageUrl = computed(() => this.profileService.profileImageUrl());
  readonly isLoggedIn = computed(() => this.auth.isLoggedIn());
  readonly _role = computed(()=>this.auth.role());
  selected: string = '';

  readonly platformBar = viewChild.required<ElementRef>('platformBar');

  searchFormEl: HTMLElement | null = null;
  showSearch = signal(false);

  searchQuery='';


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

 toggleSearch() {
  this.showSearch.set(true);

  
  /*this.platformBar().nativeElement.style.display = 'none';

  
  const searchContainer = this.document.createElement('div');
  searchContainer.classList.add('d-flex', 'flex-nowrap', 'align-items-center', 'rounded-pill');

  const form = this.document.createElement('form');
  form.classList.add('w-100');

  const wrapper = this.document.createElement('div');

  const input = this.document.createElement('input');
  input.classList.add('position-absolute', 'h-100', 'text-white', 'text', 'outline-none', 'search-input');
  input.setAttribute('spellcheck', 'false');
  input.setAttribute('name', 'search');
  input.setAttribute('autocapitalize', 'off');
  input.setAttribute('autocomplete', 'off');
  input.value = this.searchQuery;

  const closeBtn = this.document.createElement('div');
  closeBtn.classList.add('position-absolute', 'd-flex', 'align-items-center', 'justify-content-center', 'pointer', 'close-search');
  closeBtn.innerHTML = `<i class="bi bi-x"></i>`;
  closeBtn.onclick = () => this.hideSearch();

  wrapper.appendChild(input);
  wrapper.appendChild(closeBtn);
  form.appendChild(wrapper);
  searchContainer.appendChild(form);

  // Inserisci subito dopo platformBar
  this.platformBar().nativeElement.innerHTML = searchContainer;
  this.searchFormEl = form;

  setTimeout(() => input.focus(), 0);*/
}


  hideSearch() {
    this.showSearch.set(false);

    /*this.platformBar().nativeElement.style.display = 'flex';

    if (this.searchFormEl) {
      this.searchFormEl.remove();
      this.searchFormEl = null;
    }*/
  }
}