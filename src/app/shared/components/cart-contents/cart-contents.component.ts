import { GET_ACTIVE_ORDER } from './../../../core/components/cart-drawer/cart-drawer.graphql';
import { Observable } from 'rxjs';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Cart, CartFragment, GetActiveOrder } from '../../../common/generated-types';
import { DataService } from 'src/app/core/providers/data/data.service';
import { GET_ACTIVE_CHANNEL } from '../../pipes/get-active-channel.graphql';
import { TAX_CHANNEL } from 'src/app/core/components/product-detail/product-detail.graphql';

@Component({
    selector: 'vsf-cart-contents',
    templateUrl: './cart-contents.component.html',
    styleUrls: ['./cart-contents.component.scss'],
    // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartContentsComponent implements OnInit {
    @Input() cart: GetActiveOrder.ActiveOrder;
    @Input() canAdjustQuantities = false;
    @Output() setQuantity = new EventEmitter<{ itemId: string; quantity: number; }>();
    option: any[] = []
    taxe: any;
    cc: any[] = []

    constructor(private dataService: DataService) {}

    ngOnInit(){
        this.dataService.query<any, any>(GET_ACTIVE_CHANNEL).subscribe(res =>{
            if (res) {
                this.dataService.query<any, any>(TAX_CHANNEL, {id: res.activeChannel.id}).subscribe(tax =>{
                    
                    this.taxe = parseFloat(tax.getTaxRestaurant.tax)
                })
            }
        })
    }
    increment(item: Cart.Lines) {
        this.setQuantity.emit({ itemId: item.id, quantity: item.quantity + 1 });
    }

    decrement(item: Cart.Lines) {
        this.setQuantity.emit({ itemId: item.id, quantity: item.quantity - 1 });
    }

    trackByFn(index: number, line: { id: string; }) {
        return line.id;
    }

    trackByDiscount(index: number, discount: Cart.Discounts) {
        return discount.adjustmentSource;
    }

    isDiscounted(line: CartFragment['lines'][number]): boolean {
        return line.discountedLinePriceWithTax < line.linePriceWithTax;
    }

    /**
     * Filters out the Promotion adjustments for an OrderLine and aggregates the discount.
     */
    getLinePromotions(adjustments: Cart.Discounts[]) {
        const groupedPromotions = adjustments.filter(a => a.type === 'PROMOTION')
            .reduce((groups, promotion) => {
                if (!groups[promotion.description]) {
                    groups[promotion.description] = promotion.amount;
                } else {
                    groups[promotion.description] += promotion.amount;
                }
                return groups;
            }, {} as { [description: string]: number; });
        return Object.entries(groupedPromotions).map(([key, value]) => ({ description: key, amount: value }));
    }

    f(i: any){
        console.log(JSON.parse(i))
        // const d = i.composants
        // for (let i = 0; i < d.length; i++) {
        //     this.cc.push({name: d[i].name, prix: d[i].prix})
        // }
    }
}
