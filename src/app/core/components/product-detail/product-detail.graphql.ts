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
    mutation AddToCart($variantId: ID!, $qty: Int!) {
        addItemToOrder(productVariantId: $variantId, quantity: $qty) {
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
            }
        }
    }
`;