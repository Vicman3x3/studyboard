import { Component, input, output, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadModule, FileUploadHandlerEvent } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ConfirmationService, MessageService } from 'primeng/api';
import { HttpService } from '../../../core/services/http.service';
import { API_ENDPOINTS } from '../../../core/config/api.endpoints';
import {
  Documento,
  DocumentosResponse,
  TipoReferencia,
} from '../documentos.model';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-file-uploader',
  imports: [CommonModule, FileUploadModule, ButtonModule, TableModule],
  template: `
    <div class="file-uploader">
      <h3>{{ titulo() }}</h3>

      <p-fileUpload
        #fileUpload
        [name]="'file'"
        [url]="uploadUrl()"
        [auto]="false"
        [multiple]="true"
        [maxFileSize]="maxFileSize()"
        [chooseLabel]="'Seleccionar archivos'"
        [uploadLabel]="'Subir'"
        [cancelLabel]="'Cancelar'"
        (onUpload)="onUpload($event)"
        (onError)="onError($event)"
        (uploadHandler)="customUploadHandler($event)"
        [customUpload]="true"
      >
        <ng-template pTemplate="content">
          <p class="text-muted" *ngIf="documentos().length === 0">
            No hay archivos adjuntos
          </p>
        </ng-template>
      </p-fileUpload>

      @if (documentos().length > 0) {
        <div class="mt-3">
          <h4>Archivos adjuntos</h4>
          <p-table [value]="documentos()" styleClass="p-datatable-sm">
            <ng-template pTemplate="header">
              <tr>
                <th>Nombre</th>
                <th>Tamaño</th>
                <th>Fecha</th>
                <th style="width: 180px">Acciones</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-doc>
              <tr>
                <td>{{ doc.nombreOriginal }}</td>
                <td>{{ formatSize(doc.tamano) }}</td>
                <td>{{ doc.fechaSubida | date: 'dd/MM/yyyy HH:mm' }}</td>
                <td>
                  <button
                    pButton
                    icon="pi pi-download"
                    class="p-button-text p-button-sm"
                    (click)="descargar(doc)"
                    title="Descargar"
                  ></button>
                  <button
                    pButton
                    icon="pi pi-trash"
                    class="p-button-text p-button-danger p-button-sm"
                    (click)="eliminar(doc.id)"
                    title="Eliminar"
                  ></button>
                </td>
              </tr>
            </ng-template>
          </p-table>
        </div>
      }
    </div>
  `,
  styles: [
    `
      .file-uploader {
        h3 {
          margin: 0 0 1rem 0;
          color: #003f8a;
          font-size: 1.1rem;
        }

        h4 {
          margin: 0 0 0.5rem 0;
          font-size: 1rem;
          color: #333;
        }

        .text-muted {
          color: #999;
          font-style: italic;
        }

        .mt-3 {
          margin-top: 1rem;
        }
      }
    `,
  ],
})
export class FileUploaderComponent {
  private readonly http = inject(HttpService);
  private readonly messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);

  // Inputs
  readonly titulo = input<string>('Archivos adjuntos');
  readonly tipoReferencia = input.required<TipoReferencia>();
  readonly referenciaId = input.required<string>();
  readonly maxFileSize = input<number>(10000000); // 10MB por defecto

  // Outputs
  readonly uploaded = output<void>();

  // State
  protected readonly documentos = signal<Documento[]>([]);
  protected readonly uploadUrl = signal(API_ENDPOINTS.documentos.upload);

  ngOnInit() {
    this.cargarDocumentos();
  }

  protected async customUploadHandler(event: FileUploadHandlerEvent) {
    const files = event.files;

    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('tipoReferencia', this.tipoReferencia());
      formData.append('referenciaId', this.referenciaId());

      try {
        await this.http.post(API_ENDPOINTS.documentos.upload, formData);
      } catch (error) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `Error al subir ${file.name}`,
        });
        console.error('Error subiendo archivo:', error);
      }
    }

    this.messageService.add({
      severity: 'success',
      summary: 'Éxito',
      detail: 'Archivos subidos correctamente',
    });

    await this.cargarDocumentos();
    this.uploaded.emit();
    event.files = [];
  }

  protected onUpload(event: any) {
    this.cargarDocumentos();
  }

  protected onError(event: any) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Error al subir el archivo',
    });
  }

  private async cargarDocumentos() {
    try {
      const response = await this.http.get<DocumentosResponse>(
        API_ENDPOINTS.documentos.getByReferencia(
          this.tipoReferencia(),
          this.referenciaId()
        )
      );
      this.documentos.set(response.data);
    } catch (error) {
      console.error('Error cargando documentos:', error);
    }
  }

  protected descargar(doc: Documento) {
    const downloadUrl = `${environment.apiUrl}${API_ENDPOINTS.documentos.download(doc.id)}`;
    window.open(downloadUrl, '_blank');
  }

  protected eliminar(id: string) {
    this.confirmationService.confirm({
      message: '¿Estás seguro de eliminar este archivo?',
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      accept: async () => {
        try {
          await this.http.delete(API_ENDPOINTS.documentos.delete(id));
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Archivo eliminado correctamente',
          });
          await this.cargarDocumentos();
        } catch (error) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al eliminar el archivo',
          });
          console.error('Error eliminando archivo:', error);
        }
      },
    });
  }

  protected formatSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
