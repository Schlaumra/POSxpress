import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { AsyncPipe, NgFor } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {
  BehaviorSubject,
  EMPTY,
  Observable,
  ReplaySubject,
  Subject,
  map,
  shareReplay,
  startWith,
  switchMap,
  tap,
} from 'rxjs';

interface AllTagsService {
  getAllTags: () => Observable<string[]>;
  addTag: (tag: string) => Observable<unknown>;
  removeTag: (tag: string) => Observable<unknown>;
}

@Component({
  selector: 'px-form-tag-select',
  templateUrl: 'form-tag-select.component.html',
  styleUrls: ['form-tag-select.component.scss'],
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
export class FormTagSelectComponent implements OnInit, OnDestroy {
  @Input({ required: true })
  public tags!: string[] | undefined;

  @Input({ required: true })
  public allTagsService!: AllTagsService;

  @Input()
  public removeTags = false;

  @Output()
  public changeEvent = new EventEmitter<string[]>();

  @ViewChild('tagsInput') tagsInput!: ElementRef<HTMLInputElement>;
  triggerUpdateSubject = new BehaviorSubject<void>(undefined);
  allTagsSubject = new ReplaySubject<Observable<string[]>>();
  allTags$: Observable<string[]> = this.allTagsSubject.pipe(
    switchMap((o) => o),
    shareReplay({ refCount: true, bufferSize: 1 })
  );
  tagCtrl = new FormControl('');
  filteredTagsSubject = new ReplaySubject<Observable<string[]>>();
  filteredTags$: Observable<string[]> = this.filteredTagsSubject.pipe(
    switchMap((o) => o),
    shareReplay({ refCount: true, bufferSize: 1 })
  );
  separatorKeysCodes: number[] = [ENTER, COMMA];

  addedEntrySubject = new Subject<string>();
  removedEntrySubject = new Subject<string>();

  ngOnDestroy(): void {
    this.allTagsSubject.complete();
    this.filteredTagsSubject.complete();
    this.removedEntrySubject.complete();
    this.addedEntrySubject.complete();
  }
  ngOnInit(): void {
    const allTags$ = this.triggerUpdateSubject.pipe(
      switchMap(() =>
        this.allTagsService
          .getAllTags()
          .pipe(shareReplay({ refCount: true, bufferSize: 1 }))
      )
    );

    this.allTagsSubject.next(allTags$);

    this.filteredTagsSubject.next(
      allTags$.pipe(
        switchMap((allTags) =>
          this.tagCtrl.valueChanges.pipe(
            startWith(null),
            map((tag: string | null) =>
              tag ? this._filter(tag, allTags) : allTags.slice()
            )
          )
        )
      )
    );

    allTags$
      .pipe(
        switchMap((allTags) =>
          this.addedEntrySubject.pipe(
            switchMap((addedTag) => {
              const tagsSet = new Set(allTags);
              tagsSet.add(addedTag);
              if (tagsSet.size != allTags.length) {
                return this.allTagsService
                  .addTag(addedTag)
                  .pipe(tap(() => this.triggerUpdateSubject.next()));
              }
              return EMPTY;
            })
          )
        )
      )
      .subscribe();

    if (this.removeTags) {
      allTags$
        .pipe(
          switchMap((allTags) =>
            this.removedEntrySubject.pipe(
              switchMap((removedTag) => {
                const tagsSet = new Set(allTags);
                tagsSet.delete(removedTag);
                if (tagsSet.size != allTags.length) {
                  return this.allTagsService
                    .removeTag(removedTag)
                    .pipe(tap(() => this.triggerUpdateSubject.next()));
                }
                return EMPTY;
              })
            )
          )
        )
        .subscribe();
    }
  }

  add(event: MatChipInputEvent): void {
    const tag = (event.value || '').trim();

    if (tag != '') {
      if (!this.tags?.find((t) => t === tag)) {
        this.tags?.push(tag);

        this.changeEvent.emit(this.tags);
        this.addedEntrySubject.next(tag);
      }
      event.chipInput?.clear();
      this.tagCtrl.setValue(null);
    }
  }

  remove(tag: string): void {
    const index = this.tags?.indexOf(tag);

    if (index !== undefined && index >= 0) {
      this.tags?.splice(index, 1);
      this.changeEvent.emit(this.tags);
      this.removedEntrySubject.next(tag);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.tags?.push(event.option.viewValue);
    this.changeEvent.emit(this.tags);
    this.tagsInput.nativeElement.value = '';
    this.tagCtrl.setValue(null);
  }

  private _filter(value: string, tags: string[]): string[] {
    const filterValue = value.toLowerCase();

    return tags.filter((tag) => tag.toLowerCase().includes(filterValue));
  }
}
