import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { GetActiveCustomer, UpdateCustomerDetails, UpdateCustomerInput } from '../../../common/generated-types';
import { GET_ACTIVE_CUSTOMER } from '../../../common/graphql/documents.graphql';
import { notNullOrUndefined } from '../../../common/utils/not-null-or-undefined';
import { DataService } from '../../../core/providers/data/data.service';

import { UPDATE_AVATAR, UPDATE_CUSTOMER_DETAILS } from './account-customer-details.graphql';

@Component({
    selector: 'vsf-account-customer-details',
    templateUrl: './account-customer-details.component.html',
    styleUrls: ['./account-customer-details.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountCustomerDetailsComponent implements OnInit {

    form: FormGroup;
    avt: any;
    fileToUpload: File | null = null;
    constructor(private dataService: DataService,
                private formBuilder: FormBuilder,
                private changeDetectorRef: ChangeDetectorRef) { }

    ngOnInit() {
        this.dataService.query<any>(GET_ACTIVE_CUSTOMER, {}, 'network-only').pipe(
            map(data => data.activeCustomer),
            filter(notNullOrUndefined),
        ).subscribe(customer => {
            this.avt = customer.customFields.avatar;
            console.log("CUSTOMER =>", customer)
            this.form = this.formBuilder.group({
                firstName: customer.firstName,
                lastName: customer.lastName,
                phoneNumber: customer.phoneNumber,
                avatar: customer?.customFields.avatar
            });
            this.changeDetectorRef.markForCheck();
        });
    }

    updateDetails() {
        const formValue = this.form.value;
        const input: UpdateCustomerInput = {
            firstName: formValue.firstName,
            lastName: formValue.lastName,
            phoneNumber: formValue.phoneNumber,
        };
        this.dataService.mutate<UpdateCustomerDetails.Mutation, UpdateCustomerDetails.Variables>(UPDATE_CUSTOMER_DETAILS, {
            input,
        }).subscribe(() => {
            this.form.markAsPristine();
        });
    }

    handleFileInput(files: any) {
        console.log(files)
        const formValue = this.form.value;
        var fd = new FormData()
        this.dataService.mutate<any, any>(UPDATE_AVATAR, {file: fd}).subscribe(res =>{
            console.log(res)
        });
        
    }

    createAssets(files: any) {
        console.log("aoooo")
        return this.dataService.mutate<any, any>(UPDATE_AVATAR, files);
    }

}
