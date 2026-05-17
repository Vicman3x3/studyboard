import { Component, EventEmitter, Input, Output, OnChanges, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpService } from '../../../core/services/http.service';
import { API_ENDPOINTS } from '../../../core/config/api.endpoints';
import {
  Parcial,
  ItemTemario,
  ItemsTemarioListResponse,
  ItemTemarioResponse,
  CreateItemTemarioRequest,
  UpdateItemTemarioRequest,
} from '../temarios.model';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ChipModule } from 'primeng/chip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-item-temario-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    InputTextareaModule,
    ChipModule,
    ConfirmDialogModule,
    ToastModule,
    MessageModule,
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './item-temario-list.component.html',
  styleUrl: './item-temario-list.component.scss',
})
export class ItemTemarioListComponent implements OnChanges {
  private readonly httpService = inject(HttpService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);

  @Input() parcial!: Parcial;
  @Output() onItemsUpdated = new EventEmitter<void>();

  readonly items = signal<ItemTemario[]>([]);
  readonly isLoading = signal(false);
  readonly showForm = signal(false);
  readonly editingItem = signal<ItemTemario | null>(null);

  readonly formTema = signal('');
  readonly formSubtemas = signal('');

  ngOnChanges() {
    this.loadItems();
  }

  loadItems() {
    const endpoint = `${API_ENDPOINTS.temarios.items.getAll}?parcial_id=${this.parcial.id}`;

    this.httpService.get<ItemsTemarioListResponse>(endpoint).subscribe({
      next: (response) => this.items.set(response.data),
      error: () => {},
    });
  }

  openCreateForm() {
    this.editingItem.set(null);
    this.formTema.set('');
    this.formSubtemas.set('');
    this.showForm.set(true);
  }

  openEditForm(item: ItemTemario) {
    this.editingItem.set(item);
    this.formTema.set(item.tema);
    this.formSubtemas.set(item.subtemas?.join('\n') || '');
    this.showForm.set(true);
  }

  cancelForm() {
    this.showForm.set(false);
    this.editingItem.set(null);
    this.formTema.set('');
    this.formSubtemas.set('');
  }

  saveItem() {
    if (!this.formTema().trim()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'El tema es requerido',
      });
      return;
    }

    this.isLoading.set(true);

    const subtemas = this.formSubtemas()
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const payload: CreateItemTemarioRequest | UpdateItemTemarioRequest = {
      tema: this.formTema().trim(),
      subtemas: subtemas.length > 0 ? subtemas : undefined,
      parcialId: this.parcial.id,
    };

    const request = this.editingItem()
      ? this.httpService.patch<ItemTemarioResponse>(
          API_ENDPOINTS.temarios.items.update(this.editingItem()!.id),
          payload
        )
      : this.httpService.post<ItemTemarioResponse>(API_ENDPOINTS.temarios.items.create, payload);

    request.subscribe({
      next: () => {
        this.loadItems();
        this.onItemsUpdated.emit();
        this.cancelForm();
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Item guardado correctamente',
        });
        this.isLoading.set(false);
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.message || 'Error al guardar el item',
        });
        this.isLoading.set(false);
      },
    });
  }

  deleteItem(item: ItemTemario) {
    this.confirmationService.confirm({
      message: `¿Eliminar el tema "${item.tema}"?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.httpService.delete(API_ENDPOINTS.temarios.items.delete(item.id)).subscribe({
          next: () => {
            this.loadItems();
            this.onItemsUpdated.emit();
            this.messageService.add({
              severity: 'success',
              summary: 'Eliminado',
              detail: 'Item eliminado exitosamente',
            });
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: err.error?.message || 'Error al eliminar el item',
            });
          },
        });
      },
    });
  }

  moveItem(item: ItemTemario, direction: 'up' | 'down') {
    const currentItems = this.items();
    const currentIndex = currentItems.findIndex((i) => i.id === item.id);

    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === currentItems.length - 1)
    ) {
      return;
    }

    const newOrder = direction === 'up' ? item.orden - 1 : item.orden + 1;

    this.httpService
      .patch<ItemTemarioResponse>(API_ENDPOINTS.temarios.items.update(item.id), { orden: newOrder })
      .subscribe({
        next: () => {
          this.loadItems();
          this.onItemsUpdated.emit();
        },
        error: () => {},
      });
  }
}
