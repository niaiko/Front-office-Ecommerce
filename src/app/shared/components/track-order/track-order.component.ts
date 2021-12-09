import { GET_ACTIVE_CUSTOMER } from './../../../common/graphql/documents.graphql';
import { ToastrService } from 'ngx-toastr';
import { GET_ORDER_BY_CODE } from './../../../checkout/components/checkout-confirmation/checkout-confirmation.graphql';
import { Router } from '@angular/router';
import { DataService } from 'src/app/core/providers/data/data.service';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { GetOrderByCode } from 'src/app/common/generated-types';

@Component({
  selector: 'vsf-track-order',
  templateUrl: './track-order.component.html',
  styleUrls: ['./track-order.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TrackOrderComponent implements OnInit {
  code: string;
  showError: boolean = false;
  constructor(private dataService: DataService,
               private router: Router,
               private toastr: ToastrService ) { }

  ngOnInit(): void {
    this.dataService.query<any>(GET_ACTIVE_CUSTOMER, {}, 'no-cache').subscribe(res =>{
      if (res.activeCustomer !== null) {
        this.toastr.show('Veuillez saisir votre numero de commande')
      } else {
        this.router.navigate(['account/sign-in'])
        this.toastr.info('Veuillez vous connectez')
      }
    })
  }

  search(){
    if (this.code) {
      this.dataService.query<GetOrderByCode.Query, GetOrderByCode.Variables>(GET_ORDER_BY_CODE, {
      code: this.code
    }).subscribe((resp: any) =>{
      if (resp.orderByCode) {
        this.router.navigate(['account/orders/'+resp.orderByCode.code])
      } else {
        this.showError = true;
        this.toastr.warning('Veuillez saisir un numero de commande correcte')
      }
    })
    } else {
      this.toastr.info('Veuillez saisir votre numero de commande')
    }
  }

}

