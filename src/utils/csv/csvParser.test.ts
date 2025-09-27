/**
 * Example tests for CSV parsing utilities
 * These demonstrate how the extracted utilities can be tested in isolation
 */

import { describe, it, expect } from "vitest";
import {
  parseDelimited,
  reconstructCSV,
  extractColumn,
  findColumnIndices,
  transformColumns,
} from "./csvParser";

describe("CSV Parser", () => {
  const sampleCSV = "name\tage\tcity\nJohn\t30\tNew York\nJane\t25\tBoston";

  describe("parseDelimited", () => {
    it("should parse tab-delimited content with header", () => {
      const result = parseDelimited(sampleCSV, { delimiter: "\t", hasHeader: true });

      expect(result.headers).toEqual(["name", "age", "city"]);
      expect(result.rows).toEqual([
        ["John", "30", "New York"],
        ["Jane", "25", "Boston"],
      ]);
    });

    it("should parse comma-delimited content", () => {
      const csvContent = "name,age,city\nJohn,30,New York\nJane,25,Boston";
      const result = parseDelimited(csvContent, { delimiter: ",", hasHeader: true });

      expect(result.headers).toEqual(["name", "age", "city"]);
      expect(result.rows).toEqual([
        ["John", "30", "New York"],
        ["Jane", "25", "Boston"],
      ]);
    });

    it("should handle empty content", () => {
      const result = parseDelimited("", { delimiter: "\t", hasHeader: true });
      expect(result.headers).toEqual([]);
      expect(result.rows).toEqual([]);
    });
  });

  describe("reconstructCSV", () => {
    it("should reconstruct CSV from headers and rows", () => {
      const headers = ["name", "age", "city"];
      const rows = [
        ["John", "30", "New York"],
        ["Jane", "25", "Boston"],
      ];

      const result = reconstructCSV(headers, rows, "\t");
      expect(result).toBe(sampleCSV);
    });
  });

  describe("extractColumn", () => {
    it("should extract a specific column by name", () => {
      const parsed = parseDelimited(sampleCSV, { delimiter: "\t", hasHeader: true });
      const ages = extractColumn(parsed, "age");

      expect(ages).toEqual(["30", "25"]);
    });

    it("should throw error for non-existent column", () => {
      const parsed = parseDelimited(sampleCSV, { delimiter: "\t", hasHeader: true });

      expect(() => extractColumn(parsed, "nonexistent")).toThrow('Column "nonexistent" not found');
    });
  });

  describe("findColumnIndices", () => {
    it("should find columns matching predicate", () => {
      const headers = ["name", "age_years", "city", "age_months"];
      const indices = findColumnIndices(headers, (header) => header.includes("age"));

      expect(indices).toEqual([1, 3]);
    });
  });

  describe("transformColumns", () => {
    it("should transform specific columns", () => {
      const parsed = parseDelimited(sampleCSV, { delimiter: "\t", hasHeader: true });
      const transformations = new Map();

      // Transform age column (index 1) to add "years old"
      transformations.set(1, (value: string) => `${value} years old`);

      const result = transformColumns(parsed, transformations);

      expect(result.rows).toEqual([
        ["John", "30 years old", "New York"],
        ["Jane", "25 years old", "Boston"],
      ]);
    });
  });
});