import {gql} from 'apollo-angular';


import { ASSET_FRAGMENT, CART_FRAGMENT, ERROR_RESULT_FRAGMENT } from '../../../common/graphql/fragments.graphql';

export const GET_PRODUCT_DETAIL = gql`
    query GetProductDetail($slug: String!) {
        product(slug: $slug) {
            id
            name
            description
            customFields {
                option
                allergenes
              }
            variants {
                id
                name
                options {
                    code
                    name
                }
                price
                priceWithTax
                sku
            }
            featuredAsset {
                ...Asset
            }
            assets {
                ...Asset
            }
            collections {
                id
                slug
                breadcrumbs {
                    id
                    name
                    slug
                }
            }
        }
    }
    ${ASSET_FRAGMENT}
`;

export const ADD_TO_CART = gql`
    mutation AddToCart($variantId: ID!, $qty: Int!, $customFields: OrderLineCustomFieldsInput) {
        addItemToOrder(productVariantId: $variantId, quantity: $qty, customFields: $customFields) {
            ...Cart
            ...ErrorResult
            ...on InsufficientStockError {
                order {
                    ...Cart
                }
            }
        }
    }
    ${CART_FRAGMENT}
    ${ERROR_RESULT_FRAGMENT}
`;

export const OPTION_BY_NAME = gql`
    query findOption($name: [String!]) {
        findOptionByNames(name: $name) {
        id
            name
            qte
            obligatoire
            composants {
            id
            name
            prix
            actif
            }
        }
    }
`;

export const TAX_CHANNEL = gql`
query getTax($id: ID!) {
    getTaxRestaurant(id: $id) {
      tax
      __typename
    }
  }
`
export const SET_FAVORI = gql`
    mutation setFavourite($productId: ID!) {
        toggleFavorite(productId: $productId) {
        id
        variants {
            id
            name
            product {
            id
            name
            description
            }
        }
        }
    }  
`