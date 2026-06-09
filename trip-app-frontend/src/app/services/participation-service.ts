import { HttpClient, httpResource, HttpResourceRef } from '@angular/common/http';
import { inject, Injectable, Signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { PageResponse, Trip } from '../models/trip-model';

@Injectable({
  providedIn: 'root',
})
export class ParticipationService {

  private readonly httpClient = inject(HttpClient);
  private readonly backendUrl = `${environment.backendUrl}/participations`;

  getJoined(): Observable<Trip[]> {
    return this.httpClient.get<Trip[]>(`${this.backendUrl}/joined`);
  }

  getJoinedWithRessource() {
      return httpResource<PageResponse<Trip>>(() => `${this.backendUrl}/joined`);
  }

  joinTrip(tripId: string): Observable <void> {
    return this.httpClient.post<void>(`${this.backendUrl}/join/${tripId}`, {});
  }

  leaveTrip(tripId: string): Observable <void> {
    return this.httpClient.delete<void>(`${this.backendUrl}/${tripId}`, {});
  }


}
