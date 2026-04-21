import { CommonModule } from '@angular/common';
import { Component, inject, signal, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ActorItem, DepartmentItem, PortalDataService } from '../../../../core/services/portal-data.service';

@Component({
  selector: 'app-actor-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './actor-management.component.html',
  styleUrl: './actor-management.component.css'
})
export class ActorManagementComponent {
  @Input() departments: DepartmentItem[] = [];
  
  private readonly portalDataService = inject(PortalDataService);
  
  protected readonly actors = signal<ActorItem[]>([]);
  protected readonly actorTotalCount = signal(0);
  protected readonly isActorModalOpen = signal(false);
  protected readonly selectedActorId = signal<string | null>(null);
  protected readonly actorMessage = signal('');
  protected readonly actorError = signal('');
  
  protected readonly actorForm = {
    username: '',
    fullName: '',
    role: '',
    departmentId: ''
  };

  constructor() {
    this.loadActors();
  }

  protected loadActors(): void {
    this.portalDataService.getActors().subscribe({
      next: (items) => {
        const map = new Map<string, ActorItem>();
        for (const it of items || []) {
          if (it.id) map.set(it.id, it);
        }
        const deduped = Array.from(map.values());
        this.actors.set(deduped);
        this.actorTotalCount.set(deduped.length);
      },
      error: () => this.actors.set([])
    });
  }

  protected selectActor(item: ActorItem): void {
    this.selectedActorId.set(item.id ?? null);
    this.actorForm.username = item.username;
    this.actorForm.fullName = item.fullName;
    this.actorForm.role = item.role;
    this.actorForm.departmentId = item.departmentId ?? '';
    this.actorMessage.set('');
    this.actorError.set('');
    this.isActorModalOpen.set(true);
  }

  protected clearActorSelection(): void {
    this.selectedActorId.set(null);
    this.actorForm.username = '';
    this.actorForm.fullName = '';
    this.actorForm.role = '';
    this.actorForm.departmentId = '';
    this.actorMessage.set('');
    this.actorError.set('');
    this.isActorModalOpen.set(true);
  }

  protected closeActorModal(): void {
    this.isActorModalOpen.set(false);
  }

  protected createActor(): void {
    if (!this.actorForm.username || !this.actorForm.fullName || !this.actorForm.role) {
      this.actorError.set('Username, full name va role la bat buoc.');
      return;
    }
    
    this.portalDataService.createActor({
      username: this.actorForm.username,
      fullName: this.actorForm.fullName,
      role: this.actorForm.role,
      departmentId: this.actorForm.departmentId || undefined
    }).subscribe({
      next: () => {
        this.actorMessage.set('Da tao tai khoan moi.');
        this.loadActors();
        setTimeout(() => this.closeActorModal(), 1500);
      },
      error: (err: HttpErrorResponse) => {
        this.actorError.set(err.error?.message || 'Khong the tao tai khoan.');
      }
    });
  }

  protected saveActor(): void {
    const id = this.selectedActorId();
    if (!id) return;

    this.portalDataService.updateActor(id, {
      username: this.actorForm.username,
      fullName: this.actorForm.fullName,
      role: this.actorForm.role,
      departmentId: this.actorForm.departmentId || undefined
    }).subscribe({
      next: () => {
        this.actorMessage.set('Da cap nhat tai khoan.');
        this.loadActors();
        setTimeout(() => this.closeActorModal(), 1000);
      },
      error: (err: HttpErrorResponse) => {
        this.actorError.set(err.error?.message || 'Khong the cap nhat.');
      }
    });
  }

  protected deleteSelectedActor(): void {
    const id = this.selectedActorId();
    if (!id || !confirm('Ban co chac muon xoa tai khoan nay?')) return;

    this.portalDataService.deleteActor(id).subscribe({
      next: () => {
        this.actorMessage.set('Da xoa tai khoan.');
        this.loadActors();
        setTimeout(() => this.closeActorModal(), 1000);
      },
      error: (err: HttpErrorResponse) => {
        this.actorError.set(err.error?.message || 'Khong the xoa.');
      }
    });
  }
}
