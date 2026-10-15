import { Type, type FunctionDeclaration } from "@google/genai";

export const customerToolDefinitions: FunctionDeclaration[] = [
  {
    name: "searchCatalog",

    description:
      "Search the HeavyFuel product catalog using structured filters. Use this tool for questions about prices, cheapest or most expensive products, flavors, sizes, categories, and stock availability.",

    parameters: {
      type: Type.OBJECT,

      properties: {
        category: {
          type: Type.STRING,
          enum: ["supplements", "apparel", "gear"],
          description:
            "HeavyFuel has exactly three categories: supplements, apparel, and gear. Protein powder, creatine, and mass gainer are product types within supplements, not separate categories.",
        },
        productIds: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
          },
          description:
            "Optional product IDs returned by semanticSearch. Use these to filter semantically relevant products by price, flavor, size, or availability.",
        },

        productName: {
          type: Type.STRING,
          description:
            "Partial product name or product type. For example, use 'Whey Protein' when searching for protein powder, 'Creatine' for creatine, or 'Mass Gainer' for weight gain supplements.",
        },

        variant: {
          type: Type.STRING,
          description:
            "Product flavor or variant, such as Vanilla, Chocolate, or Black.",
        },

        size: {
          type: Type.STRING,
          description: "Product size, such as 2 lb, 5 lb, Medium, or XL.",
        },

        minPrice: {
          type: Type.NUMBER,
          description: "Minimum price in USD.",
        },

        maxPrice: {
          type: Type.NUMBER,
          description: "Maximum price in USD.",
        },

        inStockOnly: {
          type: Type.BOOLEAN,
          description:
            "Whether to return only variants with stock greater than zero.",
        },

        sortBy: {
          type: Type.STRING,
          enum: ["price_asc", "price_desc"],
          description: "Sort by price ascending or descending.",
        },

        limit: {
          type: Type.INTEGER,
          description:
            "Maximum number of matching variants to return, between 1 and 20.",
        },
      },
    },
  },

  {
    name: "semanticSearch",

    description:
      "Find HeavyFuel products based on customer goals, preferences, or natural-language descriptions. Use this tool for product recommendations such as muscle recovery, strength training, weight gain, or workout clothing.",

    parameters: {
      type: Type.OBJECT,

      properties: {
        query: {
          type: Type.STRING,
          description:
            "Natural-language query describing the customer's needs.",
        },
      },

      required: ["query"],
    },
  },
];
