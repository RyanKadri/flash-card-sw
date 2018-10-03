import { FetchGraph, AnySchema, PersistenceSchema, TopLevelSchema, FieldDefinition, FieldLink } from "./persistence/persistence-types";
import { SchemaRegistryService } from "./persistence/schema-registry.service";
import { SchemaTypeToken } from "./persistence/schemaTypeToken";

export function join
    <B extends{[k in BK]: string[]}, J, BK extends keyof B, P extends string>
    (toJoin: B[], joinMap: {[key: string] : J}, baseKey: BK, projectTo: P)
   : (B & { [ projectTo in P ]: J[] })[];

export function join
   <B extends{[k in BK]: string[]}, J, BK extends keyof B, P extends string>
   (toJoin: B, joinMap: {[key: string] : J}, baseKey: BK, projectTo: P)
  : (B & { [ projectTo in P ]: J[] });

export function join
  <B extends{[k in BK]: string}, J, BK extends keyof B, P extends string>
  (toJoin: B[], joinMap: {[key: string] : J}, baseKey: BK, projectTo: P)
 : (B & { [ projectTo in P ]: J })[];

export function join
  <B extends{[k in BK]: string}, J, BK extends keyof B, P extends string>
  (toJoin: B, joinMap: {[key: string] : J}, baseKey: BK, projectTo: P)
 : (B & { [ projectTo in P ]: J });

export function join(toJoin, joinMap, baseKey, projectTo) {
    const itemsToMatch = Array.isArray(toJoin) ? toJoin : [toJoin];
    const res = [];
    const joinToArray = Array.isArray(itemsToMatch[0][baseKey]);
    for(const toMatch of itemsToMatch) {
        let joined;
        if(joinToArray) {
            joined = toMatch[baseKey].map(key => joinMap[key])
        } else {
            joined = joinMap[toMatch[baseKey]]; 
        }
        res.push({ ...toMatch, [projectTo]: joined });
    }
    if(Array.isArray(toJoin)) {
        return res;
    } else {
        return res[0];
    }
}

export function extractTopLevelInfo<T, R>(graph: FetchGraph<T>, schema: TopLevelSchema<T>, schemaRegistry: SchemaRegistryService, extract: (schema: TopLevelSchema<any>) => R) {
    const results = new Set<R>()
    results.add(extract(schema));
    if(graph) {
        traverse(graph, schema);
    }
    function traverse(graph: FetchGraph<any>, schema: AnySchema<any>) {    
        for(const [key, subgraph] of Object.entries(graph)) {
            const fieldDef = schema.fields[key as keyof T];
            const [subSchema] = extractSchemaFromDef(fieldDef, schemaRegistry);
            
            if(subSchema.type === 'top') {
                results.add(extract(subSchema));
            }
            if(typeof subgraph !== 'boolean') {
                traverse(subgraph as any, subSchema);
            }
        }
    }
    return Array.from(results);
}

export function extractSchemaFromDef<T>(def: FieldDefinition<T, any>, schemaService: SchemaRegistryService): [AnySchema<T>, string] {
    let schemaToken: SchemaTypeToken<T>
    let reference: string;
    if(def && def instanceof SchemaTypeToken) {
        schemaToken = def
    } else {
        const link = def as FieldLink<any, any>;
        schemaToken = link.type;
        reference = link.references as string;
    }
    const subSchema = schemaService.fetchSchema(schemaToken);
    return [subSchema, reference];
}