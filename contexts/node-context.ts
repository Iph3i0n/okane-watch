import { AsyncLocalStorage } from "async_hooks";

export default function CreateContext<T>(default_value?: T) {
  const storage = new AsyncLocalStorage<T>();

  return {
    Provide(value: T) {
      storage.enterWith(value);
    },
    Use() {
      const value = storage.getStore();
      if (!value) return default_value;
      return value;
    },
  };
}
