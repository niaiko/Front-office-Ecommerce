import {gql} from 'apollo-angular';

export const SEND_MESSAGE = gql`
mutation sendMessage($input: saveMessage!) {
    sendMessage(input: $input)
  }  
`