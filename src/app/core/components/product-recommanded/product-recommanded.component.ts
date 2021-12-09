import { PRODUIT_RECOMMANDE } from './product-recommanded.graphql';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { DataService } from '../../providers/data/data.service';


@Component({
  selector: 'vsf-product-recommanded',
  templateUrl: './product-recommanded.component.html',
  styleUrls: ['./product-recommanded.component.scss'],
//   changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductRecommandedComponent implements OnInit {
  products: any
  options1: any
  constructor(
    private dataService: DataService
  ) {
    this.options1 = {
			animation: {
				animationClass: 'transition',
				animationTime: 500,
			},
			swipe: {
				swipeable: true,
				swipeVelocity: .004,
			},
			drag: {
				draggable: true,
				dragMany: true,
			},
      arrows: true,
			infinite: true,
			autoplay: {
				enabled: true,
				direction: 'right',
				delay: 5000,
				stopOnHover: true,
				speed: 6000,
			},
			breakpoints: [
				{
					width: 768,
					number: 1,
				},
				{
					width: 991,
					number: 3,
				},
				{
					width: 9999,
					number: 4,
				},
			],
		}
  }

  ngOnInit(): void {
    this.dataService.query<any>(PRODUIT_RECOMMANDE).subscribe(res =>{
      console.log('rexomm', res)
      if (res.productRecommandeList != null) {
        this.products = res
        // for (let i = 0; i < data.length; i++) {
        //   this.products.push({
        //     title: data[i].name,
        //     regularPrice: data[i].variants[0].priceWithTax,
        //     image: data[i].featuredAsset.preview,
		// 	description: data[i].description
        //   })
        // }
      }
    })
  }

}
