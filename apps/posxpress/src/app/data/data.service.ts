import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Order, IPrinter, Settings } from '@px/interface';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private httpClient: HttpClient) {}

  testPrinter(ip: string): Observable<boolean> {
    return this.httpClient.get<boolean>('/api/printers/test', { params: { ip } })
  }

  getPrinters(): Observable<IPrinter[]> {
    return this.httpClient.get<IPrinter[]>('/api/printers');
  }
  print(order: Order) {
    return this.httpClient.post(`api/printers/print`, order);
  }

  getSettings(): Observable<Settings> {
    return this.httpClient.get<Settings>('/api/settings');
  }

  updateSettings(settings: Partial<Settings>) {
    return this.httpClient.patch<void>('/api/settings', settings)
  }

  public getAllTags(): Observable<string[]> {
    return this.getSettings().pipe(map(settings => settings.tags))
  }
  public addTag(tag: string): Observable<unknown> {
    return this.httpClient.post<void>('/api/settings/tag', {tag})
  }

  public removeTag(tag: string): Observable<unknown> {
    return this.httpClient.delete<void>('/api/settings/tag',{body: {tag}})
  }
}
