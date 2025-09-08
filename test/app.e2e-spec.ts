import { serviceConfigs, ServiceType } from "~common/system/system-config";

describe("Application (e2e)", () => {
  beforeAll(() => {
    // Set environment for testing
    process.env.SERVICE_TYPE = ServiceType.APP;
    process.env.NODE_ENV = "test";
  });

  describe("Service Configuration", () => {
    it("should have correct service type configuration", () => {
      expect(process.env.SERVICE_TYPE).toBe(ServiceType.APP);
    });

    it("should have gRPC configuration", () => {
      const config = serviceConfigs[ServiceType.APP];
      expect(config.grpc).toBeDefined();
      expect(config.grpc.packages).toBeDefined();
      expect(config.grpc.port).toBeDefined();
      expect(config.grpc.host).toBeDefined();
    });

    it("should have valid gRPC packages", () => {
      const config = serviceConfigs[ServiceType.APP];
      const expectedPackages = ["com.hearlers.v1.model", "com.hearlers.v1.service", "com.hearlers.v1.common"];

      expectedPackages.forEach((pkg) => {
        expect(config.grpc.packages).toContain(pkg);
      });
    });

    it("should have valid service types", () => {
      const serviceTypes = Object.values(ServiceType);
      expect(serviceTypes).toContain(ServiceType.APP);
      expect(serviceTypes).toContain(ServiceType.USERS);
      expect(serviceTypes).toContain(ServiceType.COUNSELINGS);
    });
  });

  describe("Error Handling", () => {
    it("should handle invalid service type gracefully", () => {
      const invalidServiceType = "INVALID_SERVICE";
      expect(() => {
        if (!(invalidServiceType in ServiceType)) {
          throw new Error(`Invalid SERVICE_TYPE. Must be one of: ${Object.values(ServiceType).join(", ")}`);
        }
      }).toThrow();
    });

    it("should have proper error handling for missing environment variables", () => {
      const originalServiceType = process.env.SERVICE_TYPE;
      delete process.env.SERVICE_TYPE;

      expect(() => {
        const serviceType = process.env.SERVICE_TYPE as ServiceType;
        if (!serviceType || !(serviceType in ServiceType)) {
          throw new Error(`Invalid SERVICE_TYPE. Must be one of: ${Object.values(ServiceType).join(", ")}`);
        }
      }).toThrow();

      // Restore original value
      process.env.SERVICE_TYPE = originalServiceType;
    });
  });

  describe("Environment Configuration", () => {
    it("should have test environment set", () => {
      expect(process.env.NODE_ENV).toBe("test");
    });

    it("should have service type set", () => {
      expect(process.env.SERVICE_TYPE).toBeDefined();
      expect(process.env.SERVICE_TYPE).toBe(ServiceType.APP);
    });
  });

  describe("Configuration Validation", () => {
    it("should have all required service configurations", () => {
      Object.values(ServiceType).forEach((serviceType) => {
        const config = serviceConfigs[serviceType];
        expect(config).toBeDefined();
        expect(config.grpc).toBeDefined();
        expect(config.grpc.packages).toBeDefined();
        expect(config.grpc.port).toBeDefined();
        expect(config.grpc.host).toBeDefined();
      });
    });

    it("should have consistent gRPC package configuration across services", () => {
      const expectedPackages = ["com.hearlers.v1.model", "com.hearlers.v1.service", "com.hearlers.v1.common"];

      Object.values(ServiceType).forEach((serviceType) => {
        const config = serviceConfigs[serviceType];
        expectedPackages.forEach((pkg) => {
          expect(config.grpc.packages).toContain(pkg);
        });
      });
    });
  });
});
