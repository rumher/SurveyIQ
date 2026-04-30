declare module '@paypal/checkout-server-sdk' {
  export namespace Core {
    export class SandboxEnvironment {
      constructor(clientId: string, clientSecret: string);
    }
    export class ProductionEnvironment {
      constructor(clientId: string, clientSecret: string);
    }
  }

  export class PayPalHttpClient {
    constructor(environment: Core.SandboxEnvironment | Core.ProductionEnvironment);
    execute(request: { method: string; path: string; body?: object }): Promise<{ result: unknown }>;
  }

  const checkout: {
    Core: typeof Core;
    PayPalHttpClient: typeof PayPalHttpClient;
  };

  export default checkout;
}