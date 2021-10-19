import {gql} from 'apollo-angular';


import { ASSET_FRAGMENT } from '../../../common/graphql/fragments.graphql';

export const SEARCH_PRODUCTS = gql`
    query SearchProducts($input: SearchInput!) {
        search(input: $input) {
            items {
                productId
                slug
                productName
                description
                priceWithTax {
                    ... on PriceRange {
                        min
                        max
                    }
                }
                productAsset {
                    id
                    preview
                    focalPoint {
                        x
                        y
                    }
                }
            }
            totalItems
            facetValues {
                count
                facetValue {
                    id
                    name
                    facet {
                        id
                        name
                    }
                }
            }
        }
    }
`;

export const GET_COLLECTION = gql`
    query GetCollection($id: ID, $slug: String) {
        collection(id: $id, slug: $slug) {
            id
            name
            slug
            description
            featuredAsset {
                ...Asset
            }
            breadcrumbs {
                id
                slug
                name
            }
            children {
                id
                slug
                featuredAsset {
                    ...Asset
                }
                name
            }
        }
    }
    ${ASSET_FRAGMENT}
`;

export const GET_PRODUCT_MENU = gql`
    query GetProduct($id: ID) {
        collection(id: $id) {
            id
            name
            slug
            description
            featuredAsset {
                ...Asset
            }
        }
    }
    ${ASSET_FRAGMENT}
`;

export const GET_PRODUCT_ENABLED_BY_MENU = gql`
    query productEnabled($id: ID!){
        productMenuEnable(id: $id) {
            id
            name
            slug
            description
            variants {
                productId
                price
                priceWithTax
              }
            featuredAsset {
                id
                width
                height
                name
                preview
                focalPoint {
                x
                y
                }
            }
            }
        }
`;
