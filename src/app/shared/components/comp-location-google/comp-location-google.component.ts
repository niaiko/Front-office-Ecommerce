import { Component, OnInit, ChangeDetectionStrategy, Input, EventEmitter, Output, ViewChild } from '@angular/core';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';

@Component({
  selector: 'vsf-comp-location-google',
  templateUrl: './comp-location-google.component.html',
  styleUrls: ['./comp-location-google.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompLocationGoogleComponent implements OnInit {
  @Input() adressType: string;
  @Output() setAddress: EventEmitter<any> = new EventEmitter();
  //@ViewChild('addresstext') addresstext: any;
  @ViewChild("placesRef") placesRef: GooglePlaceDirective;
  /** 
   * Variable
   */
  public autocompleteInput: string;
  public queryWait: boolean;
  public options: any;
  public address: any;
  public inputAdress = "Saisissez votre adresse"
  constructor() { }

  ngOnInit(): void {
    this.options = {
      componentRestrictions: { country: 'FR' },
      types: [] 
    };
  }

  public invokeEvent(place: Object) {
    this.setAddress.emit(place);
  }

   /**
   * Function of treatment intervention address
   * @param address 
   */
    public handleAddressChange(address: any) {
      this.address = address;
      this.invokeEvent(this.address);
    }

}
