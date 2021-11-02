import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';

import { routes } from './checkout.routes';
import { CheckoutConfirmationComponent } from './components/checkout-confirmation/checkout-confirmation.component';
import { CheckoutPaymentComponent } from './components/checkout-payment/checkout-payment.component';
import { CheckoutProcessComponent } from './components/checkout-process/checkout-process.component';
import { CheckoutShippingComponent } from './components/checkout-shipping/checkout-shipping.component';
import { CheckoutSignInComponent } from './components/checkout-sign-in/checkout-sign-in.component';
import { CheckoutStageIndicatorComponent } from './components/checkout-stage-indicator/checkout-stage-indicator.component';
import { NgxStripeModule } from 'ngx-stripe';

const DECLARATIONS = [
    CheckoutConfirmationComponent,
    CheckoutPaymentComponent,
    CheckoutShippingComponent,
    CheckoutSignInComponent,
    CheckoutProcessComponent,
    CheckoutStageIndicatorComponent,
];

@NgModule({
    declarations: DECLARATIONS,
    imports: [
        SharedModule,
        RouterModule.forChild(routes),
        NgxStripeModule.forRoot('pk_live_51JAUVODVYZRZlgqTU8xpAoVhlmwnnwK3QgH60z32ooTqoX4Akn0DCAkvsWdZP9m4aS2y0S04JJQ7aybYIX4TFzWl00LrJVuJeC')
    ],
})
export class CheckoutModule {
}
