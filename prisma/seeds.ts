import "dotenv/config";
import { faker } from "@faker-js/faker";
import { prisma } from "@/lib/prisma";

const mockUserIds = ["mock-user-alex", "mock-user-jordan", "mock-user-taylor"];

type SeedProduct = {
  name: string;
  description: string;
  skuPrefix: string;
  category: "supplements" | "gear" | "apparel";
  defaultImage: string;

  options: {
    variant: string;
    image: string;
    sizes: {
      size: string;
      price: number;
      stock: number;
    }[];
  }[];
};

const products: SeedProduct[] = [
  {
    name: "HeavyFuel Whey Protein",
    skuPrefix: "HF-WHEY",
    category: "supplements",
    defaultImage: "/protein-chocolate.jpg",

    description:
      "Premium whey protein isolate engineered to support muscle recovery, strength, and daily protein intake.",

    options: [
      {
        variant: "Chocolate",
        image: "/protein-chocolate.jpg",
        sizes: [
          {
            size: "2 lbs",
            price: 52.99,
            stock: 18,
          },
          {
            size: "5 lbs",
            price: 99.99,
            stock: 10,
          },
        ],
      },

      {
        variant: "Strawberry",
        image: "/protein-strawberry.jpg",
        sizes: [
          {
            size: "2 lbs",
            price: 52.99,
            stock: 14,
          },
          {
            size: "5 lbs",
            price: 99.99,
            stock: 8,
          },
        ],
      },

      {
        variant: "Vanilla",
        image: "/protein-vanilla.jpg",
        sizes: [
          {
            size: "2 lbs",
            price: 52.99,
            stock: 20,
          },
          {
            size: "5 lbs",
            price: 99.99,
            stock: 12,
          },
        ],
      },
    ],
  },

  {
    name: "HeavyFuel Creatine",
    category: "supplements",
    skuPrefix: "HF-CREATINE",
    defaultImage: "/creatine-blue-raspberry.jpg",

    description:
      "Performance-focused creatine formula designed to support strength, power output, and high-intensity training.",

    options: [
      {
        variant: "Blue Raspberry",
        image: "/creatine-blue-raspberry.jpg",
        sizes: [
          {
            size: "30 Servings",
            price: 29.99,
            stock: 25,
          },
          {
            size: "60 Servings",
            price: 44.99,
            stock: 15,
          },
        ],
      },

      {
        variant: "Lime",
        image: "/creatine-lime.jpg",
        sizes: [
          {
            size: "30 Servings",
            price: 29.99,
            stock: 22,
          },
          {
            size: "60 Servings",
            price: 44.99,
            stock: 11,
          },
        ],
      },
    ],
  },

  {
    name: "HeavyFuel Mass Gainer",
    skuPrefix: "HF-GAINER",
    category: "supplements",
    defaultImage: "/gainer-chocolate.jpg",

    description:
      "High-calorie mass gainer formulated for athletes looking to support muscle growth, recovery, and increased daily calorie intake.",

    options: [
      {
        variant: "Chocolate",
        image: "/gainer-chocolate.jpg",
        sizes: [
          {
            size: "6 lbs",
            price: 54.99,
            stock: 14,
          },
          {
            size: "12 lbs",
            price: 89.99,
            stock: 7,
          },
        ],
      },

      {
        variant: "Vanilla",
        image: "/gainer-vanilla.jpg",
        sizes: [
          {
            size: "6 lbs",
            price: 54.99,
            stock: 12,
          },
          {
            size: "12 lbs",
            price: 89.99,
            stock: 6,
          },
        ],
      },
    ],
  },

  {
    name: "HeavyFuel Lifting Belt",
    skuPrefix: "HF-LIFTING-BELT",
    category: "gear",
    defaultImage: "/lifting-belt.jpg",

    description:
      "Heavy-duty lifting belt built for maximum stability and support during squats, deadlifts, and heavy compound training.",

    options: [
      {
        variant: "Black",
        image: "/lifting-belt.jpg",
        sizes: [
          {
            size: "S",
            price: 69.99,
            stock: 8,
          },
          {
            size: "M",
            price: 69.99,
            stock: 15,
          },
          {
            size: "L",
            price: 69.99,
            stock: 12,
          },
          {
            size: "XL",
            price: 69.99,
            stock: 6,
          },
        ],
      },
    ],
  },

  {
    name: "HeavyFuel Trainer I",
    category: "gear",
    skuPrefix: "HF-TRAINER-I",
    defaultImage: "/shoes-black-1.jpg",

    description:
      "Stable training shoes built for strength sessions, gym work, and everyday athletic performance.",

    options: [
      {
        variant: "Black",
        image: "/shoes-black-1.jpg",
        sizes: [
          {
            size: "8",
            price: 109.99,
            stock: 8,
          },
          {
            size: "9",
            price: 109.99,
            stock: 12,
          },
          {
            size: "10",
            price: 109.99,
            stock: 15,
          },
          {
            size: "11",
            price: 109.99,
            stock: 10,
          },
          {
            size: "12",
            price: 109.99,
            stock: 6,
          },
        ],
      },
    ],
  },

  {
    name: "HeavyFuel Trainer II",
    category: "gear",
    skuPrefix: "HF-TRAINER-II",
    defaultImage: "/shoes-black-2.jpg",

    description:
      "Premium second-generation HeavyFuel training shoe engineered for stability, comfort, and demanding gym sessions.",

    options: [
      {
        variant: "Black",
        image: "/shoes-black-2.jpg",
        sizes: [
          { size: "8", price: 129.99, stock: 8 },
          { size: "9", price: 129.99, stock: 11 },
          { size: "10", price: 129.99, stock: 14 },
          { size: "11", price: 129.99, stock: 9 },
          { size: "12", price: 129.99, stock: 5 },
        ],
      },

      {
        variant: "Blue",
        image: "/shoes-blue-2.jpg",
        sizes: [
          { size: "8", price: 129.99, stock: 7 },
          { size: "9", price: 129.99, stock: 10 },
          { size: "10", price: 129.99, stock: 12 },
          { size: "11", price: 129.99, stock: 8 },
          { size: "12", price: 129.99, stock: 4 },
        ],
      },

      {
        variant: "Red",
        image: "/shoes-red-2.jpg",
        sizes: [
          { size: "8", price: 129.99, stock: 6 },
          { size: "9", price: 129.99, stock: 9 },
          { size: "10", price: 129.99, stock: 11 },
          { size: "11", price: 129.99, stock: 7 },
          { size: "12", price: 129.99, stock: 3 },
        ],
      },
    ],
  },

  {
    name: "HeavyFuel Training Joggers",
    category: "apparel",
    skuPrefix: "HF-JOGGERS",
    defaultImage: "/pants-black.jpg",

    description:
      "Premium athletic-fit training joggers built from heavyweight performance fabric for lifting, training, and everyday wear.",

    options: [
      {
        variant: "Black",
        image: "/pants-black.jpg",
        sizes: [
          { size: "S", price: 64.99, stock: 10 },
          { size: "M", price: 64.99, stock: 18 },
          { size: "L", price: 64.99, stock: 15 },
          { size: "XL", price: 64.99, stock: 8 },
        ],
      },

      {
        variant: "Blue",
        image: "/pants-blue.jpg",
        sizes: [
          { size: "S", price: 64.99, stock: 8 },
          { size: "M", price: 64.99, stock: 14 },
          { size: "L", price: 64.99, stock: 11 },
          { size: "XL", price: 64.99, stock: 5 },
        ],
      },
    ],
  },

  {
    name: "HeavyFuel Performance Tee",
    category: "apparel",
    skuPrefix: "HF-TEE",
    defaultImage: "/tshirt-black.jpg",

    description:
      "Athletic performance tee with a modern fitted silhouette designed for hard training sessions and everyday wear.",

    options: [
      {
        variant: "Black",
        image: "/tshirt-black.jpg",
        sizes: [
          { size: "S", price: 34.99, stock: 12 },
          { size: "M", price: 34.99, stock: 20 },
          { size: "L", price: 34.99, stock: 17 },
          { size: "XL", price: 34.99, stock: 9 },
        ],
      },

      {
        variant: "Blue",
        image: "/tshirt-blue.jpg",
        sizes: [
          { size: "S", price: 34.99, stock: 10 },
          { size: "M", price: 34.99, stock: 16 },
          { size: "L", price: 34.99, stock: 13 },
          { size: "XL", price: 34.99, stock: 7 },
        ],
      },

      {
        variant: "Purple",
        image: "/tshirt-purple.jpg",
        sizes: [
          { size: "S", price: 34.99, stock: 8 },
          { size: "M", price: 34.99, stock: 14 },
          { size: "L", price: 34.99, stock: 10 },
          { size: "XL", price: 34.99, stock: 5 },
        ],
      },
    ],
  },
];

