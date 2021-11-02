import { GET_ACTIVE_ORDER } from './../../../core/components/cart-drawer/cart-drawer.graphql';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AddPayment, GetActiveOrder, GetEligiblePaymentMethods } from '../../../common/generated-types';
import { DataService } from '../../../core/providers/data/data.service';
import { StateService } from '../../../core/providers/state/state.service';

import { ADD_PAYMENT, GET_ELIGIBLE_PAYMENT_METHODS } from './checkout-payment.graphql';
import { map } from 'rxjs/operators';
import { StripeService, StripeCardComponent } from 'ngx-stripe';
import {
  StripeCardElementOptions,
  StripeElementsOptions
} from '@stripe/stripe-js';


@Component({
    selector: 'vsf-checkout-payment',
    templateUrl: './checkout-payment.component.html',
    styleUrls: ['./checkout-payment.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutPaymentComponent implements OnInit {
    cardNumber: string;
    expMonth: number;
    expYear: number;
    paymentMethods$: Observable<GetEligiblePaymentMethods.EligiblePaymentMethods[]>
    paymentErrorMessage: string | undefined;


    constructor(private dataService: DataService,
        private stateService: StateService,
        private router: Router,
        private route: ActivatedRoute,) { }

    ngOnInit() {
        this.paymentMethods$ = this.dataService.query<GetEligiblePaymentMethods.Query>(GET_ELIGIBLE_PAYMENT_METHODS)
            .pipe(map(res => res.eligiblePaymentMethods));
        this.dataService.query<GetActiveOrder.Query, GetActiveOrder.Variables>(GET_ACTIVE_ORDER, {}, 'network-only')
        .subscribe(res =>{
            console.log('active order => ', res)
        })
    }

    getMonths(): number[] {
        return Array.from({ length: 12 }).map((_, i) => i + 1);
    }

    getYears(): number[] {
        const year = new Date().getFullYear();
        return Array.from({ length: 10 }).map((_, i) => year + i);
    }

    completeOrder(paymentMethodCode: string) {
        this.dataService.mutate<AddPayment.Mutation, AddPayment.Variables>(ADD_PAYMENT, {
            input: {
                method: paymentMethodCode,
                metadata: {},
            },
        })
            .subscribe(async ({ addPaymentToOrder }) => {
                switch (addPaymentToOrder?.__typename) {
                    case 'Order':
                        const order = addPaymentToOrder;
                        if (order && (order.state === 'PaymentSettled' || order.state === 'PaymentAuthorized')) {
                            await new Promise<void>(resolve => setTimeout(() => {
                                this.stateService.setState('activeOrderId', null);
                                resolve();
                            }, 500));
                            this.router.navigate(['../confirmation', order.code], { relativeTo: this.route });
                        }
                        break;
                    case 'OrderPaymentStateError':
                    case 'PaymentDeclinedError':
                    case 'PaymentFailedError':
                    case 'OrderStateTransitionError':
                        this.paymentErrorMessage = addPaymentToOrder.message;
                        break;
                }

            });
    }

    payer(): void {
       
      }
}
