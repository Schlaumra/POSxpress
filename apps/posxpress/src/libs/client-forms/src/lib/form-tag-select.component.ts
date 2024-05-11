import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { AsyncPipe, NgFor } from '@angular/common';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Observable, map, startWith } from 'rxjs';

@Component({
  selector: 'px-form-tag-select',
  templateUrl: 'form-tag-select.component.html',
  styleUrls: [
    'form-tag-select.component.scss'
  ],
  standalone: true,
  imports: [
    MatInputModule,
    MatChipsModule,
    MatIconModule,
    NgFor,
    AsyncPipe,
    ReactiveFormsModule,
    MatAutocompleteModule,
  ],
})
export class FormTagSelectComponent {

  @Input({required: true})
  public tags!: string[] | undefined

  @Input({required: true})
  public allTags: string[] = []

  @ViewChild('tagsInput') tagsInput!: ElementRef<HTMLInputElement>;

  tagCtrl = new FormControl('');
  filteredTags: Observable<string[]>;
  separatorKeysCodes: number[] = [ENTER, COMMA];

  
  constructor() {
    this.filteredTags = this.tagCtrl.valueChanges.pipe(
      startWith(null),
      map((tag: string | null) =>
        tag ? this._filter(tag) : this.allTags.slice()
      )
    );
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    this.tags?.push(value);
    event.chipInput?.clear();

    this.tagCtrl.setValue(null);
  }

  remove(tag: string): void {
    const index = this.tags?.indexOf(tag);

    if (index !== undefined && index >= 0) {
      this.tags?.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.tags?.push(event.option.viewValue);
    this.tagsInput.nativeElement.value = '';
    this.tagCtrl.setValue(null);
  }
  
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allTags.filter((tag) =>
      tag.toLowerCase().includes(filterValue)
    );
  }
}
