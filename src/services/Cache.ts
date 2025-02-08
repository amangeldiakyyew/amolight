import Redis from "ioredis";

type CacheOptions = {
  ttl?: number; // Time-to-live in seconds
};

type ValueTypes = string | number | boolean | object | null | undefined | [];

export default class Cache {
  private static client: Redis;

  static init() {
    if (!this.client) {
      this.client = new Redis(
        process.env.REDIS_URL || "redis://localhost:6379",
        {
          reconnectOnError(err) {
            const targetError = "READONLY";
            return err.message.includes(targetError);
          },
        },
      );
    }
  }

  static async set(
    key: string,
    value: ValueTypes,
    options?: CacheOptions,
  ): Promise<boolean> {
    try {
      const ttl = options?.ttl ?? (process.env.REDIS_TTL || 3600);
      const serializedValue = JSON.stringify(value);
      await this.client.setex(key, ttl, serializedValue);
      return true;
    } catch (error) {
      //console.error(`Redis set error: ${error}`);
      return false;
    }
  }

  static async get<T>(key: string): Promise<T | null> {
    try {
      const data = await this.client.get(key);
      if (!data) return null;

      const parsedData = JSON.parse(data);
      return parsedData as T;
    } catch (error) {
      //console.error(`Redis get error: ${error}`);
      return null;
    }
  }

  static async del(key: string): Promise<boolean> {
    try {
      await this.client.del(key);
      return true;
    } catch (error) {
      //console.error(`Redis delete error: ${error}`);
      return false;
    }
  }

  static async exists(key: string): Promise<boolean> {
    try {
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      //console.error(`Redis exists check error: ${error}`);
      return false;
    }
  }

  static async flush(): Promise<boolean> {
    try {
      await this.client.flushall();
      return true;
    } catch (error) {
      //console.error(`Redis flush error: ${error}`);
      return false;
    }
  }

  static async keys(pattern = "*"): Promise<string[]> {
    try {
      return await this.client.keys(pattern);
    } catch (error) {
      //console.error(`Redis keys retrieval error: ${error}`);
      return [];
    }
  }

  static async close(): Promise<boolean> {
    try {
      await this.client.quit();
      return true;
    } catch (error) {
      //console.error(`Redis close error: ${error}`);
      return false;
    }
  }
}
