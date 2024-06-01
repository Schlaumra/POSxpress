import { AsyncPipe, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import {
    NonNullableFormBuilder,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormTagSelectComponent } from '@px/client-forms';
import { Settings } from '@px/interface';
import {
    BehaviorSubject,
    Observable,
    filter,
    map,
    merge,
    skip,
    switchMap
} from 'rxjs';
import { DataService } from '../../data/data.service';
import { AdminSettings } from '../settings';

@Component({
  selector: 'px-dashboard.settings',
  templateUrl: './dashboard.settings.component.html',
  styleUrls: ['./dashboard.settings.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    NgIf,
    AsyncPipe,
    FormTagSelectComponent,
  ],
})
export class DashboardSettingsComponent extends AdminSettings {
  title = 'Benutzer';
  tags = [];
  tableForm = this.formBuilder.group({
    table: this.formBuilder.control(0, Validators.required),
    tags: [new Array<string>()],
  });
  settingsSubject = new BehaviorSubject<Settings | null>(null);
  settings$: Observable<Settings | null> = this.settingsSubject.asObservable();
  changes$: Observable<Partial<Settings>>;

  constructor(
    private readonly formBuilder: NonNullableFormBuilder,
    protected dataService: DataService
  ) {
    super();
    this.dataService.getSettings().subscribe((settings) => {
      this.settingsSubject.next(settings);
      this.tableForm.controls.table.setValue(settings.tables);
      this.tableForm.controls.tags.setValue(settings.tags);
    });
    this.changes$ = this.tableForm.controls.table.valueChanges.pipe(
        skip(1),
        map((val) => ({ tables: val }))
    );

    this.changes$.pipe(switchMap(value => this.dataService.updateSettings(value))).subscribe();
  }
}
