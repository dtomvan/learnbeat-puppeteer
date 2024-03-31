import { z } from "zod";

export const wordValidator = z.tuple([z.string().min(1), z.string().min(1)])
    .transform(([term, definition]) => ({ term, definition }));

export const wordsValidator = z.array(wordValidator);

export type Word = z.infer<typeof wordValidator>;

export async function validatePairs(pairs: unknown[][]): Promise<Word[]> {
    const input = pairs.filter(p => typeof p !== "undefined" && p != null);
    return await wordsValidator.parseAsync(input);
}
