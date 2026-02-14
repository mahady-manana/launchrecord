import clsx from "clsx";

/**
 * Converts Mongoose documents to plain JavaScript objects to prevent circular reference errors
 * when serializing to JSON.
 * @param obj The object to convert (can be a single document or an array of documents)
 * @returns Plain JavaScript object(s) without circular references
 */
export function serializeMongooseDocument<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export const cn = clsx;
