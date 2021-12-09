import { environment } from './../../../../environments/environment';
import { CREATE_MAGASIN, ASSIGN_ROLE_BASE, CREATE_ROLE_VENDEUR, CREATE_VENDEUR } from './register-vendeur.graphql';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { DataService } from './../../../core/providers/data/data.service';
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Vendeur, Magasin, Permission } from './model';

@Component({
  selector: 'vsf-register-vendeur',
  templateUrl: './register-vendeur.component.html',
  styleUrls: ['./register-vendeur.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterVendeurComponent implements OnInit {
  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  infoVendeur = new Vendeur;
  infoMagasin = new Magasin;
  valid: boolean = false;
  confirmPass: any;
  permission =  Permission;
  show: boolean = false;
  redirect: boolean = false;
  constructor(private dataService: DataService,
              private changeDetector: ChangeDetectorRef,
              private _formBuilder: FormBuilder,
              private router: Router,
              private toastr: ToastrService) { }

  ngOnInit(): void {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required],
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required],
    });
  }

  save(){
    this.show = true;
    this.redirect = false;
    const token = this.makeid(20);
    if (this.infoVendeur.firstName && this.infoVendeur.lastName && this.infoVendeur.emailAddress) {
      console.log("nom", this.infoVendeur)
      console.log('info magasin', this.infoMagasin)
      if (this.infoMagasin.code && this.infoMagasin.adressChannel && this.infoMagasin.emailAdress && this.infoMagasin.telephone) {
        this.dataService.mutate<any, any>(CREATE_MAGASIN, {
          input: 
                {
                  token: token,
                  defaultLanguageCode: "fr",
                  pricesIncludeTax: true,
                  currencyCode: "EUR",
                  defaultTaxZoneId: 1,
                  defaultShippingZoneId: 1,
                  code: this.infoMagasin.code,
                  customFields: {
                      adressChannel: this.infoMagasin.adressChannel,
                      emailAdress: this.infoMagasin.emailAdress,
                      telephone: this.infoMagasin.telephone,
                      long: 22.232424,
                      lat: 2.2323424
                  }
                }
        }).subscribe((resp) =>{
          if (resp.creerMagasin.id) {
            const idChannel = resp.creerMagasin.id;
            this.dataService.mutate<any, any>(ASSIGN_ROLE_BASE, {
              channelId: parseInt(idChannel)
            }).subscribe(res =>{
              if (res) {
                const key = this.makeid(5)
                this.dataService.mutate<any, any>(CREATE_ROLE_VENDEUR, {
                  input: {
                    code: "Admin_" + this.infoMagasin.code.split(' ').join('_') + '_' + key,
                    description: "Admin " + this.infoMagasin.code + ' ' + key,
                    channelIds: [idChannel],
                    permissions: this.permission
                  }
                }).subscribe(role =>{
                  if (role.createRoleVendeur.id) {
                    const roleId = role.createRoleVendeur.id;
                    this.dataService.mutate<any, any>(CREATE_VENDEUR, {
                      input: {
                        firstName: this.infoVendeur.firstName,
                        lastName: this.infoVendeur.lastName,
                        emailAddress: this.infoVendeur.emailAddress,
                        password: this.infoVendeur.password,
                        roleIds: [parseInt(roleId)]
                      }
                    }).subscribe(seller =>{
                      if (seller.createVendeur.id) {
                        this.toastr.success('Felicitation', "Création de votre compte avec success");
                        this.show = false;
                        this.redirect = true;
                      } else {
                        this.toastr.error("Une erreur s'est produit lors du creation vendeur");
                        this.show = false;
                      }
                    })
                  } else {
                    this.toastr.error("Erreur lors du creation role");
                    this.show = false;
                  }
                })
              }
            })
          } else {
            this.toastr.error("Une erreur s'est produit lors du creation du magasin");
            this.show = false;
          }
        })
      }else{
        this.toastr.info('Veuillez verifier les information de votre magasin')
      }
    }else{
      this.toastr.info('Veuillez completéz les informations')
    }
   
  }

  checkPassword(event: any){
    if ((this.infoVendeur.password === this.confirmPass) && this.infoVendeur.firstName && this.infoVendeur.lastName && this.infoVendeur.emailAddress) {
      this.valid = true;
    }
  }

  inscrireVendeur(){
    this.router.navigate(['account/register'])
  }

  makeid(length: number) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

  redirectBo(){
    const link = environment.apiHost + ':' + environment.apiPort + '/admin'
    window.open(link)?.focus()
  }
}
