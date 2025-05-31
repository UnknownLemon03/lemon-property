import { createClient, RedisClientType } from "redis";
import crypto from "crypto";
let client: RedisClientType;
import { FilterProperties } from "../util/types";

export async function ConnectRedis() {
  client = createClient({
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    socket: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
    },
  });

  client.on("error", (err) => console.log("Redis Client Error", err));

  await client.connect();
  console.log("Redis connected");
}

export async function getCatch(key: string): Promise<string | null> {
  if (!client.isOpen) {
    await ConnectRedis();
  }
  const value = await client.get(key);
  console.log(`Cache hit for key: ${key}`);
  return value;
}
export async function setCatch(
  key: string,
  value: string,
  duration_min: number = 10
): Promise<void> {
  console.log(`Setting cache for key: ${key}`);
  await client.set(key, value, { EX: duration_min * 60 });
}

export function hash_property(property: FilterProperties): string {
  const normalizeValue = (value: any): any => {
    if (Array.isArray(value)) {
      return [...value].sort();
    } else if (typeof value === "object" && value !== null) {
      return Object.keys(value)
        .sort()
        .reduce((acc, key) => {
          acc[key] = normalizeValue(value[key]);
          return acc;
        }, {} as any);
    }
    return value;
  };

  const sortedObject = Object.keys(property)
    .sort()
    .reduce((acc, key) => {
      const value = (property as any)[key];
      if (value !== undefined) {
        acc[key] = normalizeValue(value);
      }
      return acc;
    }, {} as Record<string, any>);

  const jsonString = JSON.stringify(sortedObject);
  return crypto.createHash("sha256").update(jsonString).digest("hex");
}
export { client };
