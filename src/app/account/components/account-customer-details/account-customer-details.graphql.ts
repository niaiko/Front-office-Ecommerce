import {gql} from 'apollo-angular';


export const UPDATE_CUSTOMER_DETAILS = gql`
    mutation UpdateCustomerDetails($input: UpdateCustomerInput!) {
        updateCustomer(input: $input) {
            id
            firstName
            lastName
            emailAddress
            phoneNumber
        }
    }
`;

export const UPDATE_AVATAR= gql`
    mutation avatar($file: Upload!){
        updateAvatarCustomers(input: {file: $file})
        }
`;
