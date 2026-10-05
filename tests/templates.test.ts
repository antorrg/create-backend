import { describe, it, expect } from "vitest";
import { expressMd } from "../src/templates/readme/templates/frameworks/express.md.js";
import { fastifyMd } from "../src/templates/readme/templates/frameworks/fastify.md.js";
import type { ProjectConfig } from "../src/types.js";

describe("README Template Generators", () => {
  const mockOptions: ProjectConfig = {
    projectType: "webServer",
    projectName: "test-api",
    jsonProjectName: "test-api",
    sourceFolderName: "src",
    targetDir: "/tmp",
    selectedServer: "express",
    selectedOrm: "prisma",
    selectedAuth: "auth-session",
    swaggerOption: false,
  };

  it("should generate a valid Express README without undefined or placeholders", () => {
    const readme = expressMd(mockOptions);
    expect(readme).toContain("# Api `test-api` (Express + Prisma REST API)");
    expect(readme).toContain("Main API Endpoints");
    expect(readme).not.toContain("undefined");
  });

  it("should generate a valid Express README without without wrong names", () => {
    const readme = expressMd(mockOptions);
    expect(readme).toContain("# Api `test-api` (Express + Prisma REST API)");
    expect(readme).toContain("Main API Endpoints");
    expect(readme).not.toContain("undefined");
    expect(readme).not.toContain("sequelize");
    expect(readme).not.toContain("fastify");
  });

  it("should generate a valid Fastify README without undefined or placeholders", () => {
    const fastifyOptions: ProjectConfig = {
      ...mockOptions,
      selectedServer: "fastify",
    };
    const readme = fastifyMd(fastifyOptions);
    expect(readme).toContain("# Api `test-api` (Fastify + Prisma REST API)");
    expect(readme).toContain("Main API Endpoints");
    expect(readme).not.toContain("undefined");
  });
    it("should generate a valid Fastify README without wrong names", () => {
    const fastifyOptions: ProjectConfig = {
      ...mockOptions,
      selectedServer: "fastify",
    };
    const readme = fastifyMd(fastifyOptions);
    expect(readme).toContain("# Api `test-api` (Fastify + Prisma REST API)");
    expect(readme).toContain("Main API Endpoints");
    expect(readme).not.toContain("undefined");
    expect(readme).not.toContain("sequelize");
    expect(readme).not.toContain("express");
  });
});
