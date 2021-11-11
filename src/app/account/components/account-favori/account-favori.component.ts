import { GET_ACTIVE_CUSTOMER, GET_FAVOURITE } from './../../../common/graphql/documents.graphql';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { DataService } from '../../../core/providers/data/data.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'vsf-account-favori',
  templateUrl: './account-favori.component.html',
  styleUrls: ['./account-favori.component.scss'],
//   changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountFavoriComponent implements OnInit {
  product: Observable<any>;
  data: any;
  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.dataService.query<any>(GET_ACTIVE_CUSTOMER, {}, 'network-only').subscribe(act =>{
        this.product = this.dataService.query<any>(GET_FAVOURITE,{customer: act.activeCustomer.id})
        .pipe(
            map(data => data),
        );
        this.product.subscribe(res =>{
                  console.log('resss', res)
                  this.data = res
        })
  })
  }

  f(i: any){
      console.log("rrrrrrr", i)
  }

}
