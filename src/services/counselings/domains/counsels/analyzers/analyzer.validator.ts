import { FIELD_DESCRIPTIONS } from "~counselings/domains/counsels/analyzers/context-domain.registry";
import { CounselContextsProps } from "~counselings/domains/counsels/models/counsel-contexts";

interface EnumValidationConfig<T> {
  key: keyof CounselContextsProps;
  enumType: T;
}

interface IntegerValidationConfig {
  key: keyof CounselContextsProps;
  min: number;
  max: number;
}

interface BooleanValidationConfig {
  key: keyof CounselContextsProps;
}

export class AnalyzerValidator {
  static extractJsonFromContent(content: string): Record<string, unknown> {
    const start = content.indexOf("{");
    const end = content.lastIndexOf("}");
    return JSON.parse(content.slice(start, end + 1));
  }

  static validateEnumField<T>(
    json: Record<string, unknown>,
    result: Partial<CounselContextsProps>,
    config: EnumValidationConfig<T>,
  ): void {
    const { key, enumType } = config;
    const value = json[key];

    if (value === undefined) return;

    if (value === null) {
      (result as Record<string, unknown>)[key] = null;
      return;
    }

    const fieldDesc = FIELD_DESCRIPTIONS[key as string];
    if (!fieldDesc) return;

    if (typeof value === "number") {
      const validKeys = Object.keys(fieldDesc.values)
        .map(Number)
        .filter((n) => !isNaN(n));
      if (validKeys.includes(value)) {
        (result as Record<string, unknown>)[key] = value;
      }
    } else if (typeof value === "string") {
      const enumValue = (enumType as Record<string, unknown>)[value];
      if (enumValue !== undefined) {
        (result as Record<string, unknown>)[key] = enumValue;
      }
    }
  }

  static validateIntegerField(
    json: Record<string, unknown>,
    result: Partial<CounselContextsProps>,
    config: IntegerValidationConfig,
  ): void {
    const { key, min, max } = config;
    const value = json[key];

    if (value === undefined) return;

    if (value === null) {
      (result as Record<string, unknown>)[key] = null;
      return;
    }

    if (typeof value === "number" && Number.isInteger(value) && value >= min && value <= max) {
      (result as Record<string, unknown>)[key] = value;
    }
  }

  static validateBooleanField(
    json: Record<string, unknown>,
    result: Partial<CounselContextsProps>,
    config: BooleanValidationConfig,
  ): void {
    const { key } = config;
    const value = json[key];

    if (value === undefined) return;

    if (value === null || typeof value === "boolean") {
      (result as Record<string, unknown>)[key] = value;
    }
  }

  static formatFieldOptions(fieldName: string): string {
    const field = FIELD_DESCRIPTIONS[fieldName];
    if (!field) return "";

    return Object.entries(field.values)
      .map(([key, value]) => `  ${key}: ${value}`)
      .join("\n");
  }
}