async function main() {
  console.log("Cleaning existing store data...");
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.review.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany({
    where: {
      id: {
        in: mockUserIds,
      },
    },
  });
  console.log("Store data cleaned.");
  const users = await Promise.all([
    prisma.user.create({
      data: {
        id: "mock-user-alex",
        name: "Alex Morgan",
        email: "alex@example.com",
        emailVerified: true,
        isAdmin: true,
      },
    }),

    prisma.user.create({
      data: {
        id: "mock-user-jordan",
        name: "Jordan Lee",
        email: "jordan@example.com",
        emailVerified: true,
      },
    }),

    prisma.user.create({
      data: {
        id: "mock-user-taylor",
        name: "Taylor Reed",
        email: "taylor@example.com",
        emailVerified: true,
      },
    }),
  ]);
  const categories = {
    supplements: await prisma.category.create({
      data: {
        title: "Supplements",
        slug: "supplements",
        img: "/supplements.jpg",
      },
    }),

    gear: await prisma.category.create({
      data: {
        title: "Gear",
        slug: "gear",
        img: "/gear.jpg",
      },
    }),

    apparel: await prisma.category.create({
      data: {
        title: "Apparel",
        slug: "apparel",
        img: "/apparel.jpg",
      },
    }),
  };
  const createdVariants: {
    id: string;
    price: unknown;
  }[] = [];

  for (const seedProduct of products) {
    const category = categories[seedProduct.category];

    const product = await prisma.product.create({
      data: {
        name: seedProduct.name,
        description: seedProduct.description,
        image: seedProduct.defaultImage,
        categoryId: category.id,

        variantImages: {
          create: seedProduct.options.map((option) => ({
            variant: option.variant,
            image: option.image,
          })),
        },

        variants: {
          create: seedProduct.options.flatMap((option) =>
            option.sizes.map((size) => ({
              variant: option.variant,
              size: size.size,
              price: size.price,
              stock: size.stock,

              sku: `${seedProduct.skuPrefix}-${option.variant
                .replace(/[^a-zA-Z0-9]/g, "")
                .toUpperCase()}-${size.size
                .replace(/[^a-zA-Z0-9]/g, "")
                .toUpperCase()}`,
            })),
          ),
        },
      },

      include: {
        variants: true,
      },
    });

    createdVariants.push(...product.variants);
    for (const user of users) {
      await prisma.review.create({
        data: {
          rating: faker.number.int({
            min: 3,
            max: 5,
          }),

          title: faker.helpers.arrayElement([
            "Great quality",
            "Solid product",
            "Worth it",
            "Really impressed",
            "Would buy again",
          ]),

          body: faker.lorem.sentences({
            min: 1,
            max: 3,
          }),

          userId: user.id,
          productId: product.id,
        },
      });
    }
  }

  const statuses = ["DELIVERED", "PROCESSING", "PENDING"] as const;

  for (const [userIndex, user] of users.entries()) {
    for (let orderIndex = 0; orderIndex < 2; orderIndex++) {
      const start = (userIndex * 4 + orderIndex * 2) % createdVariants.length;

      const orderVariants = [
        createdVariants[start],
        createdVariants[(start + 1) % createdVariants.length],
      ];

      const quantity = orderIndex + 1;

      const totalAmount = orderVariants.reduce(
        (total, variant) => total + Number(variant.price) * quantity,
        0,
      );

      await prisma.order.create({
        data: {
          userId: user.id,
          totalAmount,

          status: statuses[(userIndex + orderIndex) % statuses.length],

          items: {
            create: orderVariants.map((variant) => ({
              productVariantId: variant.id,
              quantity,
              priceAtPurchase: Number(variant.price),
            })),
          },
        },
      });
    }
  }

  console.log(
    `Seeded ${products.length} products and ${createdVariants.length} product variants.`,
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("Seeding done.");
  })
  .catch(async (error) => {
    console.error("Seeding failed:", error);
    await prisma.$disconnect();
    process.exit(1);
  });
