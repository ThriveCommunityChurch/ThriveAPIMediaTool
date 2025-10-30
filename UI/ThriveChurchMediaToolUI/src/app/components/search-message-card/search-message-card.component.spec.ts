import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchMessageCardComponent } from './search-message-card.component';

describe('SearchMessageCardComponent', () => {
  let component: SearchMessageCardComponent;
  let fixture: ComponentFixture<SearchMessageCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchMessageCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchMessageCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

