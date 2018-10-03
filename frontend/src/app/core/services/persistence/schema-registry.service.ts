import { Injectable } from "@angular/core";
import { SchemaTypeToken } from "./schemaTypeToken";
import { TopLevelSchema, AnySchema } from "./persistence-types";

@Injectable({ providedIn: 'root' })
export class SchemaRegistryService {

    private schemaMap = new Map<SchemaTypeToken<any>, AnySchema<any>>();

    fetchSchema<T>(typeToken: SchemaTypeToken<T>) {
        return this.schemaMap.get(typeToken) as AnySchema<T>;
    }

    registerSchema<T>(typeToken: SchemaTypeToken<T>, schema: AnySchema<T>) {
        this.schemaMap.set(typeToken, schema);
    }
}