import {gql} from 'apollo-angular';

export const PRODUIT_RECOMMANDE = gql`
    query {
        productRecommandeList {
        id
        name
        slug
        description
        variants {
            priceWithTax
        }
        featuredAsset {
            preview
        }
        }
    }  
`