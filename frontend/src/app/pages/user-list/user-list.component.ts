import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { AlertService } from '../../services/alert.service';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  users: any[] = [];
  allUsers: any[] = [];
  pagedUsers: any[] = [];
  searchTerm: string = '';
  selectedUserIds: number[] = [];

  currentPage: number = 1;
  pageSize: number = 7;
  totalPages: number = 1;
  gotoPageNumber: number = 1;

  constructor(
    private userService: UserService,
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['updated'] === 'true') {
        this.alertService.show('Kullanıcı başarıyla güncellendi!', 3000, true);
      }

      if (params['added'] === 'true') {
        this.alertService.show('Yeni kullanıcı başarıyla eklendi!', 3000, true);
      }

    });

    this.loadUsers();
  }


  loadUsers(): void {
    this.userService.getAllUsers().subscribe(data => {
      this.allUsers = data;
      this.users = [...this.allUsers];
      this.updatePagination();
    });
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.users.length / this.pageSize) || 1;
    this.changePage(this.currentPage);
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedUsers = this.users.slice(startIndex, endIndex);
  }

  goToPage(): void {
    if (this.gotoPageNumber >= 1 && this.gotoPageNumber <= this.totalPages) {
      this.changePage(this.gotoPageNumber);
    } else {
      this.alertService.show('Geçersiz sayfa numarası!', 3000);
    }
  }

  search(): void {
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      this.users = this.allUsers.filter(user =>
        user.firstName.toLowerCase().includes(term) ||
        user.lastName.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term)
      );
    } else {
      this.users = [...this.allUsers];
    }
    this.currentPage = 1;
    this.updatePagination();
  }

  onCheckboxChange(userId: number, event: any): void {
    if (event.target.checked) {
      this.selectedUserIds.push(userId);
    } else {
      this.selectedUserIds = this.selectedUserIds.filter(id => id !== userId);
    }
  }

  updateSelectedUser(): void {
    if (this.selectedUserIds.length !== 1) {
      this.alertService.show('Lütfen bir kullanıcı seçin!', 3000);
      return;
    }
    const selectedId = this.selectedUserIds[0];
    this.router.navigate(['/user-edit', selectedId]);
  }

  deleteSelectedUsers(): void {
    if (this.selectedUserIds.length === 0) {
      this.alertService.show('Lütfen silmek için en az bir kullanıcı seçin!', 3000, false);
      return;
    }

    this.confirmMessage = 'Seçili kullanıcıları silmek istediğinize emin misiniz?';
    this.confirmAction = () => {
      let successCount = 0;
      let realErrorCount = 0;

      this.selectedUserIds.forEach(id => {
        this.userService.deleteUser(id).subscribe({
          next: () => {
            successCount++;
            finalizeCheck();
          },
          error: (err) => {
            if (err.status !== 404) {
              realErrorCount++;
            }
            finalizeCheck();
          }
        });
      });

      const finalizeCheck = () => {
        if (successCount + realErrorCount === this.selectedUserIds.length) {
          if (realErrorCount === 0) {
            this.alertService.show('Silme işlemi başarıyla gerçekleşti!', 3000, true);
          } else {
            this.alertService.show('Bazı kullanıcılar silinemedi.', 3000, false);
          }
          this.loadUsers();
          this.selectedUserIds = [];

        }
      };
    };
    this.showConfirmModal = true;
  }


  reportSelectedUser(): void {
    if (this.selectedUserIds.length === 0) {
      this.alertService.show('Lütfen yazdırmak için en az bir kullanıcı seçin!', 3000, false);
      return;
    }

    const selectedUsers = this.users.filter(user => this.selectedUserIds.includes(user.id));

    if (selectedUsers.length === 0) {
      this.alertService.show('Seçili kullanıcı(lar) bulunamadı!', 3000, false);
      return;
    }

    const cleanedUsers = selectedUsers.map(user => ({
      'Ad': user.firstName,
      'Soyad': user.lastName,
      'Email': user.email,
      'Rol': user.role,
      'Adres': user.address
    }));

    const worksheet = XLSX.utils.json_to_sheet(cleanedUsers);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Kullanıcılar');
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, 'kullanicilar_raporu.xlsx');
  }

  reportAllUsers(): void {
    if (this.users.length === 0) {
      this.alertService.show('Yazdırmak için kullanıcı bulunamadı!', 3000, false);
      return;
    }

    const allUsers = this.users.map(user => ({
      'Ad': user.firstName,
      'Soyad': user.lastName,
      'Email': user.email,
      'Rol': user.role,
      'Adres': user.address
    }));

    const worksheet = XLSX.utils.json_to_sheet(allUsers);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'TümKullanicilar');
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, 'tum_kullanicilar.xlsx');
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


  clearSearch(): void {
    this.searchTerm = '';
    this.users = [...this.allUsers];
    this.currentPage = 1;
    this.updatePagination();
  }


}
