import mammoth from 'mammoth';

export async function extractText(
  file: File,
  buffer: ArrayBuffer,
): Promise<string> {
  switch (file.type) {
    case 'application/pdf': {
      const { extractText } = await import('unpdf');
      const result = await extractText(new Uint8Array(buffer), {
        mergePages: true,
      });
      return result.text;
    }

    case 'application/msword':
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': {
      const result = await mammoth.extractRawText({
        arrayBuffer: buffer,
      });
      return result.value;
    }

    case 'application/vnd.ms-powerpoint':
    case 'application/vnd.openxmlformats-officedocument.presentationml.presentation': {
      const pptx = await import('pptx-parser');
      const slides = await pptx.parse(Buffer.from(buffer));
      return slides.flatMap((s: any) => s.text || []).join('\n');
    }

    case 'text/plain': {
      return Buffer.from(buffer).toString('utf-8');
    }

    default:
      throw new Error('Format file tidak didukung');
  }
}
