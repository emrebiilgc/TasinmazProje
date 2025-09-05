import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from "../../services/auth.service";
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {
  userId!: number;

  firstName: string = '';
  lastName: string = '';
  email: string = '';
  password: string = '';
  role: string = '';
  address: string = '';

  originalUser: any;
  errorFields: { [key: string]: boolean } = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private authService: AuthService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.userId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadUser();
  }

  loadUser(): void {
    this.userService.getUserById(this.userId).subscribe(user => {
      if (user) {
        this.originalUser = { ...user };
        this.setFormFields(user);
      } else {
        console.error('Kullanıcı bilgileri bulunamadı!');
      }
    }, error => {
      console.error('Kullanıcı bilgileri alınamadı:', error);
    });
  }

  setFormFields(user: any): void {
    this.firstName = user.firstName ?? '';
    this.lastName = user.lastName ?? '';
    this.email = user.email ?? '';
    this.role = user.role ?? '';
    this.address = user.address ?? '';
  }

  restoreOriginalData(): void {
    if (this.originalUser) {
      this.setFormFields(this.originalUser);
    }
  }

  updateUser(): void {
    this.errorFields = {};

    if (!this.firstName.trim()) this.errorFields['firstName'] = true;
    if (!this.lastName.trim()) this.errorFields['lastName'] = true;
    if (!this.email.trim() || !this.isValidEmail(this.email)) this.errorFields['email'] = true;
    if (!this.role.trim()) this.errorFields['role'] = true;
    if (!this.address.trim()) this.errorFields['address'] = true;

    if (this.password.trim() && !this.isValidPassword(this.password)) {
      this.errorFields['password'] = true;
    }

    if (Object.keys(this.errorFields).length > 0) {
      this.alertService.show('Lütfen eksik veya hatalı alanları düzeltin!', 3000, false);

      this.restoreOriginalData();
      return;
    }

    const updatedUser: any = {
      id: this.userId,
      firstName: this.firstName.trim(),
      lastName: this.lastName.trim(),
      email: this.email.trim(),
      role: this.role.trim(),
      address: this.address.trim()
    };

    if (this.password.trim()) {
      updatedUser.password = this.password.trim();
    }

    this.confirmMessage = 'Seçili kullanıcıya ait bilgileri güncellemek istediğinize emin misiniz?';
    this.confirmAction = () => {
      this.userService.updateUser(updatedUser).subscribe({
        next: () => {
          this.router.navigate(['/user-list'], { queryParams: { updated: 'true' } });
        },
        error: () => {
          this.alertService.show('Güncelleme sırasında bir hata oluştu!', 3000);
        }
      });
    };

    this.showConfirmModal = true;
  }


  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  isValidPassword(password: string): boolean {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&.,;:])[A-Za-z\d@$!%*#?&.,;:]{8,}$/;
    return passwordRegex.test(password);
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
