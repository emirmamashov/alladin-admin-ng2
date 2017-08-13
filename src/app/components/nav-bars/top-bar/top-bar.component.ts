// core
import { Component, OnInit } from '@angular/core';

// services
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent implements OnInit {

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {
  }

  doLogout() {
    this.authService.logout();
  }

}
