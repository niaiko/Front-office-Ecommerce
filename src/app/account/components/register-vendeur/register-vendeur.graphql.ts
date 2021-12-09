import { gql } from 'apollo-angular';

export const CREATE_MAGASIN = gql`
    mutation creerMagasin($input: CreateChannelInput2!){
        creerMagasin(input: $input)
        }
`

export const ASSIGN_ROLE_BASE = gql`
mutation assigeRoleBase($channelId: ID!) {
    assignerRoleBase(channelId: $channelId)
  }
`

export const CREATE_ROLE_VENDEUR = gql`
mutation createRoleVendeur($input: CreateRoleVendeurInput!) {
    createRoleVendeur(input: $input)
  }
`
export const CREATE_VENDEUR = gql`
mutation createVendeur($input: CreateVendeurInput!){
    createVendeur(input: $input)
    }
`