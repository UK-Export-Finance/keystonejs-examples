# Keystone example - Change log

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

This example shows how a simple change log can be generated and automatically updated after certain events.

This is done by using Keystone's [Hooks API](https://keystonejs.com/docs/apis/hooks).

First, a change log table/list needs to be setup with some "changed" fields. The change log should also not be editable via the Admin UI, so we disable some things via the ui config, e.g `hideCreate`, `hideDelete`, `itemView.defaultFieldMode = 'read'`.

```js
export const lists: Lists = {
  ChangeLog: list({
    fields: {
      dataType: text(),
      changedBy: relationship({
        ref: 'User',
        many: false,
      }),
      changedAt: timestamp(),
    },
    ui: {
      label: 'Change log',
      listView: {
        initialColumns: ['dataType', 'changedBy', 'changedAt', 'id'],
        initialSort: {
          field: 'changedAt',
          direction: 'DESC',
        },
      },
      createView: {
        defaultFieldMode: 'hidden'
      },
      hideCreate: true,
      hideDelete: true,
      itemView: {
        defaultFieldMode: 'read'
      },
    },
  }),
  // ...
};
```

Now we can use the [`afterOperation`](https://keystonejs.com/docs/apis/hooks#after-operation) hook in a different table/list to create a new entry in the change log. The hook also allows us to get the user who has triggered this changed.

```js
export const lists: Lists = {
  Application: {
    fields: { ... },
    hooks: {
      // afterOperation is triggered after an Application is saved.
      afterOperation: async ({ context, operation }) => {
        // Check that the operation is 'update' and not 'create'.
        if (operation === 'update') {
          // Get the user's ID.
          const userId = context.session.itemId;

          // Create a new entry in the change log.
          await context.db.ChangeLog.createOne({
            data: {
              changedBy: {
                connect: { id: userId },
              },
              changedAt: new Date().toISOString(),
              dataType: 'Application',
            },
          });
        }
      },
    }
  },
  // ...
}
```

Note that there is a `dataType` field. This is highly recommend so that a user can quickly identify what a change log entry is. Especially helpful when you have multiple data types being pushed to the change log.
