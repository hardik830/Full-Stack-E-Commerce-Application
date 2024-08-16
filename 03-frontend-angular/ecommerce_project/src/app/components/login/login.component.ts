import { Component, Inject, OnInit } from '@angular/core';
import { OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { RegistrationFlow } from '@okta/okta-auth-js/lib/idx/flow';

import OktaSignIn from '@okta/okta-signin-widget';
import myappConfig from 'src/app/config/myapp-config';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  oktaSignin: any;


  constructor(
    @Inject(OKTA_AUTH) private oktaAuth: OktaAuth
  ) { 

  this.oktaSignin = new OktaSignIn({
    logo: 'assets/images/logo.png',
    features: {
      registration: true // Corrected the key to 'registration'
  },
    baseUrl: myappConfig.oidc.issuer.split('/oauth2')[0],
    clientId: myappConfig.oidc.clientId,
    redirectUri: myappConfig.oidc.redirectUri,
   
    authParams: {
      pkce: true,
      issuer: myappConfig.oidc.issuer,
      scopes: myappConfig.oidc.scopes
    }
  });
}

  ngOnInit(): void {
    this.oktaSignin.remove();

    this.oktaSignin.renderEl({
      el: '#okta-sign-in-widget'}, // this name should be same as div tag id in login.component.html
      (response: any) => {
        if (response.status === 'SUCCESS') {
          this.oktaAuth.signInWithRedirect();
        }
      },
      (error: any) => {
        throw error;
      }
    );
   
   }
  

}
