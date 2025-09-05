import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { AuthService } from "../../services/auth.service";
import { AlertService } from '../../services/alert.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.scss']
})
export class UserAddComponent implements OnInit {
  @ViewChild('form') form!: NgForm;

  firstName: string = '';
  lastName: string = '';
  email: string = '';
  password: string = '';
  role: string = '';
  address: string = '';

  errorFields: { [key: string]: boolean } = {};

  constructor(
    private userService: UserService,
    private router: Router,
    private authService: AuthService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {}

  addUser(): void {
    this.errorFields = {};

    if (!this.firstName.trim()) this.errorFields['firstName'] = true;
    if (!this.lastName.trim()) this.errorFields['lastName'] = true;
    if (!this.email.trim() || !this.isValidEmail(this.email)) this.errorFields['email'] = true;
    if (!this.password.trim() || !this.isValidPassword(this.password)) this.errorFields['password'] = true;
    if (!this.role.trim()) this.errorFields['role'] = true;
    if (!this.address.trim()) this.errorFields['address'] = true;

    if (Object.keys(this.errorFields).length > 0) {
      this.alertService.show('Lütfen tüm alanları eksiksiz ve doğru giriniz!', 3000);
      return;
    }

    const newUser = {
      firstName: this.firstName.trim(),
      lastName: this.lastName.trim(),
      email: this.email.trim(),
      password: this.password.trim(),
      role: this.role.trim(),
      address: this.address.trim()
    };

    this.confirmMessage = 'Yeni kullanıcıyı eklemek istediğinize emin misiniz?';
    this.confirmAction = () => {
      this.userService.addUser(newUser).subscribe({
        next: () => {
          this.router.navigate(['/user-list'], { queryParams: { added: 'true' } });
        },
        error: () => {
          this.alertService.show('Kullanıcı ekleme sırasında bir hata oluştu!', 3000);
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
