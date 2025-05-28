import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideogameAddComponent } from './videogame-add.component';

describe('VideogameAddComponent', () => {
  let component: VideogameAddComponent;
  let fixture: ComponentFixture<VideogameAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideogameAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideogameAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
