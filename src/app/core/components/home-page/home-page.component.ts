import { GET_ACTIVE_CHANNEL } from './../../../shared/pipes/get-active-channel.graphql';
import { ALL_CHANNEL } from './home-page.graphql';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { gql } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { DataService } from '../../providers/data/data.service';
import { GetActiveChannel } from 'src/app/common/generated-types';

@Component({
    selector: 'vsf-home-page',
    templateUrl: './home-page.component.html',
    styleUrls: ['./home-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent implements OnInit {

    collections$: Observable<any[]>;
    topSellers$: Observable<any[]>;
    topSellersLoaded$: Observable<boolean>;
    heroImage: SafeStyle;
    channels: any[] = [];
    name: any;
    readonly placeholderProducts = Array.from({ length: 12 }).map(() => null);
    constructor(private dataService: DataService, private sanitizer: DomSanitizer) { }

    ngOnInit() {
        this.collections$ = this.dataService.query(GET_COLLECTIONS, {
            options: {},
        }).pipe(
            map(data => data.collections.items
                .filter((collection: any) => collection.parent && collection.parent.name === '__root_collection__'),
            ),
        );

        this.topSellers$ = this.dataService.query(GET_TOP_SELLERS).pipe(
            map(data => data.search.items),
            shareReplay(1),
        );
        this.topSellersLoaded$ = this.topSellers$.pipe(
            map(items => 0 < items.length),
        );

        this.heroImage = this.sanitizer.bypassSecurityTrustStyle(this.getHeroImageUrl());
        this.dataService.query<any>(ALL_CHANNEL).subscribe((resp: any)=>{
            if (resp.restaurants.length > 0) {
                for (let i = 0; i < resp.restaurants.length; i++) {
                    this.channels.push({
                        id: resp.restaurants[i].token,
                        text: resp.restaurants[i].code
                    })
                }
                console.log('All channle', this.channels)
            }
        })

        this.dataService.query<GetActiveChannel.Query>(GET_ACTIVE_CHANNEL).subscribe((resp)=>{
            if (resp.activeChannel) {
                this.name = resp.activeChannel.code
            }
        })
    }

    doSelect(index: any){
        console.log('index', index)
        localStorage.setItem('vendure-token', index)
        window.location.reload()
    }

    private getHeroImageUrl(): string {
        const { apiHost, apiPort } = environment;
        return `url('${apiHost}:${apiPort}/assets/preview/40/abel-y-costa-716024-unsplash__preview.jpg')`;
    }

}

const GET_COLLECTIONS = gql`
    query GetCollections($options: CollectionListOptions) {
        collections(options: $options) {
            items {
                id
                name
                slug
                parent {
                    id
                    slug
                    name
                }
                featuredAsset {
                    id
                    preview
                }
            }
        }
    }
`;

const GET_TOP_SELLERS = gql`
    query GetTopSellers {
        search(input: {
            take: 8,
            groupByProduct: true,
            sort: {
                price: ASC
            }
        }) {
            items {
                productId
                slug
                productAsset {
                    id
                    preview
                }
                priceWithTax {
                    ... on PriceRange {
                        min
                        max
                    }
                }
                productName
            }
        }
    }
`;
