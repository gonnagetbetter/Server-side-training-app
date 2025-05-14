import * as md5 from 'md5';

// Method decorator that caches the result of the method in the cache service for the specified ttl.
// CacheService must be injected in the class constructor where decorator is used.
// The key is generated from the method name and the arguments passed to it (md5 hash of the stringified arguments)
export function ThroughCache(ttl?: number): MethodDecorator {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: unknown[]) {
      const className = target.constructor.name;
      const key = `${className}:${propertyKey}:${md5(
        JSON.stringify(args),
      ).slice(0, 8)}`;

      if (!this.cacheService) {
        throw new Error(
          'CacheService not found in context. It must be injected in the class constructor where decorator is used.',
        );
      }

      return this.cacheService.wrap(key, originalMethod.apply(this, args), ttl);
    };
  };
}
