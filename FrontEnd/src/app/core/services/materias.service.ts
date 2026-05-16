import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';
import { API_ENDPOINTS } from '../config/api.endpoints';
import {
  Materia,
  CreateMateriaRequest,
  UpdateMateriaRequest,
  MateriaResponse,
  MateriasListResponse,
} from '../models/materia.model';

@Injectable({
  providedIn: 'root',
})
export class MateriasService {
  private readonly httpService = inject(HttpService);

  getAll(): Observable<MateriasListResponse> {
    return this.httpService.get<MateriasListResponse>(
      API_ENDPOINTS.materias.getAll
    );
  }

  getById(id: string): Observable<MateriaResponse> {
    return this.httpService.get<MateriaResponse>(
      API_ENDPOINTS.materias.getById(id)
    );
  }

  create(data: CreateMateriaRequest): Observable<MateriaResponse> {
    return this.httpService.post<MateriaResponse>(
      API_ENDPOINTS.materias.create,
      data
    );
  }

  update(
    id: string,
    data: UpdateMateriaRequest
  ): Observable<MateriaResponse> {
    return this.httpService.patch<MateriaResponse>(
      API_ENDPOINTS.materias.update(id),
      data
    );
  }

  delete(id: string): Observable<MateriaResponse> {
    return this.httpService.delete<MateriaResponse>(
      API_ENDPOINTS.materias.delete(id)
    );
  }
}
