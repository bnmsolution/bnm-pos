import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../auth/auth.service';

@Component({
  selector: 'app-callback',
  template: `
    <div>Loading...</div>`
})
export class CallbackComponent implements OnInit {

  constructor(private auth: AuthService, private router: Router) {
    // Parse authentication hash
    // auth.handleAuth();
    auth.handleAuthentication();
  }

  ngOnInit() {
    // this.auth.loggedIn$.subscribe(
    //   loggedIn => loggedIn ? this.router.navigate(['/']) : null
    // );
  }
}
