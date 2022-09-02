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
          // manually update the database.
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
