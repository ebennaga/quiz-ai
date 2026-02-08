import { encoding_for_model } from "tiktoken";

type ChunkOptions = {
  maxTokens?: number;
  overlapTokens?: number;
  model?: "text-embedding-3-small" | "gpt-4o-mini";
};

export function chunkTextTokenAware(
  text: string,
  {
    maxTokens = 500,
    overlapTokens = 50,
    model = "text-embedding-3-small",
  }: ChunkOptions = {},
): string[] {
  const encoder = encoding_for_model(model);

  const sentences = text.replace(/\s+/g, " ").split(/(?<=[.!?])\s+/);

  const chunks: string[] = [];
  let currentChunk: string[] = [];
  let currentTokens = 0;

  for (const sentence of sentences) {
    const tokenCount = encoder.encode(sentence).length;

    // Kalau 1 kalimat terlalu panjang → paksa split
    if (tokenCount > maxTokens) {
      if (currentChunk.length) {
        chunks.push(currentChunk.join(" "));
        currentChunk = [];
        currentTokens = 0;
      }

      const words = sentence.split(" ");
      let temp: string[] = [];
      let tempTokens = 0;

      for (const word of words) {
        const wordTokens = encoder.encode(word).length;
        if (tempTokens + wordTokens > maxTokens) {
          chunks.push(temp.join(" "));
          temp = [];
          tempTokens = 0;
        }
        temp.push(word);
        tempTokens += wordTokens;
      }

      if (temp.length) chunks.push(temp.join(" "));
      continue;
    }

    // Normal case
    if (currentTokens + tokenCount > maxTokens) {
      chunks.push(currentChunk.join(" "));

      // overlap
      const overlapChunk = currentChunk.join(" ");
      const overlapWords = overlapChunk.split(" ").slice(-overlapTokens);

      currentChunk = [...overlapWords, sentence];
      currentTokens =
        encoder.encode(overlapWords.join(" ")).length + tokenCount;
    } else {
      currentChunk.push(sentence);
      currentTokens += tokenCount;
    }
  }

  if (currentChunk.length) {
    chunks.push(currentChunk.join(" "));
  }

  encoder.free();
  return chunks;
}
