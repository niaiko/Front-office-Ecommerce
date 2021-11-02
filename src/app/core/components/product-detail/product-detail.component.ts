import { GET_ACTIVE_CHANNEL } from './../../../shared/pipes/get-active-channel.graphql';
import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatListOption } from '@angular/material/list';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map, switchMap, withLatestFrom } from 'rxjs/operators';

import { AddToCart, GetProductDetail } from '../../../common/generated-types';
import { notNullOrUndefined } from '../../../common/utils/not-null-or-undefined';
import { DataService } from '../../providers/data/data.service';
import { NotificationService } from '../../providers/notification/notification.service';
import { StateService } from '../../providers/state/state.service';

import { ADD_TO_CART, GET_PRODUCT_DETAIL, OPTION_BY_NAME, TAX_CHANNEL } from './product-detail.graphql';

@Component({
    selector: 'vsf-product-detail',
    templateUrl: './product-detail.component.html',
    styleUrls: ['./product-detail.component.scss'],
})
export class ProductDetailComponent implements OnInit, OnDestroy {

    product: GetProductDetail.Product;
    selectedAsset: { id: string; preview: string; };
    selectedVariant: GetProductDetail.Variants;
    qty = 1;
    breadcrumbs: GetProductDetail.Breadcrumbs[] | null = null;
    @ViewChild('addedToCartTemplate', { static: true })
    private addToCartTemplate: TemplateRef<any>;
    private sub: Subscription;
    option: any;
    prixOption: any[] = [];
    addPrix: boolean;
    total: any = 0;
    totalWithTax: any;
    nameOption: any[] = [];
    priceOption: any[] = [];
    taxe: any;

    constructor(private dataService: DataService,
        private stateService: StateService,
        private notificationService: NotificationService,
        private route: ActivatedRoute) {
    }

    ngOnInit() {
        const lastCollectionSlug$ = this.stateService.select(state => state.lastCollectionSlug);
        const productSlug$ = this.route.paramMap.pipe(
            map(paramMap => paramMap.get('slug')),
            filter(notNullOrUndefined),
        );

        this.sub = productSlug$.pipe(
            switchMap(slug => {
                return this.dataService.query<GetProductDetail.Query, GetProductDetail.Variables>(GET_PRODUCT_DETAIL, {
                    slug,
                },
                );
            }),
            map(data => data.product),
            filter(notNullOrUndefined),
            withLatestFrom(lastCollectionSlug$),
        ).subscribe(([product, lastCollectionSlug]) => {
            this.product = product;
            const field: any[] = product.customFields.option
            if (field) {
                this.dataService.query<any, any>(OPTION_BY_NAME, { name: field })
                    .subscribe(resp => {
                        this.option = resp.findOptionByNames;
                    })
            }
            if (this.product.featuredAsset) {
                this.selectedAsset = this.product.featuredAsset;
            }
            this.selectedVariant = product.variants[0];
            const prix: any = product.variants[0].priceWithTax + (parseFloat(this.total))
            console.log('PRIX pory =<', prix)
            this.totalWithTax = parseFloat(prix) ;
            const collection = this.getMostRelevantCollection(product.collections, lastCollectionSlug);
            this.breadcrumbs = collection ? collection.breadcrumbs : [];
        });
        this.dataService.query<any, any>(GET_ACTIVE_CHANNEL).subscribe(res =>{
            if (res) {
                this.dataService.query<any, any>(TAX_CHANNEL, {id: res.activeChannel.id}).subscribe(tax =>{
                    
                    this.taxe = parseFloat(tax.getTaxRestaurant.tax) / 100
                    console.log('tazxe>', this.taxe)
                })
            }
        })
    }

    ngOnDestroy() {
        if (this.sub) {
            this.sub.unsubscribe();
        }
    }

    addToCart(variant: GetProductDetail.Variants, qty: number) {
        console.log('name optio =>', this.nameOption)
        for (let i = 0; i < this.prixOption.length; i++) {
            // this.nameOption.push(JSON.stringify(this.prixOption[i]))
            this.nameOption.push(JSON.stringify(this.prixOption[i]))
            this.priceOption.push(this.prixOption[i].composants[0].prix)
        }
        this.dataService.mutate<AddToCart.Mutation, any>(ADD_TO_CART, {
            variantId: parseInt(variant.id),
            qty,
            customFields: {
                listSuppl: this.nameOption,
                supplement: this.priceOption
            }
        }).subscribe(({ addItemToOrder }) => {
            switch (addItemToOrder.__typename) {
                case 'Order':
                    this.stateService.setState('activeOrderId', addItemToOrder ? addItemToOrder.id : null);
                    if (variant) {
                        this.ngOnInit();
                        window.location.reload()
                        this.notificationService.notify({
                            title: 'Added to cart',
                            type: 'info',
                            duration: 3000,
                            templateRef: this.addToCartTemplate,
                            templateContext: {
                                variant,
                                quantity: qty,
                            },
                        }).subscribe();
                    }
                    break;
                case 'OrderModificationError':
                case 'OrderLimitError':
                case 'NegativeQuantityError':
                case 'InsufficientStockError':
                    this.notificationService.error(addItemToOrder.message).subscribe();
                    break;
            }

        });
    }

    viewCartFromNotification(closeFn: () => void) {
        this.stateService.setState('cartDrawerOpen', true);
        closeFn();
    }

    /**
     * If there is a collection matching the `lastCollectionId`, return that. Otherwise return the collection
     * with the longest `breadcrumbs` array, which corresponds to the most specific collection.
     */
    private getMostRelevantCollection(collections: GetProductDetail.Collections[], lastCollectionSlug: string | null) {
        const lastCollection = collections.find(c => c.slug === lastCollectionSlug);
        if (lastCollection) {
            return lastCollection;
        }
        return collections.slice().sort((a, b) => {
            if (a.breadcrumbs.length < b.breadcrumbs.length) {
                return 1;
            }
            if (a.breadcrumbs.length > b.breadcrumbs.length) {
                return -1;
            }
            return 0;
        })[0];
    }

    onCheckboxChange(sup: any, opt: any) {
        console.log('option', opt)
        this.total = 0
        if (this.addPrix == true) {
            //this.prixOption.push({ prix: parseFloat(sup.prix), id: sup.id, name: sup.name })
            this.prixOption.push(
                {
                    id: opt.id,
                    name: opt.name,
                    qte: opt.qte,
                    obligatoire: opt.obligatoire,
                    composants: [{
                        id: sup.id,
                        name: sup.name,
                        // prix: (sup.prix * 100) + (sup.prix * 100 * this.taxe)
                        prix: (sup.prix * 100)
                    }]
                }
            )
        } else {
            for (let i = this.prixOption.length - 1; i >= 0; i--) {
                if (this.prixOption[i].composants[0].id === sup.id) {
                    this.prixOption.splice(i, 1);
                }
            }
        }
        for (let i in this.prixOption) {
            this.total += this.prixOption[i].composants[0].prix;
        }
        console.group('iiii', this.prixOption)
        this.ngOnInit()
    }

    selectionChange(option: MatListOption) {
        this.addPrix = option.selected
    }

}
