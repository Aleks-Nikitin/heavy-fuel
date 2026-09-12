import "dotenv/config";
import { faker } from "@faker-js/faker";
import { prisma } from "@/lib/prisma";

async function main() {
  const mockUserIds = [
    "mock-user-alex",
    "mock-user-jordan",
    "mock-user-taylor",
  ];

  await prisma.order.deleteMany({
    where: { userId: { in: mockUserIds } },
  });
  await prisma.user.deleteMany({
    where: { id: { in: mockUserIds } },
  });
  await prisma.review.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  const variants = [];

  for (let i = 0; i < 4; i++) {
    const title = `${faker.commerce.department()} ${i + 1}`;
    const category = await prisma.category.create({
      data: {
        title,
        img: faker.image.url(),
        slug: faker.helpers.slugify(title).toLowerCase(),
      },
    });

    for (let j = 0; j < 4; j++) {
      const product = await prisma.product.create({
        data: {
          name: faker.commerce.productName(),
          image: faker.image.url(),
          description: faker.commerce.productDescription(),
          categoryId: category.id,
        },
      });
      for (let k = 0; k < 3; k++) {
        const variant = await prisma.productVariant.create({
          data: {
            size: faker.helpers.arrayElement(["S", "M", "L", "XL"]),
            variant: faker.helpers.arrayElement([
              "Red",
              "Blue",
              "Green",
              "Black",
            ]),
            stock: faker.number.int({ min: 0, max: 100 }),
            sku: faker.string.uuid(),
            price: parseFloat(faker.commerce.price()),
            productId: product.id,
          },
        });
        variants.push(variant);
      }
    }
  }

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

  const statuses = ["DELIVERED", "PROCESSING", "PENDING"] as const;

  for (const [userIndex, user] of users.entries()) {
    for (let orderIndex = 0; orderIndex < 2; orderIndex++) {
      const orderVariants = variants.slice(orderIndex * 2, orderIndex * 2 + 2);
      const quantity = userIndex + orderIndex + 1;
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
              priceAtPurchase: variant.price,
            })),
          },
        },
      });
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("seeding done");
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
