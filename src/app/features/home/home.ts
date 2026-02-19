import { Component } from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth-service';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  role: string | null = null;
  constructor(private router: Router, private authService: AuthService)
  {
    const storedRole = localStorage.getItem('role');

    if (storedRole) {
      this.role = storedRole;
    }else {
      const userData = localStorage.getItem('userData');
      if (userData) {
        const parsed = JSON.parse(userData);
        this.role = parsed.role || parsed.user?.role || null;
      }
    }
  }


  goToScan(): void {
    this.router.navigate(['/scan']);
  }
  goToADmin(){
    this.router.navigate(['/admin']);
  }

  goToQrCode(){
    this.router.navigate(['/userProfile']);
  }

  isDisabled(button: string): boolean {
    if (this.role === 'security' && button === 'admin')
      return true;
    if (this.role === 'officials' && (button === 'security' || button === 'admin'))
      return true;
    return false;
  }
}
