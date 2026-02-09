declare module 'pptx-parser' {
  const parser: {
    parse: (buffer: Buffer) => Promise<
      Array<{
        text?: string[];
        [key: string]: any;
      }>
    >;
  };

  export default parser;

  export function parse(arg0: Buffer<ArrayBuffer>) {
    throw new Error('Function not implemented.');
  }
}
