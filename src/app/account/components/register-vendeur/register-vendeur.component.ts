import { Router } from '@angular/router';
import { DataService } from './../../../core/providers/data/data.service';
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'vsf-register-vendeur',
  templateUrl: './register-vendeur.component.html',
  styleUrls: ['./register-vendeur.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterVendeurComponent implements OnInit {
  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  constructor(private dataService: DataService,
              private changeDetector: ChangeDetectorRef,
              private _formBuilder: FormBuilder,
              private router: Router) { }

  ngOnInit(): void {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required],
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required],
    });
  }

  inscrireVendeur(){
    this.router.navigate(['account/register'])
  }
}
