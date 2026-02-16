import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { apiRoot } from "../services/commercetoolsClient";

export async function GetProductByKey(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {

  try {
    // Get key from query OR default to 73207
    const productKey = request.query.get("key") || "73207";

    context.log(`Fetching product with key: ${productKey}`);

    const response = await apiRoot
      .productProjections()
      .withKey({ key: productKey })
      .get()
      .execute();

    const product = response.body;

    // Optional transformation for frontend / OMS
    const transformed = {
      id: product.id,
      key: product.key,
      name: product.name?.en,
      sku: product.masterVariant?.sku,
      price: product.masterVariant?.prices?.[0]?.value,
      image: product.masterVariant?.images?.[0]?.url,
      createdAt: product.createdAt,
      lastModifiedAt: product.lastModifiedAt
    };

    return {
      status: 200,
      jsonBody: {
        success: true,
        data: transformed,
        raw: product // full payload (optional)
      }
    };

  } catch (error: any) {
    context.error("Error fetching product:", error);

    return {
      status: 500,
      jsonBody: {
        success: false,
        message: "Failed to fetch product from Commercetools",
        error: error.message
      }
    };
  }
}

app.http("GetProductByKey", {
  methods: ["GET"],
  authLevel: "anonymous",
  handler: GetProductByKey,
});
