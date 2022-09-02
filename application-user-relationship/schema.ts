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
  },
};
