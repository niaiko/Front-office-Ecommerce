import { GET_ACTIVE_CUSTOMER, GET_FAVOURITE } from './../../../common/graphql/documents.graphql';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { GetAccountOverview } from '../../../common/generated-types';
import { notNullOrUndefined } from '../../../common/utils/not-null-or-undefined';
import { DataService } from '../../../core/providers/data/data.service';
import { StateService } from '../../../core/providers/state/state.service';

import { GET_ACCOUNT_OVERVIEW } from './account-dashboard.graphql';

@Component({
    selector: 'vsf-account-dashboard',
    templateUrl: './account-dashboard.component.html',
    styleUrls: ['./account-dashboard.component.scss'],
    // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountDashboardComponent implements OnInit {
    product: any[] = [];
    activeCustomer$: Observable<GetAccountOverview.ActiveCustomer>;
    constructor(private dataService: DataService,
                private stateService: StateService,
                private router: Router) { }

    ngOnInit() {
        this.activeCustomer$ = this.dataService.query<GetAccountOverview.Query>(GET_ACCOUNT_OVERVIEW).pipe(
            map(data => data.activeCustomer),
            filter(notNullOrUndefined),
        );
        this.dataService.query<any>(GET_ACTIVE_CUSTOMER, {}, 'network-only').subscribe(act =>{
            if (act.activeCustomer != null) {
                this.dataService.query<any>(GET_FAVOURITE, {
                    customer: act.activeCustomer.id
                }).subscribe(fav =>{
                    for (let i = 0; i < fav.favorites.length; i++) {
                        this.product.push({
                            description: fav.favorites[i].variants[0].product.description,
                            productId: fav.favorites[i].variants[0].id,
                            productName: fav.favorites[i].variants[0].product.name,
                            slug: fav.favorites[i].variants[0].product.slug,
                            __typename: "Product",
                            priceWithTax: {
                                max: fav.favorites[i].variants[0].priceWithTax,
                                min: fav.favorites[i].variants[0].priceWithTax,
                                __typename: "PriceRange"
                            },
                            productAsset: {
                                focalPoint: fav.favorites[i].variants[0].product.assets[0].focalPoint,
                                id: fav.favorites[i].variants[0].product.assets[0].id,
                                preview: fav.favorites[i].variants[0].product.assets[0].preview
                            }
                        })
                    }
                    console.log("favor =", this.product)
                })
            }else{
                
            }
        })
    }
}
