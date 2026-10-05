import { describe, it, expect } from "vitest";
import { validateProjectName } from "../src/cli/wizard.js";

describe("validateProjectName", () => {
  it("should format normal names into kebab-case", () => {
    const result = validateProjectName("my-server");
    expect(result.projectName).toBe("my-server");
    expect(result.jsonProjectName).toBe("my-server");
  });

  it("should handle spaces, uppercase, and special characters", () => {
    const result = validateProjectName("My Awesome Server!");
    expect(result.projectName).toBe("my-awesome-server");
  });

  it("should normalize accented characters", () => {
    const result = validateProjectName("servidor-básico");
    expect(result.projectName).toBe("servidor-basico");
  });

  it("should throw error if input is empty or whitespace", () => {
    expect(() => validateProjectName("   ")).toThrow(
      "Project name must be a non-empty string."
    );
  });

  it("should throw error if name has no alphanumeric characters", () => {
    expect(() => validateProjectName("!!!")).toThrow(
      "Invalid project name. It must contain at least one alphanumeric character."
    );
  });
});
