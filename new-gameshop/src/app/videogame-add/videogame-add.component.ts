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

  selectedPlatform: string | null = null;
  readonly availablePlatforms = [
    'PlayStation 5',
    'PlayStation 4',
    'Xbox One',
    'Xbox Series X',
    'Nintendo Switch',
    'Nintendo Switch 2',
    'PC'
  ];

  readonly selectedGenres = signal<any[]>([]);

  readonly genres = computed(() => this.genreService.genre_());
  readonly selectedGenresLabel = computed(() =>
    this.selectedGenres().length
      ? this.selectedGenres().map((g) => g.name).join(', ')
      : 'Seleziona i generi'
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
      platform: new FormControl(''),
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


  isSelectedGenre(genre: any): boolean {
    return this.selectedGenres().some((g) => g.name === genre.name);
  }

  selectPlatform(platform: string) {
    this.selectedPlatform = platform;
    this.form.get('platform')?.setValue(platform);
    console.log(this.form.get('platform')?.value)
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
    this.genreService.genre_.set([]);
  }

  ngOnDestroy(): void {
    this.genreService
      .readAllGenres()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((genres) => this.genreService.genre_.set(genres));
  }
}
