import { Component, DestroyRef, inject, OnDestroy, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormArray, FormControl, FormGroup, FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms';
import { GenreService } from '../services/genre.service';
import { VideogameService } from '../services/videogame.service';
import { Platform } from '../models/platform';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-videogame-add',
  imports: [ReactiveFormsModule,
   FormsModule,
   CommonModule
  ],
  templateUrl: './videogame-add.component.html',
  styleUrl: './videogame-add.component.css'
})
export class VideogameAddComponent implements OnInit, OnDestroy {
   form!: FormGroup;
  newScreenshot:string = '';

  private readonly service = inject(VideogameService);
  private readonly genreService = inject(GenreService);
  private readonly destroyRef = inject(DestroyRef);

  selectGenres = this.genreService.getGenre_();
  availablePlatforms: Platform[] = [
    new Platform(1, 'PlayStation 5', 'PS5'),
    new Platform(2, 'Xbox Series X', 'XSX'),
    new Platform(3, 'PC', 'PC'),
    new Platform(4, 'Nintendo Switch', 'Switch'),
  ];

  ngOnInit() {
    this.form = new FormGroup({
      titleVideogame: new FormControl(''),
      genres: new FormControl([]),
      priceVideogame: new FormControl(),
      descVideogame: new FormControl(''),
      releaseDateVideogame: new FormControl<Date | null>(null),
      platforms: new FormControl([]),
      coverImage: new FormControl(''),
      screenshots: new FormArray([])
    });
  }

  get screenshots(): FormArray {
  return this.form.get('screenshots') as FormArray;
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

  ngOnDestroy(): void {
    this.genreService.readAllGenres()
    .pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(genres => this.genreService.getGenre_().set(genres))
  }

  save() {
    if (this.form.valid) {
      const formValue = this.form.value;
      this.service.createVideogame(formValue).pipe(
       takeUntilDestroyed(this.destroyRef)
      ).subscribe(() => {
      });
    }
  }

  reset() {
    this.form.reset();
  }
}



