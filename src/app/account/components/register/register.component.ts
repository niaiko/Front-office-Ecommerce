import { Router } from '@angular/router';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
// import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';

import { Register } from '../../../common/generated-types';
import { DataService } from '../../../core/providers/data/data.service';

import { REGISTER } from './register.graphql';

@Component({
    selector: 'vsf-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
    // CountryISO = CountryISO;
    // SearchCountryField = SearchCountryField;
    // PhoneNumberFormat = PhoneNumberFormat;
    firstName: string;
    lastName: string;
    emailAddress: string;
    password: string;
    phone: any;
    registrationSent = false;
    constructor(private dataService: DataService,
                private changeDetector: ChangeDetectorRef,
                private router: Router) { }

    register() {
        this.dataService.mutate<Register.Mutation, Register.Variables>(REGISTER, {
            input: {
                emailAddress: this.emailAddress,
                firstName: this.firstName,
                lastName: this.lastName,
                password: this.password,
                phoneNumber: this.phone.internationalNumber
            },
        }).subscribe(() => {
            this.registrationSent = true;
            this.changeDetector.markForCheck();
            this.router.navigate(['account/sign-in'])
        });
    }
}
