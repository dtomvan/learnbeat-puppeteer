import { z } from "zod";
import { readFile } from "fs/promises";

export const configValidator = z.object({
    schoolName: z.string().min(2),
    username: z.string().min(1),
    password: z.string(),
    shouldCheckHeadless: z.boolean().optional().default(false),
    failChance: z.number().min(0).max(1).optional().default(0.4)
});

export type Config = z.infer<typeof configValidator>

export async function getConfig(fileName = "config.json"): Promise<Config> {
    const text = await readFile(fileName, { encoding: "utf-8" });
    const object = JSON.parse(text);
    return await configValidator.parseAsync(object);
}