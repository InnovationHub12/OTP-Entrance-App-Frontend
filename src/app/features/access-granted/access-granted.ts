import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-access-granted',
  standalone: false,
  templateUrl: './access-granted.html',
  styleUrl: './access-granted.css',
})
export class AccessGranted implements OnInit {
  userName: string = '';

  constructor(private route: ActivatedRoute,
              private router:Router) {}

  ngOnInit(): void {
     this.userName = this.route.snapshot.queryParamMap.get('name') || '';
  }
  goBack(): void { this.router.navigate(['/scan']); }
}
