import { list } from '@keystone-6/core';
import {
  integer,
  password,
  relationship,
  text,
  timestamp,
} from '@keystone-6/core/fields';
import { Lists } from '.keystone/types';

export const lists: Lists = {
  User: list({
    fields: {
      name: text({ validation: { isRequired: true } }),
      email: text({
        validation: { isRequired: true },
        isIndexed: 'unique',
        isFilterable: true,
      }),
      password: password({ validation: { isRequired: true } }),
      applications: relationship({
        ref: 'Application.createdBy',
        many: true,
      }),
    },
    ui: {
      listView: {
        initialColumns: ['name'],
      },
    },
  }),
  Application: {
    fields: {
      referenceNumber: integer(),
      createdBy: relationship({ ref: 'User.applications' }),
      createdAt: timestamp({
        defaultValue: { kind: 'now' },
      }),
      updatedAt: timestamp(),
    },
    hooks: {
      afterOperation: async ({ context, operation }) => {
        if (operation === 'update') {
          const userId = context.session.itemId;

          await context.db.ChangeLog.createOne({
            data: {
              dataType: 'Application',
              changedBy: {
                connect: { id: userId },
              },
              changedAt: new Date().toISOString(),
            },
          });
        }
      },
    }
  },
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
};
