# Keystone example - Custom GraphQL resolvers

## Getting started

With npm:

```cmd
npm install && npm run dev
```

With yarn:

```cmd
yarn install && yarn dev
```

The API and Admin UI will be running on port 3000.

## Overview

This example demonstrates how to build a custom GraphQL resolver/schema.

There is a [custom-schema.ts](./custom-schema.ts) that extends the Keystone generated GraphQL schema. This is then imported into the [keystone config file](./keystone.ts).

Notice that the custom mutation name has to be unique, e.g `updateApplicationCustom` instead of `updateApplication`.

If a query or mutation in a custom schema has the same name as a pre-built query/mutation, it will never be called. It has to have a unique name.

With this custom query/mutation in place, it can then be called via the API (localhost:3000/api/graphql). It cannot be called via the admin UI.

Custom schema example:

```js
import { graphQLSchemaExtension } from '@keystone-6/core';
import { Context } from '.keystone/types';

export const extendGraphqlSchema = graphQLSchemaExtension<Context>({
  typeDefs: `
    type Mutation {
      """ update an application """
      updateApplicationCustom(
        where: ApplicationWhereUniqueInput!
        data: ApplicationUpdateInput!
      ): Application
    }
  `,
  resolvers: {
    Mutation: {
      updateApplicationCustom: async (
        root,
        { where: { id }, data: { referenceNumber } },
        context
      ) => {
        try {
          // manually update the database via context API.
          const response = await context.db.Application.updateOne({
            where: { id },
            data: { referenceNumber },
          });

          // Here, we could for example call another API, e.g an email service.

          return response;
        } catch (updateError: any) {
          throw updateError;
        }
      },
    },
  },
});
```

Keystone config example importing the custom schema:

```js
import { config } from '@keystone-6/core';
import { lists } from './schema';
import { session } from './auth';
import { extendGraphqlSchema } from './custom-schema';

export default (
  config({
    db: {
      provider: 'sqlite',
      url: 'file:./keystone.db',
    },
    lists,
    session,
    extendGraphqlSchema,
  })
);
```
