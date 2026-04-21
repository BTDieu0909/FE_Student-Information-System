import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SearchLogSummary } from '../../../../core/services/portal-data.service';

@Component({
  selector: 'app-admin-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-stats.component.html',
  styleUrl: './admin-stats.component.css'
})
export class AdminStatsComponent {
  @Input() summary: SearchLogSummary | null = null;
}
