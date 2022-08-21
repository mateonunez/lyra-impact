export type ResolveSchemaOptions = {
  attribute?: string;
}

export function resolveSchema (schema: any, data: any, options?: ResolveSchemaOptions): any {
  let dataNormalized = data;

  if (options && options.attribute && data[options.attribute]) {
    dataNormalized = data[options.attribute];
  }

  if (!dataNormalized) {
    return schema;
  }

  if (Array.isArray(dataNormalized)) {
    resolveSchema(schema, dataNormalized[0], options);
  } else {
    for (const key in dataNormalized) {
      const type = typeof dataNormalized[key];
  
      if(Array.isArray(dataNormalized[key])) {
        schema[key] = resolveSchema({}, dataNormalized[key], options);
      } else if (type === "object") {
        schema[key] = resolveSchema(schema[key] || {}, dataNormalized[key], options);
      } else if (type === "string") {
        schema[key] = "string";
      } else if (type === "number") {
        schema[key] = "number";
      } else if (type === "boolean") {
        schema[key] = "boolean";
      } else {
        throw new Error(`Unsupported type: ${type}`);
      }
    }
  }

  return schema;
}
