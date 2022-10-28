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
