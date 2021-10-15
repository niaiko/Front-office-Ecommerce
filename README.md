# Angular E-commerce

This is an e-commerce Front-office-Ecommerce application which is designed to be used with the [Vendure ecommerce framework]as a back end.

It is a progressive web application (PWA) which also uses Angular Universal for server-side rendering.

The app is built with the [Angular CLI](https://github.com/angular/angular-cli), with the data layer being handled by [Apollo Client](https://github.com/apollographql/apollo-client).

## Development

0. Clone this repo
1. Run `npm install` or `yarn` in the root dir
2. Run `npm start` or `yarn start` to build in development mode.
3. Make sure you have a local Vendure instance running a `http://localhost:3000`.
4. Open `http://localhost:4200` to see the Front-office-Ecommerce app running.

## Code generation

This project uses [graphql-code-generator](https://www.graphql-code-generator.com/) to generate TypeScript types based on the Vendure GraphQL API. To update the types, first change the `schema` property of [codegen.yml](./codegen.yml) to point to your local Vendure server, and then run the `generate-types` npm script.

## Deployment

To deploy this Front-office-Ecommerce in a production environment, take the following steps:

1. Open the [environment.prod.ts file](./src/environments/environment.prod.ts) and change the values to match your deployed Vendure server. You also probably want to set the `baseHref` value to `'/'` rather than `'/Front-office-Ecommerce/'`.
2. Open the [angular.json file](./angular.json) and set the baseHref values to point to root:
    ```diff
      "production": {
    -    "baseHref": "/Front-office-Ecommerce/",
    -    "deployUrl": "/Front-office-Ecommerce/", 
    +    "baseHref": "/",
    +    "deployUrl": "/", 
    ```
3. You then need to build for production using the `build:ssr` npm script. This can be done either locally or on your production server, depending on your preferred workflow.
4. The built artifacts will be found in the `dist/` directory. The command to run the Front-office-Ecommerce as a server-rendered app is `node dist/server/main.js`. This will start a node server running on port 4000. You should configure your webserver to pass requests arriving on port 80 to `localhost:4000`.


## License

MIT


