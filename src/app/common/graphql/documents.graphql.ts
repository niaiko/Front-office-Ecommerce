import {gql} from 'apollo-angular';


import { ADDRESS_FRAGMENT, ASSET_FRAGMENT, COUNTRY_FRAGMENT } from './fragments.graphql';

export const GET_CUSTOMER_ADDRESSES = gql`
    query GetCustomerAddresses {
        activeCustomer {
            id
            addresses {
                ...Address
            }
        }
    }
    ${ADDRESS_FRAGMENT}
`;

export const GET_AVAILABLE_COUNTRIES = gql`
    query GetAvailableCountries {
        availableCountries {
            ...Country
        }
    }
    ${COUNTRY_FRAGMENT}
`;

export const GET_ACTIVE_CUSTOMER = gql`
    query GetActiveCustomer {
        activeCustomer {
            id
            firstName
            lastName
            emailAddress
            phoneNumber
            customFields {
                avatar
            }
        }
    }
`;
export const GET_COLLECTIONS = gql`
    query GetCollections($options: CollectionListOptions) {
        collections(options: $options) {
            items {
                id
                name
                slug
                parent {
                    id
                    name
                    slug
                }
                featuredAsset {
                    ...Asset
                }
            }
        }
    }
    ${ASSET_FRAGMENT}
`;


export const GET_MENU_PARENT = gql`
query {
    menus
  }
`;

export const GET_COLLECTION_PARENT = gql`
query collectionByParent($id: ID!) {
    collectionByParrent(id: $id)
  }
`;

export const GET_PRODUIT_MENU = gql`
  query productMenu($id: ID!) {
    productMenu(id: $id) {
      enabled
      id
      name
      description
      customFields{productRecommendationsEnabled, option, allergenes}
      assets {
        source
      }
      variants {
        id
        priceWithTax
        price
        currencyCode
      }
    }
  }
`;
