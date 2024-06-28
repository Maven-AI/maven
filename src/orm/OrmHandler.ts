import * as fs from "fs";
import * as path from "path";

export type ORMType = "prisma" | "drizzle" | "other";

interface SchemaField {
  name?: string;
  type: string;
  isRequired: boolean;
  isList: boolean;
  relation?: {
    name: string;
    fields: string[];
    references: string[];
  };
  attributes?: string;
}

interface SchemaModel {
  name: string;
  fields: SchemaField[];
}

interface SchemaEnum {
  name: string;
  values: string[];
}

interface ParsedSchema {
  databaseType: string;
  models: SchemaModel[];
  enums: SchemaEnum[];
}
export function findSchemaFile(
  startPath: string,
  fileName: string
): string | null {
  if (!fs.existsSync(startPath)) {
    return null;
  }

  const files = fs.readdirSync(startPath);
  for (const file of files) {
    const filePath = path.join(startPath, file);
    const stat = fs.lstatSync(filePath);
    if (stat.isDirectory()) {
      const result = findSchemaFile(filePath, fileName);
      if (result) {
        return result;
      }
    } else if (file === fileName) {
      return filePath;
    }
  }

  return null;
}

export function parseSchema(schemaContent: string): ParsedSchema {
  const models: SchemaModel[] = [];
  const enums: SchemaEnum[] = [];
  let databaseType = "";

  // Extract database type
  const datasourceMatch = schemaContent.match(/provider\s*=\s*"(\w+)"/);
  if (datasourceMatch) {
    databaseType = datasourceMatch[1];
  }

  // Parse models
  const modelRegex = /model\s+(\w+)\s*{([^}]*)}/g;
  const fieldRegex =
    /(\w+)\s+([\w\.]+)(\?)?(\[\])?(\s+@relation\(([^)]+)\))?(\s+@\w+(\([^)]+\))?)?/g;
  let modelMatch;

  while ((modelMatch = modelRegex.exec(schemaContent)) !== null) {
    const modelName = modelMatch[1];
    const modelBody = modelMatch[2];
    const fields: SchemaField[] = [];
    let fieldMatch;

    while ((fieldMatch = fieldRegex.exec(modelBody)) !== null) {
      const field: SchemaField = {
        name: fieldMatch[1],
        type: fieldMatch[2],
        isRequired: !fieldMatch[3],
        isList: !!fieldMatch[4],
      };

      // Parse relation if present
      if (fieldMatch[5]) {
        const relationStr = fieldMatch[6];
        const fieldsMatch = relationStr.match(/fields:\s*\[(.*?)\]/);
        const referencesMatch = relationStr.match(/references:\s*\[(.*?)\]/);

        if (fieldsMatch && referencesMatch) {
          field.relation = {
            name: "",
            fields: fieldsMatch[1].split(",").map((s) => s.trim()),
            references: referencesMatch[1].split(",").map((s) => s.trim()),
          };
        } else {
          console.warn(`Unexpected relation format for field ${field.name}`);
        }
      }

      // Parse additional attributes
      if (fieldMatch[7]) {
        field.attributes = fieldMatch[7].trim();
      }

      fields.push(field);
    }

    models.push({ name: modelName, fields });
  }

  // Parse enums (keep the existing enum parsing code)
  const enumRegex = /enum\s+(\w+)\s*{([^}]*)}/g;
  let enumMatch;

  while ((enumMatch = enumRegex.exec(schemaContent)) !== null) {
    const enumName = enumMatch[1];
    const enumValues = enumMatch[2].trim().split(/\s+/);
    enums.push({ name: enumName, values: enumValues });
  }

  return {
    databaseType,
    models,
    enums,
  };
}

export function getSchema(schemaPath: string): ParsedSchema {
  try {
    const schemaContent = fs.readFileSync(schemaPath, "utf8");
    return parseSchema(schemaContent);
  } catch (error) {
    console.error("Error reading schema:", error);
    return { databaseType: "", models: [], enums: [] };
  }
}
export async function getSchemaForORM(
  ormType: ORMType
): Promise<ParsedSchema | object> {
  switch (ormType) {
    case "prisma": {
      const schemaPath = findSchemaFile(process.cwd(), "schema.prisma");
      if (!schemaPath) {
        return { message: "Prisma schema file not found" };
      }
      const schema = getSchema(schemaPath);
      return schema.models.length > 0
        ? schema
        : { message: "Prisma schema could not be parsed" };
    }
    case "drizzle": {
      // Implement Drizzle schema parsing logic here
      return { message: "Drizzle schema parsing not implemented yet" };
    }
    default: {
      return { message: "Generic ORM schema" };
    }
  }
}
export async function connectDatabase(
  ormType: ORMType,
  connectionString: string
) {
  switch (ormType) {
    case "prisma":
      // Connect using Prisma
      break;
    case "drizzle":
      // Connect using Drizzle
      break;
    // Add other ORMs as needed
  }
}
export async function getTableData(ormType: ORMType, tableName: string) {
  // Fetch data based on ORM type and table name
}

// Usage
// (async () => {
//   const ormType: ORMType = "prisma"; // Example ORM type
//   const schema = await getSchemaForORM(ormType);
//   console.log(JSON.stringify(schema, null, 2));
// })();
