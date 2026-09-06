import "dotenv/config";
import { faker } from "@faker-js/faker";
import { prisma } from "@/lib/prisma";

async function main() {
  await prisma.review.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

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
        await prisma.productVariant.create({
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
      }
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
