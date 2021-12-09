import { gql } from 'apollo-angular';

export const ALL_CHANNEL = gql`
    query {
        restaurants {
        id
        code
        token
        }
    }
`