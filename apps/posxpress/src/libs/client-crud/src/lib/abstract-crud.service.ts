import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const basePath = '/api';

export abstract class AbstractCrudService<
  TEntity,
  TCreateEntity,
  TUpdateEntity
> {
  private basePath: string;

  constructor(private httpClient: HttpClient, private entityName: string) {
    this.basePath = basePath;
  }

  public index(): Observable<TEntity[]> {
    return this.httpClient.get<TEntity[]>(
      `${this.basePath}/${this.entityName}`
    );
  }
  public create(createEntity: TCreateEntity): Observable<TEntity> {
    return this.httpClient.post<TEntity>(
      `${this.basePath}/${this.entityName}`,
      createEntity
    );
  }
  public show(id: string) {
    return this.httpClient.get<TEntity>(
      `${this.basePath}/${this.entityName}/${id}`
    );
  }
  public update(id: string, updateEntity: TUpdateEntity) {
    return this.httpClient.patch<TEntity>(
      `${this.basePath}/${this.entityName}/${id}`,
      updateEntity
    );
  }
  public delete(id: string) {
    return this.httpClient.delete(`${this.basePath}/${this.entityName}/${id}`);
  }
}
