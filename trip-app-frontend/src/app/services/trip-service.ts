import { HttpClient, httpResource, HttpResourceRef } from '@angular/common/http';
import { inject, Injectable, Signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/internal/Observable';
import { Trip } from '../models/trip-model';

@Injectable({
  providedIn: 'root',
})
export class TripService {

  private readonly httpClient = inject(HttpClient);
  private readonly backendUrl = `${environment.backendUrl}/trips`;

  findAll(): Observable<Trip[]> {
    return this.httpClient.get<Trip[]>(this.backendUrl);
  }

  findMine(): Observable<Trip[]> {
    return this.httpClient.get<Trip[]>(`${this.backendUrl}/me`);
  }

  findByIdWithResource(id: Signal<string>): HttpResourceRef<Trip > {
    return httpResource<Trip>(() => `${this.backendUrl}/${id()}`) as HttpResourceRef<Trip>;
  }

  save(trip: Omit<Trip, 'id' | 'creatorId' | 'creatorName' | 'status' | 'imageUrl'>, file?: File): Observable<Trip> {
    const formData = new FormData();
    formData.append('trip', new Blob([JSON.stringify(trip)], { type: 'application/json' }));
    if (file) {
      formData.append('file', file);
    }
    return this.httpClient.post<Trip>(this.backendUrl, formData);
  }

  update(trip: Trip, file?: File): Observable<Trip> {
    const formData = new FormData();
    formData.append('trip', new Blob([JSON.stringify(trip)], { type: 'application/json' }));
    if (file) {
      formData.append('file', file);
    }
    return this.httpClient.put<Trip>(`${this.backendUrl}/${trip.id}`, formData);
  }

  delete(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.backendUrl}/${id}`);
  }
}
