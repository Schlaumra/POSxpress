import { Injectable } from '@angular/core';
import { AbstractCrudService } from '@px/client-crud';
import { HttpClient } from '@angular/common/http';
import { ICreateUser, IUser, IUpdateUser, userEntityName } from '@px/interface';

@Injectable({
  providedIn: 'root',
})
export class UserSettingsService extends AbstractCrudService<
  IUser,
  ICreateUser,
  IUpdateUser
> {
  constructor(httpClient: HttpClient) {
    super(httpClient, userEntityName);
  }
}
