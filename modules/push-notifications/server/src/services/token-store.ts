export interface StoredToken {
  token: string;
  platform: 'ios' | 'android' | 'web';
  environment: 'sandbox' | 'production';
  appVersion: string;
  userId?: string;
  updatedAt: Date;
}

/** In-memory store for Module Zero. Swap for PostgreSQL in production apps. */
export class TokenStore {
  private tokens = new Map<string, StoredToken>();

  upsert(record: StoredToken): void {
    this.tokens.set(record.token, record);
  }

  get(token: string): StoredToken | undefined {
    return this.tokens.get(token);
  }

  list(): StoredToken[] {
    return [...this.tokens.values()].sort(
      (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime(),
    );
  }

  remove(token: string): boolean {
    return this.tokens.delete(token);
  }
}