import { Component, OnInit } from '@angular/core';
import { LogService } from 'src/app/services/log.service';
import { Router } from '@angular/router';
import { AuthService } from "../../services/auth.service";

@Component({
  selector: 'app-log-list',
  templateUrl: './log-list.component.html',
  styleUrls: ['./log-list.component.scss']
})
export class LogListComponent implements OnInit {
  logs: any[] = [];
  allLogs: any[] = [];
  pagedLogs: any[] = [];
  searchTerm: string = '';

  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 1;
  gotoPageNumber: number = 1;

  constructor(
    private logService: LogService,
    private router: Router,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.loadLogs();
  }

  loadLogs(): void {
    this.logService.getAllLogs().subscribe(data => {
      this.allLogs = data.reverse();
      this.logs = [...this.allLogs];
      this.updatePagination();
    });
  }


  updatePagination(): void {
    this.totalPages = Math.ceil(this.logs.length / this.pageSize) || 1;
    this.changePage(this.currentPage);
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedLogs = this.logs.slice(startIndex, endIndex);
  }

  goToPage(): void {
    if (this.gotoPageNumber >= 1 && this.gotoPageNumber <= this.totalPages) {
      this.changePage(this.gotoPageNumber);
    }
  }

  search(): void {
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      this.logs = this.allLogs.filter(log =>
        (log.userId?.toString() || '').includes(term) ||
        (log.operation || '').toLowerCase().includes(term) ||
        (log.detail || '').toLowerCase().includes(term) ||
        (log.ipAddress || '').toLowerCase().includes(term) ||
        (log.status || '').toLowerCase().includes(term)
      );
    } else {
      this.logs = [...this.allLogs];
    }
    this.currentPage = 1;
    this.updatePagination();
  }

  goToLogDetails(): void {
    this.router.navigate(['/log-detail']);
  }

  showConfirmModal = false;
  confirmMessage = '';
  confirmAction: () => void = () => {};

  logout(): void {
    this.confirmMessage = 'Çıkış yapmak istediğinize emin misiniz?';
    this.confirmAction = () => {
      this.authService.logout();
    };
    this.showConfirmModal = true;
  }

}
