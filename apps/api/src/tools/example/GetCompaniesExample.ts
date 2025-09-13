import z from 'zod';
import { Tool, ToolInvokeArgs, ToolInvokeResult } from '../Tool';

export default class GetCompaniesExample extends Tool {
  name = 'Get Companies Example';
  description = 'Get a list of companies.';
  schema = z
    .object({
      limit: z
        .number()
        .min(1)
        .max(100)
        .optional()
        .default(10)
        .describe('Number of companies to return'),
      query: z.string().optional().describe('Search query to filter companies by name'),
    })
    .describe('Parameters for getting companies');

  async execute(args: ToolInvokeArgs): Promise<ToolInvokeResult> {
    const { limit, query } = this.schema.parse(args);

    console.log(`Fetching up to ${limit} companies${query ? ` matching "${query}"` : ''}...`);
    // MOCK DATA
    return [
      { id: 1, name: 'Company A' },
      { id: 2, name: 'Company B' },
      { id: 3, name: 'Company C' },
    ];
  }
}
