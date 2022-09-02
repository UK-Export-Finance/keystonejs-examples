# Keystone example - Application and User relationship

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

This example has a simple [keystone config](./keystone.ts) with a User table and an Application table, linked via a [relationship](https://keystonejs.com/docs/guides/relationships#understanding-relationships).

This is how it's setup:

```js
export const lists = {
  User: list({
    fields: {
      applications: relationship({
        ref: 'Application.createdBy',
        many: true,
      }),
    },
  }),
  Application: {
    fields: {
      createdBy: relationship({ ref: 'User.applications' }),
    },
  },
};
```

With this config, Users and their Applications are automatically linked.
