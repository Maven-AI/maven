import * as fs from 'fs';
import * as path from 'path';

export type ORMType = 'prisma' | 'drizzle' | 'other';

interface SchemaField {
    name: string;
    type: string;
    isRequired: boolean;
    isList: boolean;
}

interface SchemaModel {
    name: string;
    fields: SchemaField[];
}

function parseSchema(schemaContent: string): SchemaModel[] {
    const models: SchemaModel[] = [];
    const modelRegex = /model\s+(\w+)\s*{([^}]*)}/g;
    const fieldRegex = /(\w+)\s+([\w\.]+)(\?)?(\[\])?/g;

    let match;
    while ((match = modelRegex.exec(schemaContent)) !== null) {
        const modelName = match[1];
        const modelBody = match[2];
        const fields: SchemaField[] = [];

        let fieldMatch;
        while ((fieldMatch = fieldRegex.exec(modelBody)) !== null) {
            fields.push({
                name: fieldMatch[1],
                type: fieldMatch[2],
                isRequired: !fieldMatch[3],
                isList: !!fieldMatch[4]
            });
        }

        models.push({ name: modelName, fields });
    }

    return models;
}

function getSchema(schemaPath: string): SchemaModel[] {
    try {
        const schemaContent = fs.readFileSync(schemaPath, 'utf8');
        return parseSchema(schemaContent);
    } catch (error) {
        console.error('Error reading schema:', error);
        return [];
    }
}

export async function getSchemaForORM(ormType: ORMType): Promise<object> {
    switch (ormType) {
        case 'prisma': {
            const schemaPath = path.join(__dirname, 'schema.prisma');
            const schema = getSchema(schemaPath);
            return schema.length > 0 ? schema : { message: 'Prisma schema could not be parsed' };
        }
        case 'drizzle': {
            const schemaPath = path.join(__dirname, 'schema.drizzle'); // Adjust path to Drizzle schema file
            const schema = getSchema(schemaPath);
            return schema.length > 0 ? schema : { message: 'Drizzle schema could not be parsed' };
        }
        default: {
            return { message: 'Generic ORM schema' };
        }
    }
}

// Usage
(async () => {
    const ormType: ORMType = 'prisma'; // Example ORM type
    const schema = await getSchemaForORM(ormType);
    console.log(JSON.stringify(schema, null, 2));
})();
