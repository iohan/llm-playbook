import z from 'zod';

export interface AnthropicTool {
  name: string;
  description: string;
  input_schema: Record<string, unknown>;
}

export type ToolInvokeArgs = Record<string, unknown>;
export type ToolInvokeResult = unknown;

export abstract class Tool {
  abstract className: string;
  abstract description: string;
  abstract schema: z.ZodTypeAny;

  get anthropicTool(): AnthropicTool {
    const base = this.schema ? z.toJSONSchema(this.schema) : { type: 'object' };

    const input_schema =
      base && typeof base === 'object' && base.type === 'object'
        ? { additionalProperties: false, ...base }
        : base;

    return {
      name: this.className,
      description: this.description,
      input_schema,
    };
  }

  abstract execute(args: ToolInvokeArgs): Promise<ToolInvokeResult>;
}
