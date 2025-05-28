import {
  Component,
  DestroyRef,
  OnDestroy,
  OnInit,
  computed,
  inject,
  signal
} from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { GenreService } from '../services/genre.service';
import { VideogameService } from '../services/videogame.service';
import { Platform } from '../models/platform';

@Component({
  selector: 'app-videogame-add',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './videogame-add.component.html',
  styleUrl: './videogame-add.component.css',
})
export class VideogameAddComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  newScreenshot: string = '';

  private readonly service = inject(VideogameService);
  private readonly genreService = inject(GenreService);
  private readonly destroyRef = inject(DestroyRef);

  readonly availablePlatforms: Platform[] = [
    new Platform(1, 'PlayStation 5', 'PS5'),
    new Platform(2, 'Xbox Series X', 'XSX'),
    new Platform(3, 'PC', 'PC'),
    new Platform(4, 'Nintendo Switch', 'Switch'),
  ];

  readonly selectedGenres = signal<any[]>([]);
  readonly selectedPlatforms = signal<Platform[]>([]);

  readonly genres = computed(() => this.genreService.genre_());
  readonly selectedGenresLabel = computed(() =>
    this.selectedGenres().length
      ? this.selectedGenres().map((g) => g.name).join(', ')
      : 'Seleziona i generi'
  );

  readonly selectedPlatformsLabel = computed(() =>
    this.selectedPlatforms().length
      ? this.selectedPlatforms().map((p) => p.name).join(', ')
      : 'Seleziona le piattaforme'
  );

  ngOnInit() {
    this.initForm();
    this.genreService.readAllGenres().subscribe((genres) => {
      this.genreService.genre_.set(genres);
    });
  }

  initForm() {
    this.form = new FormGroup({
      titleVideogame: new FormControl(''),
      genres: new FormControl([]),
      priceVideogame: new FormControl(),
      descVideogame: new FormControl(''),
      releaseDateVideogame: new FormControl<Date | null>(null),
      platforms: new FormControl([]),
      coverImage: new FormControl(''),
      screenshots: new FormArray([]),
    });
  }

  get screenshots(): FormArray {
    return this.form.get('screenshots') as FormArray;
  }

  toggleGenre(genre: any) {
    const current = this.selectedGenres();
    const exists = current.some((g) => g.name === genre.name);
    const updated = exists
      ? current.filter((g) => g.name !== genre.name)
      : [...current, genre];
    this.selectedGenres.set(updated);
    this.form.get('genres')?.setValue(updated);
  }

  togglePlatform(platform: Platform) {
    const current = this.selectedPlatforms();
    const exists = current.some((p) => p.id === platform.id);
    const updated = exists
      ? current.filter((p) => p.id !== platform.id)
      : [...current, platform];
    this.selectedPlatforms.set(updated);
    this.form.get('platforms')?.setValue(updated);
  }

  isSelectedGenre(genre: any): boolean {
    return this.selectedGenres().some((g) => g.name === genre.name);
  }

  isSelectedPlatform(platform: Platform): boolean {
    return this.selectedPlatforms().some((p) => p.id === platform.id);
  }

  addScreenshot() {
    const trimmed = this.newScreenshot.trim();
    if (trimmed) {
      this.screenshots.push(new FormControl(trimmed));
      this.newScreenshot = '';
    }
  }

  removeScreenshot(index: number) {
    this.screenshots.removeAt(index);
  }

  save() {
    if (this.form.valid) {
      this.service
        .createVideogame(this.form.value)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe();
    }
  }

  reset() {
    this.form.reset();
    this.selectedGenres.set([]);
    this.selectedPlatforms.set([]);
    this.genreService.genre_.set([]);
  }

  ngOnDestroy(): void {
    this.genreService
      .readAllGenres()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((genres) => this.genreService.genre_.set(genres));
  }
}
