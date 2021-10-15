import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, combineLatest, merge, Observable, of } from 'rxjs';
import {
    distinctUntilChanged,
    exhaustMap,
    map,
    mapTo,
    scan,
    share,
    shareReplay,
    skip,
    switchMap,
    take,
    tap,
    withLatestFrom,
} from 'rxjs/operators';

import { GetCollection, SearchProducts } from '../../../common/generated-types';
import { getRouteArrayParam } from '../../../common/utils/get-route-array-param';
import { AssetPreviewPipe } from '../../../shared/pipes/asset-preview.pipe';
import { DataService } from '../../providers/data/data.service';
import { StateService } from '../../providers/state/state.service';

import { GET_COLLECTION, GET_PRODUCT_BY_MENU, SEARCH_PRODUCTS } from './product-list.graphql';

@Component({
    selector: 'vsf-product-list',
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    })
export class ProductListComponent implements OnInit {
    products$: Observable<SearchProducts.Items[]>;
    totalResults$: Observable<number>;
    collection$: Observable<GetCollection.Collection | undefined>;
    facetValues: SearchProducts.FacetValues[] | undefined;
    unfilteredTotalItems = 0;
    activeFacetValueIds$: Observable<string[]>;
    searchTerm$: Observable<string>;
    displayLoadMore$: Observable<boolean>;
    loading$: Observable<boolean>;
    breadcrumbs$: Observable<Array<{id: string; name: string; }>>;
    mastheadBackground$: Observable<SafeStyle>;
    private currentPage = 0;
    private refresh = new BehaviorSubject<void>(undefined);
    readonly placeholderProducts = Array.from({ length: 12 }).map(() => null);
    idMenu: any;
    nbrTotal: any;
    produit: any;
    liste: any[] = [];

    constructor(private dataService: DataService,
                private route: ActivatedRoute,
                private stateService: StateService,
                private sanitizer: DomSanitizer) { }

