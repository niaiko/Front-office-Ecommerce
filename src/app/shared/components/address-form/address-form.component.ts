import { RestService } from './../../../core/providers/rest/rest.service';
import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { googleapi } from 'src/environments/environment';

import { Address, Country, OrderAddress } from '../../../common/generated-types';

@Component({
    selector: 'vsf-address-form',
    templateUrl: './address-form.component.html',
    styleUrls: ['./address-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressFormComponent implements OnChanges {

    @Input() availableCountries: Country.Fragment[];
    @Input() address: OrderAddress.Fragment | Address.Fragment;

    addressForm: FormGroup;
    lat$: any;
    lng$: any;
    show: boolean = false;
    constructor(private formBuilder: FormBuilder, private rest: RestService) {
        this.addressForm = this.formBuilder.group({
            fullName: '',
            company: '',
            streetLine1: ['--'],
            streetLine2: '',
            city: ['--'],
            province: '',
            postalCode: ['0'],
            countryCode: ['Fr'],
            phoneNumber: '',
            customFields: {
                long: [''],
                lat: [''],
                pays: [''],
                fullAddress: ['']
            }
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        if ('address' in changes && this.addressForm && this.address) {
            this.addressForm.patchValue(this.address, { });
        }
        const country = this.address && this.address.country;
        if (country && this.availableCountries) {
            if (country && typeof country !== 'string') {
                this.addressForm.patchValue({
                    countryCode: country.code,
                });
            } else {
                const matchingCountry = this.availableCountries.find(c => c.name === country);
                if (matchingCountry) {
                    this.addressForm.patchValue({
                        countryCode: matchingCountry.code,
                    });
                }
            }
        }
    }

        /**
   * Function Get Address via component google place
   * @param place
   */
  public getAddress(place: any) {
    console.log('plasy',place);
    let dataAdress = {
        fullAddress: place.formatted_address,
        streetLine1: "--",
        streetLine2: "--",
        city: "--",
        province: "--",
        postalCode: "--",
        pays: "--",
        lat: null,
        long: null,
        countryCode: "FR", //par defaut pour vendure
        fullName: "Domicile",
      };
    const infoAdresses = place.address_components
    const street_number = infoAdresses.find((item : any) =>
      item.types.includes("street_number")
    );
    if (street_number !== undefined) {
      dataAdress.streetLine1 = street_number.long_name;
    }
    const route = infoAdresses.find((item: any) => item.types.includes("route"));
    if (route !== undefined) {
      dataAdress.streetLine2 = route.long_name;
    }
    const locality = infoAdresses.find((item: any) =>
      item.types.includes("locality")
    );
    if (locality !== undefined) {
      dataAdress.city = locality.long_name;
    }
    const administrative_area_level_1 = infoAdresses.find((item : any) =>
      item.types.includes("administrative_area_level_1")
    );
    if (administrative_area_level_1 !== undefined) {
      dataAdress.province = administrative_area_level_1.long_name;
    }
    const postal_code = infoAdresses.find((item : any) =>
      item.types.includes("postal_code")
    );
    if (postal_code !== undefined) {
      dataAdress.postalCode = postal_code.long_name;
    }
    const country = infoAdresses.find((item: any) => item.types.includes("country"));
    if (country !== undefined) {
      dataAdress.pays = country.long_name;
    }
    const lat = this.changeIntervLatitude(place.geometry.location.lat())
    const long = this.changeIntervLongitude(place.geometry.location.lng())
    this.lat$ = this.intervLatitude['_value']
    this.lng$ = this.intervLongitude['_value']
    this.addressForm.get(['fullName'])?.setValue(place.formatted_address);
    this.addressForm.get(['company'])?.setValue(dataAdress.fullName);
    this.addressForm.get(['streetLine1'])?.setValue(dataAdress.streetLine1);
    this.addressForm.get(['streetLine2'])?.setValue(dataAdress.streetLine2);
    this.addressForm.get(['city'])?.setValue(dataAdress.city);
    this.addressForm.get(['province'])?.setValue(dataAdress.province);
    this.addressForm.get(['postalCode'])?.setValue(dataAdress.postalCode);
    this.addressForm.get(['countryCode'])?.setValue(dataAdress.countryCode);
    this.addressForm.get(['company'])?.setValue(dataAdress.fullName);
    this.addressForm.get(['company'])?.setValue(dataAdress.fullName);
    this.addressForm.get(['company'])?.setValue(dataAdress.fullName);
    
    this.addressForm.get(['customFields', 'long'])?.setValue(this.lng$)
    this.addressForm.get(['customFields', 'lat'])?.setValue(this.lat$)
    this.addressForm.get(['customFields', 'pays'])?.setValue(dataAdress.pays)
    this.addressForm.get(['customFields', 'fullAddress'])?.setValue(dataAdress.fullAddress)
    if (place) {
        this.show = true;
    }
  }

  public changeIntervLatitude(value: number) {
    this.intervLatitude.next(value);
  }

  public changeIntervLongitude(value: number) {
    this.intervLongitude.next(value);
  }

  private intervLatitude = new BehaviorSubject<number>(0);
  currentIntervLatitude = this.intervLatitude.asObservable();

  private intervLongitude = new BehaviorSubject<number>(0);
  currentIntervLongitude = this.intervLongitude.asObservable();

  currentPosition(){
    this.show = true;
    navigator.geolocation.getCurrentPosition((position) => { 
      console.log("Got position", position.coords);
      if (position.coords) {
        this.getCountryFromGeocode(position.coords.latitude , position.coords.longitude)
      }
    });
  }

  getCountryFromGeocode(lat: number, long: number) {
    this.rest.getLocation(lat, long).then((resp) =>{
      if (resp) {
        const infoAdresses = resp.results[0].address_components
        console.log("infoAdresses", infoAdresses)
        console.log("response 0", resp.results[0])
        let dataAdress = {
          fullAddress: resp.results[0].formatted_address,
          streetLine1: "--",
          streetLine2: "--",
          city: "--",
          province: "--",
          postalCode: "--",
          pays: "--",
          countryCode: "FR", //par defaut pour vendure
          fullName: "Domicile",
        };
        const street_number = infoAdresses.find((item : any) =>
      item.types.includes("street_number")
    );
    if (street_number !== undefined) {
      dataAdress.streetLine1 = street_number.long_name;
    }
    const route = infoAdresses.find((item: any) => item.types.includes("route"));
    if (route !== undefined) {
      dataAdress.streetLine2 = route.long_name;
    }
    const locality = infoAdresses.find((item: any) =>
      item.types.includes("locality")
    );
    if (locality !== undefined) {
      dataAdress.city = locality.long_name;
    }
    const administrative_area_level_1 = infoAdresses.find((item : any) =>
      item.types.includes("administrative_area_level_1")
    );
    if (administrative_area_level_1 !== undefined) {
      dataAdress.province = administrative_area_level_1.long_name;
    }
    const postal_code = infoAdresses.find((item : any) =>
      item.types.includes("postal_code")
    );
    if (postal_code !== undefined) {
      dataAdress.postalCode = postal_code.long_name;
    }
    const country = infoAdresses.find((item: any) => item.types.includes("country"));
    if (country !== undefined) {
      dataAdress.pays = country.long_name;
    }
    const lat = this.changeIntervLatitude(resp.results[0].geometry.location.lat)
    const long = this.changeIntervLongitude(resp.results[0].geometry.location.lng)
    this.lat$ = this.intervLatitude['_value']
    this.lng$ = this.intervLongitude['_value']
    this.addressForm.get(['fullName'])?.setValue(resp.results[0].formatted_address);
    this.addressForm.get(['company'])?.setValue(dataAdress.fullName);
    this.addressForm.get(['streetLine1'])?.setValue(dataAdress.streetLine1);
    this.addressForm.get(['streetLine2'])?.setValue(dataAdress.streetLine2);
    this.addressForm.get(['city'])?.setValue(dataAdress.city);
    this.addressForm.get(['province'])?.setValue(dataAdress.province);
    this.addressForm.get(['postalCode'])?.setValue(dataAdress.postalCode);
    this.addressForm.get(['countryCode'])?.setValue(dataAdress.countryCode);
    this.addressForm.get(['company'])?.setValue(dataAdress.fullName);
    this.addressForm.get(['company'])?.setValue(dataAdress.fullName);
    this.addressForm.get(['company'])?.setValue(dataAdress.fullName);
    
    this.addressForm.get(['customFields', 'long'])?.setValue(long)
    this.addressForm.get(['customFields', 'lat'])?.setValue(lat)
    this.addressForm.get(['customFields', 'pays'])?.setValue(dataAdress.pays)
    this.addressForm.get(['customFields', 'fullAddress'])?.setValue(dataAdress.fullAddress)
    console.log("data adddd", dataAdress)
   
      }
    })
    .catch((error) =>{console.log('erreur', error)})
  }

}
