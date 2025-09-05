import { Component, OnInit } from '@angular/core';
import { LogService } from '../../services/log.service';
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { AlertService } from '../../services/alert.service';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-log-detail',
  templateUrl: './log-detail.component.html',
  styleUrls: ['./log-detail.component.scss']
})
export class LogDetailComponent implements OnInit {
  logs: any[] = [];
  filteredLogs: any[] = [];
  pagedLogs: any[] = [];
  selectedLogs: any[] = [];

  searchTerm: string = '';
  pageSize: number = 10;
  currentPage: number = 1;
  totalPages: number = 1;
  gotoPageNumber: number = 1;


  showConfirmModal = false;
  confirmMessage = '';
  confirmAction: () => void = () => {};


  constructor(
    private logService: LogService,
    private router: Router,
    private authService: AuthService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.fetchLogs();
  }

  fetchLogs(): void {
    this.logService.getAllLogs().subscribe({
      next: (data: any[]) => {
        this.logs = data.reverse();
        this.filteredLogs = [...this.logs];
        this.updatePagination();
      },
      error: (err: any) => {
        console.error('Log verisi alınamadı:', err);
      }
    });
  }


  search(): void {
    const term = this.searchTerm.trim().toLowerCase();
    this.filteredLogs = this.logs.filter(log =>
      (log.operation?.toLowerCase().includes(term)) ||
      (log.detail?.toLowerCase().includes(term)) ||
      (log.ipAddress?.toLowerCase().includes(term)) ||
      (log.userId?.toString().includes(term))
    );
    this.currentPage = 1;
    this.updatePagination();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.filteredLogs = [...this.logs];
    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredLogs.length / this.pageSize) || 1;
    this.changePage(this.currentPage);
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.pagedLogs = this.filteredLogs.slice(start, end);
  }

  goToPage(): void {
    if (this.gotoPageNumber >= 1 && this.gotoPageNumber <= this.totalPages) {
      this.changePage(this.gotoPageNumber);
    }
  }

  toggleSelection(log: any): void {
    const index = this.selectedLogs.indexOf(log);
    if (index > -1) {
      this.selectedLogs.splice(index, 1);
    } else {
      this.selectedLogs.push(log);
    }
  }

  printSelectedLogs(): void {
    if (this.selectedLogs.length === 0) {
      this.alertService.show('Lütfen yazdırmak için en az bir log seçin!');
      return;
    }

    const logsToExport = this.selectedLogs.map(log => ({
      Durum: log.status ? 'Başarılı' : 'Başarısız',
      KullaniciID: log.userId,
      IslemTipi: log.operation,
      TarihSaat: new Date(log.timestamp).toLocaleString(),
      IP: log.ipAddress,
      Aciklama: log.detail
    }));

    const worksheet = XLSX.utils.json_to_sheet(logsToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'SecilenLoglar');

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, 'secilen_loglar.xlsx');
  }


  logout(): void {
    this.confirmMessage = 'Çıkış yapmak istediğinize emin misiniz?';
    this.confirmAction = () => {
      this.authService.logout();
    };
    this.showConfirmModal = true;
  }


  protected readonly Math = Math;
}
