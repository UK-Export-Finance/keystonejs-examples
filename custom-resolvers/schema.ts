import { integer, timestamp } from '@keystone-6/core/fields';
import { Lists } from '.keystone/types';

export const lists: Lists = {
  Application: {
    fields: {
      referenceNumber: integer(),
      createdAt: timestamp({
        defaultValue: { kind: 'now' },
      }),
      updatedAt: timestamp(),
    },
  },
};
