import { GET_ACTIVE_CUSTOMER } from './../../../common/graphql/documents.graphql';
import { UPDATE_CUSTOMER_DETAILS } from './../../../account/components/account-customer-details/account-customer-details.graphql';
import { GET_ACTIVE_ORDER } from './../../../core/components/cart-drawer/cart-drawer.graphql';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AddPayment, GetActiveCustomer, GetActiveOrder, GetEligiblePaymentMethods } from '../../../common/generated-types';
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
    activeOrder: any;
    name: any;
    @ViewChild(StripeCardComponent) card: StripeCardComponent;
    cardOptions: StripeCardElementOptions = {
        style: {
          base: {
            iconColor: '#666EE8',
            color: '#31325F',
            fontWeight: '300',
            fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
            fontSize: '18px',
            '::placeholder': {
              color: '#CFD7E0'
            }
          }
        }
      };
      elementsOptions: StripeElementsOptions = {
        locale: 'fr'
      };

    constructor(private dataService: DataService,
        private stateService: StateService,
        private router: Router,
        private route: ActivatedRoute,
        private stripeService: StripeService) { }

    ngOnInit() {
        this.paymentMethods$ = this.dataService.query<GetEligiblePaymentMethods.Query>(GET_ELIGIBLE_PAYMENT_METHODS)
            .pipe(map(res => res.eligiblePaymentMethods));
        this.dataService.query<GetActiveOrder.Query, GetActiveOrder.Variables>(GET_ACTIVE_ORDER, {}, 'network-only')
        .subscribe(res =>{
            this.activeOrder = res.activeOrder
            console.log('active order => ', this.activeOrder)
        })
        this.dataService.query<GetActiveCustomer.Query>(GET_ACTIVE_CUSTOMER, {}, 'network-only').subscribe(res =>{
            console.log('active custommmer =>', res.activeCustomer)
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
       let order = []
       for (let i = 0; i < this.activeOrder.lines.length; i++) {
           order.push({
               id: this.activeOrder.lines[i].id,
               amount: this.activeOrder.totalWithTax,
               code: this.activeOrder.code
           })
       }
      }

      updateCustomer(){
          this.dataService.mutate<any, any>(UPDATE_CUSTOMER_DETAILS)
      }
    
      createToken(): void {
        this.stripeService
          .createToken(this.card.element, { name: this.name })
          .subscribe((result) => {
            if (result.token) {
              // Use the token
              console.log(result);
            } else if (result.error) {
              // Error creating the token
              console.log(result.error.message);
            }
          });
      }
}
