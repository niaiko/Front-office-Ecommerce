import { NotificationService } from './../../../core/providers/notification/notification.service';
import { SEND_MESSAGE } from './contact-us.graphql';
import { Router } from '@angular/router';
import { GET_ACTIVE_CUSTOMER } from './../../../common/graphql/documents.graphql';
import { DataService } from 'src/app/core/providers/data/data.service';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'vsf-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactUsComponent implements OnInit {
  logged: boolean = false;
  dataActive: any = {};
  message: any;
  constructor(private dataService: DataService,
              private router: Router,
              private notif: NotificationService,
              private toastr: ToastrService) { }

  ngOnInit(): void {
    this.dataService.query<any>(GET_ACTIVE_CUSTOMER, {}, 'no-cache').subscribe(res =>{
      if (res.activeCustomer !== null) {
        this.logged = true;
        this.dataActive = res.activeCustomer
      } else {
        this.logged = false;
        this.router.navigate(['account/sign-in'])
        this.notif.info('Veuillez vous connectez')
      }
    })
  }

  send(){
    console.log("mess", this.message)
    if (this.message === undefined) {
      this.toastr.info('veuillez saisir votre message')
    } else {
      this.dataService.mutate<any, any>(SEND_MESSAGE, {
        input: {
          message: this.message,
          contact: this.dataActive.phoneNumber,
          name: this.dataActive.firstName + " " + this.dataActive.lastName,
          email: this.dataActive.emailAddress,
          statu: false
        }
      }).subscribe(res =>{
        if (res.sendMessage) {
          this.toastr.success('Merci de nous avoir contacté')
          this.router.navigate(['/'])
        }
      })
    }
    
  }

}
