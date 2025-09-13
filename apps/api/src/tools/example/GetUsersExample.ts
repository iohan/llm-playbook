import z from 'zod';
import { Tool, ToolInvokeArgs, ToolInvokeResult } from '../Tool';

export default class GetUsersExample extends Tool {
  name = 'Get Users Example';
  description = 'Get a list of users.';
  schema = z
    .object({
      limit: z
        .number()
        .min(1)
        .max(100)
        .optional()
        .default(10)
        .describe('Number of companies to return'),
      companyId: z.number().describe('Select users from company ID'),
    })
    .describe('Parameters for getting companies');

  async execute(args: ToolInvokeArgs): Promise<ToolInvokeResult> {
    const { limit, companyId } = this.schema.parse(args);

    console.log(`Fetching up to ${limit} users from company ID ${companyId}...`);

    // MOCK DATA
    return [
      { id: 1, name: 'User A', companyId },
      { id: 2, name: 'User B', companyId },
      { id: 3, name: 'User C', companyId },
    ];
  }
}
