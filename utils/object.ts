export default {
  MapKeys<T extends object, TResult extends Record<keyof T, any>>(
    subject: T,
    mapper: <TKey extends keyof T>(key: TKey, value: T[TKey]) => TResult[TKey]
  ): TResult {
    const result: any = {};
    for (const key in subject) {
      if (!subject.hasOwnProperty(key)) continue;
      result[key] = mapper(key, subject[key]);
    }

    return result;
  },
};
