import { FusionAuthClient } from "@fusionauth/typescript-client";
import invariant from "tiny-invariant";

const FUSIONAUTH_BASE_URL = process.env.FUSIONAUTH_BASE_URL!;
const FUSIONAUTH_API_KEY = process.env.FUSIONAUTH_API_KEY!;

invariant(FUSIONAUTH_BASE_URL, "FUSIONAUTH_BASE_URL is not set");
invariant(FUSIONAUTH_API_KEY, "FUSIONAUTH_API_KEY is not set");

class FusionAuthClientFactory {
  private static clients: Map<string, FusionAuthClient> = new Map<
    string,
    FusionAuthClient
  >();

  private static defaultClient = new FusionAuthClient(
    FUSIONAUTH_API_KEY,
    FUSIONAUTH_BASE_URL,
  );

  private static getDefaultClient(): FusionAuthClient {
    return FusionAuthClientFactory.defaultClient;
  }

  public static getFusionAuthClient(
    tenantId: "default" | string,
  ): FusionAuthClient {
    if (tenantId === "default") {
      return FusionAuthClientFactory.getDefaultClient();
    }

    const client = FusionAuthClientFactory.clients.get(tenantId);

    if (client) {
      return client;
    }

    const newClient = FusionAuthClientFactory.createClient(tenantId);

    FusionAuthClientFactory.clients.set(tenantId, newClient);

    return newClient;
  }

  private static createClient(tenantId: string): FusionAuthClient {
    const client = new FusionAuthClient(
      FUSIONAUTH_API_KEY,
      FUSIONAUTH_BASE_URL,
      tenantId,
    );

    return client;
  }
}

export default FusionAuthClientFactory.getFusionAuthClient;
