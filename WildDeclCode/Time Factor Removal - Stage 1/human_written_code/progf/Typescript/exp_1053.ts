import { Directive,Input,OnInit,
  TemplateRef,
  ElementRef } from '@angular/core';
var KeycloakService = require('keycloak-angular').KeycloakService;
var KeycloakAuthorizationService = require('../services/keycloak-authorization.service').KeycloakAuthorizationService;
var KeycloakResourcePermissionsCheck = require('../interfaces/keycloak-permissions').KeycloakResourcePermissionsCheck;


@Directive({
  selector: '[enableForKeycloakAuthorization]'
})
class EnableForKeycloakAuthorizationDirective {
    
    @Input('enableForKeycloakAuthorization') requiredAuthorization: string;
    
    constructor(
        private element: ElementRef, 
        private keycloakAngular: KeycloakService,
        private authService:KeycloakAuthorizationService
    ) { }
    
    
    ngOnInit() {
        
        this.noAuthPresentAction();

        let authCheck = <KeycloakResourcePermissionsCheck>{};
        let requiredScope = null;
        if (this.requiredAuthorization.includes("#")){
            let authArr = this.requiredAuthorization.split("#");
            authCheck = {
                 rsname:authArr[0],
                 scope:authArr[1]
            };
        } else {
            authCheck = {
                 rsname:this.requiredAuthorization
             };
        }

        this.keycloakAngular.isLoggedIn().then(function res {
            if(this.authService.checkAuthorization(authCheck)){
                this.authPresentAction();    
                
            }
        });


     }
     
     private authPresentAction(){

         this.element.nativeElement.disabled = false;
         
     }
     
     private noAuthPresentAction(){
         this.element.nativeElement.disabled = true;
     }



}
