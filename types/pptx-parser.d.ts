declare module 'pptx-parser' {
  export function parse(buffer: Buffer): Promise<
    Array<{
      text?: string[];
      [key: string]: any;
    }>
  >;
}