    ngOnInit() {
        this.idMenu = this.route.snapshot.paramMap.get('id')
        console.log('ID MENU =>', this.idMenu)
        this.activeFacetValueIds$ = this.route.paramMap.pipe(
            map(pm => getRouteArrayParam(pm, 'facets')),
            distinctUntilChanged((x, y) => x.toString() === y.toString()),
            tap(() => {
                this.currentPage = 0;
            }),
            shareReplay(1),
        );
        this.dataService.query<any, any>(GET_PRODUCT_BY_MENU, {
            id: this.idMenu
        }).subscribe(resp =>{
            console.log('DATA PAR ID MENU', resp)
            const data: any[] = resp.productMenu;
            for (let i = 0; i < data.length; i++) {
                this.liste.push({
                    description: data[i].description,
                    productId: data[i].variants.productId,
                    productName: data[i].name,
                    slug: data[i].slug,
                    __typename: data[i].__typename,
                    priceWithTax: {
                        max: data[i].variants[0].priceWithTax,
                        min: data[i].variants[0].priceWithTax,
                        __typename: "PriceRange"
                    },
                    productAsset: {
                        focalPoint: data[i].featuredAsset.focalPoint,
                        id: data[i].featuredAsset.id,
                        preview: data[i].featuredAsset.preview
                    }
                })
            }
            console.log("donnee namboarina =>", this.liste)
            this.produit = resp.productMenu
            this.nbrTotal = this.liste.length
        })
        this.searchTerm$ = this.route.queryParamMap.pipe(
            map(pm => pm.get('search') || ''),
            distinctUntilChanged(),
            shareReplay(1),
        );

        const perPage = 24;
        const collectionSlug$ = this.route.paramMap.pipe(
            map(pm => pm.get('slug')),
            distinctUntilChanged(),
            tap(slug => {
                this.stateService.setState('lastCollectionSlug', slug || null);
                this.currentPage = 0;
            }),
            shareReplay(1),
        );

        this.collection$ = collectionSlug$.pipe(
            switchMap(slug => {
                if (slug) {
                    return this.dataService.query<GetCollection.Query, GetCollection.Variables>(GET_COLLECTION, {
                        slug,
                    }).pipe(
                        map(data => data.collection),
                    );
                } else {
                    return of(undefined);
                }
            }),
            shareReplay(1),
        );

        const assetPreviewPipe = new AssetPreviewPipe();

        this.mastheadBackground$ = this.collection$.pipe(
            map(c => 'url(' + assetPreviewPipe.transform(c?.featuredAsset || undefined, 1000, 300) + ')'),
            map(style => this.sanitizer.bypassSecurityTrustStyle(style)),
        );

        this.breadcrumbs$ = this.collection$.pipe(
            map(collection => {
                if (collection) {
                    return collection.breadcrumbs;
                } else {
                    return [{
                        id: '',
                        name: 'Home',
                    }, {
                        id: '',
                        name: 'Search',
                    }];
                }
            }),
        );

        const triggerFetch$ = combineLatest(this.collection$, this.activeFacetValueIds$, this.searchTerm$, this.refresh);
        const getInitialFacetValueIds = () => {
            combineLatest(this.collection$, this.searchTerm$).pipe(
                take(1),
                switchMap(([collection, term]) => {
                    return this.dataService.query<SearchProducts.Query, SearchProducts.Variables>(SEARCH_PRODUCTS, {
                        input: {
                            term,
                            groupByProduct: true,
                            collectionId: collection?.id,
                            take: perPage,
                            skip: this.currentPage * perPage,
                        },
                    });
                }),
                ).subscribe(data => {
                    this.facetValues = data.search.facetValues;
                    this.unfilteredTotalItems = data.search.totalItems;
                });
        };
        this.loading$ = merge(
            triggerFetch$.pipe(mapTo(true)),
        );
        const queryResult$ = triggerFetch$.pipe(
            switchMap(([collection, facetValueIds, term]) => {
                return this.dataService.query<SearchProducts.Query, SearchProducts.Variables>(SEARCH_PRODUCTS, {
                    input: {
                        term,
                        groupByProduct: true,
                        collectionId: collection?.id,
                        facetValueIds,
                        take: perPage,
                        skip: this.currentPage * perPage,
                    },
                }).pipe(
                    tap(data => {
                        if (facetValueIds.length === 0) {
                            this.facetValues = data.search.facetValues;
                            this.unfilteredTotalItems = data.search.totalItems;
                        } else if (!this.facetValues) {
                            getInitialFacetValueIds();
                        } else {
                            this.facetValues = this.facetValues.map(fv => fv);
                        }
                    }),
                );
            }),
            shareReplay(1),
        );

        this.loading$ = merge(
            triggerFetch$.pipe(mapTo(true)),
            queryResult$.pipe(mapTo(false)),
        );

        const RESET = 'RESET';
        const items$ = this.products$ = queryResult$.pipe(map(data => data.search.items));
        const reset$ = merge(collectionSlug$, this.activeFacetValueIds$, this.searchTerm$).pipe(
            mapTo(RESET),
            skip(1),
            share(),
        );
        this.products$ = merge(items$, reset$).pipe(
            scan<SearchProducts.Items[] | string, SearchProducts.Items[]>((acc, val) => {
                if (typeof val === 'string') {
                    return [];
                } else {
                    return acc.concat(val);
                }
            }, [] as SearchProducts.Items[]),
        );
        this.totalResults$ = queryResult$.pipe(map(data => data.search.totalItems));
        this.displayLoadMore$ = combineLatest(this.products$, this.totalResults$).pipe(
            map(([products, totalResults]) => {
                return 0 < products.length && products.length < totalResults;
            }),
        );

    }

    trackByProductId(index: number, item: SearchProducts.Items) {
        return item.productId;
    }

    loadMore() {
        this.currentPage ++;
        this.refresh.next();
    }


}
