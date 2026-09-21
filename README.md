# Heavy Fuel

Heavy Fuel is a full-stack e-commerce application for supplements, apparel, and training gear, built with Next.js, TypeScript, PostgreSQL, Prisma, and Stripe.

The application includes a responsive storefront, variant-based inventory, persistent cart state, authentication, Stripe payments, webhook-driven order fulfillment, product reviews, and an admin dashboard for managing products, inventory, images, and orders.

> **Live Demo:** https://heavy-fuel.vercel.app

---

## Features

### Storefront

- Responsive product catalog for supplements, apparel, and gear
- Product variants with independent size, price, stock, and SKU
- Variant-specific product imagery
- Category-based product browsing
- Product search
- Product ratings and authenticated reviews
- Persistent shopping cart with Zustand
- Customer order history

### Checkout & Orders

- Server-authoritative pricing and stock validation
- Stripe Payment Intent checkout with Stripe Elements
- Shipping address collection during checkout
- Signed Stripe webhook verification
- Transactional inventory updates after successful payment
- Persistent order history and fulfillment status

### Authentication

- Email and password authentication
- GitHub OAuth
- Session-based authorization
- User profile management
- Admin role support with server-side authorization

### Admin Dashboard

- Create and delete products
- Configure flavor/color × size combinations
- Upload variant-specific product images through Cloudinary
- View SKU-level inventory
- Edit variant price and stock
- Review customer orders and shipping information
- Update order fulfillment status

---

## Tech Stack

| Layer                | Technology                        |
| -------------------- | --------------------------------- |
| Framework            | Next.js 16, React 19              |
| Language             | TypeScript                        |
| Database             | PostgreSQL 16                     |
| ORM                  | Prisma 7                          |
| Authentication       | Better Auth                       |
| Payments             | Stripe Payment Intents + Webhooks |
| Media                | Cloudinary / `next-cloudinary`    |
| Client State         | Zustand                           |
| Server/UI Data       | TanStack React Query              |
| Validation           | Zod                               |
| Styling              | Tailwind CSS 4                    |
| UI Components        | Base UI / shadcn-style components |
| Local Infrastructure | Docker Compose                    |

PostgreSQL is containerized with Docker Compose for local development. Prisma handles database access and migrations through the PostgreSQL driver adapter.

---

## Architecture

### Product & Inventory Model

Heavy Fuel models inventory at the **product variant** level rather than directly on a product.

```text
Category 1──* Product 1──* ProductVariant
                │              │
                │              └──* OrderItem *──1 Order *──1 User
                ├──* ProductVariantImage
                └──* Review *──1 User
```

A `ProductVariant` represents a specific purchasable configuration such as:

```text
Whey Protein
├── Chocolate
│   ├── 2 lbs  → price / stock / SKU
│   └── 5 lbs  → price / stock / SKU
│
├── Strawberry
│   ├── 2 lbs  → price / stock / SKU
│   └── 5 lbs  → price / stock / SKU
│
└── Vanilla
    ├── 2 lbs  → price / stock / SKU
    └── 5 lbs  → price / stock / SKU
```

Each variant combination maintains its own price, stock count, and optional SKU.

Cart and order lines reference `ProductVariant.id`, allowing checkout and inventory management to operate on the exact configuration selected by the customer.

### Orders

Orders are initially created with a `PENDING` status.

After Stripe confirms a successful payment through the webhook, the order moves to `PROCESSING`, inventory is decremented, and the shipping information received from Stripe is stored on the order.

Admins can manage orders using the available fulfillment statuses:

- `PENDING`
- `PROCESSING`
- `SHIPPED`
- `DELIVERED`
- `CANCELLED`

---

## Stripe Payment Flow

Heavy Fuel uses **Stripe Payment Intents and Stripe Elements**, rather than Stripe Checkout Sessions.

```text
Cart
  │
  ▼
createOrder()
  │
  ├── Validate variant IDs and stock
  ├── Retrieve authoritative prices from PostgreSQL
  └── Create PENDING order
  │
  ▼
POST /api/create-intent/:orderId
  │
  ├── Verify authenticated order owner
  ├── Calculate amount from stored order
  └── Create/reuse Stripe PaymentIntent
  │
  ▼
/pay/:orderId
  │
  └── Stripe Elements
        ├── Shipping Address
        └── Payment
  │
  ▼
Stripe confirms payment
  │
  ├──────────────► /success
  │                 └── Clear client cart
  │
  ▼
payment_intent.succeeded webhook
  │
  ├── Verify Stripe signature
  ├── Locate order using PaymentIntent metadata
  ├── Conditionally decrement inventory
  ├── Store shipping information
  └── Move order to PROCESSING
```

### Payment & Inventory Integrity

Heavy Fuel keeps payment-critical values authoritative on the server:

- Order totals are calculated from database prices instead of client cart prices.
- Payment Intent amounts are derived from the stored order.
- Payment Intent creation verifies that the authenticated user owns the order.
- Existing active Payment Intents are reused to avoid unnecessary duplicate intents.
- `orderId` is stored in Stripe metadata so webhook events can locate the associated order.
- The success page does not mark an order as paid or decrement inventory.
- Stripe webhook signatures are verified before fulfillment.
- Inventory decrements run inside a Prisma transaction using conditional stock updates.
- Already-processed orders are skipped to protect against duplicate webhook fulfillment.

Currency is USD and Stripe automatic payment methods are enabled.

---

## Admin Dashboard

Heavy Fuel includes an authenticated admin workflow for managing the store.

| Route                | Purpose                                  |
| -------------------- | ---------------------------------------- |
| `/admin/products`    | Product list and variant-level inventory |
| `/admin/new-product` | Product creation and image uploads       |
| `/admin/orders`      | Order and fulfillment management         |

### Product Management

Products can contain multiple flavors or colors, with multiple sizes beneath each variant.

The admin product workflow supports:

```text
Product
  │
  ├── Variant / Flavor A
  │      ├── Image
  │      ├── Size → Price / Stock / SKU
  │      └── Size → Price / Stock / SKU
  │
  └── Variant / Flavor B
         ├── Image
         ├── Size → Price / Stock / SKU
         └── Size → Price / Stock / SKU
```

Product creation is validated with Zod on both the client and server before Prisma creates the product, its inventory variants, and its variant image records.

The inventory dashboard can expand individual products to display and edit exact variant-level stock and pricing.

### Order Management

Admins can inspect:

- Customer orders
- Purchased line items
- Variant information
- Shipping information
- Order totals
- Fulfillment status

Order statuses can then be updated through the admin interface.

### Historical Order Integrity

Products referenced by existing `OrderItem` records cannot be physically deleted if doing so would break the stored `ProductVariant` relationship used by order history.

This preserves historical purchase records rather than cascading product deletion through completed orders.

---

## Product Images

The seeded development catalog uses static product assets from `public/`.

Products created through the admin dashboard use Cloudinary through `next-cloudinary`.

Each flavor or color can have its own image while multiple sizes belonging to that same variant reuse the image.

Heavy Fuel stores both the Cloudinary image URL and its public ID. The public ID is retained to support future asset lifecycle operations such as replacing or deleting uploaded media.

The current admin uploader uses the restricted Cloudinary upload preset:

```text
heavyfuel_products
```

The Cloudinary cloud name is supplied through environment configuration.

---

## Authentication & Authorization

Authentication is implemented with Better Auth.

Supported authentication methods include:

- Email/password
- GitHub OAuth

Users can also manage their profile, review their order history, and manage their own reviews.

Admin access is represented by the `isAdmin` field on the user model.

Sensitive admin mutations are authorized on the server rather than relying solely on client-side route visibility.

For example:

```text
Admin UI
   │
   ▼
Server Action
   │
   ├── Get authenticated session
   ├── Verify user.isAdmin
   │
   ▼
Database mutation
```

Payment Intent creation similarly verifies both authentication and ownership of the requested order.

---

## Cart

Cart state is managed with Zustand and persisted to `localStorage`.

Each cart line stores the selected product variant ID along with denormalized information used to render the cart, including:

- Product name
- Product image
- Variant/flavor
- Size
- Display price
- Available stock
- Quantity

Client-side prices are treated as display information only.

When an order is created, the server retrieves the selected `ProductVariant` records from PostgreSQL and calculates the order total using database prices.

Stock is also checked server-side rather than relying exclusively on the client's cached inventory state.

---

## Reviews & User Profile

Authenticated users can submit product ratings and reviews.

Users can view their reviews from their profile and delete reviews they own. Review deletion verifies ownership server-side.

The profile also provides access to customer order history and account management functionality.

---

## Security & Data Integrity

Heavy Fuel implements several safeguards around commerce and administrative operations:

- Admin product and order mutations verify admin authorization server-side.
- Payment Intent creation verifies authenticated order ownership.
- Product prices used for checkout come from PostgreSQL rather than client input.
- Inventory is validated server-side during order creation.
- Stripe webhook signatures are verified using the raw request body.
- Payment fulfillment occurs from the Stripe webhook rather than the success page.
- Inventory decrements use conditional updates inside a database transaction.
- Order status provides replay protection against duplicate fulfillment.
- Product creation is validated server-side with Zod.
- Secret Stripe and authentication credentials remain server-side.
- Only publishable configuration is exposed through `NEXT_PUBLIC_*` environment variables.

---

## Local Development

### 1. Clone the repository

```bash
git clone <repository-url>
cd heavy-fuel
npm install
```

### 2. Configure environment variables

Create the required environment files using the variables listed below.

Do not commit secrets or local environment files to source control.

### 3. Start PostgreSQL

Heavy Fuel includes a Docker Compose configuration for PostgreSQL 16:

```bash
docker compose up -d
```

The local database maps:

```text
localhost:55432 → PostgreSQL container:5432
```

The Compose configuration includes persistent PostgreSQL storage and a database health check.

You can verify the container with:

```bash
docker compose ps
```

### 4. Set up Prisma

Apply the database migrations and generate the Prisma client:

```bash
npx prisma migrate dev
npx prisma generate
```

### 5. Seed development data (optional)

```bash
npm run db:seed
```

> **Warning:** The seed script is destructive to store data. It rebuilds catalog/order demo data and should only be used in a development environment.

### 6. Start the application

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

### 7. Receive Stripe webhooks locally

With the Stripe CLI installed and authenticated:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Use the webhook signing secret generated by the Stripe CLI as your local `STRIPE_WEBHOOK_SECRET`.

---

## Environment Variables

| Variable                             | Purpose                                          |
| ------------------------------------ | ------------------------------------------------ |
| `DATABASE_URL`                       | PostgreSQL connection string                     |
| `POSTGRES_USER`                      | Local Docker PostgreSQL user                     |
| `POSTGRES_PASSWORD`                  | Local Docker PostgreSQL password                 |
| `POSTGRES_DB`                        | Local Docker PostgreSQL database                 |
| `BETTER_AUTH_SECRET`                 | Better Auth signing secret                       |
| `BETTER_AUTH_URL`                    | Application URL used by Better Auth              |
| `GITHUB_CLIENT_ID`                   | GitHub OAuth client ID                           |
| `GITHUB_CLIENT_SECRET`               | GitHub OAuth client secret                       |
| `STRIPE_SECRET_KEY`                  | Server-side Stripe API key                       |
| `STRIPE_WEBHOOK_SECRET`              | Stripe webhook signature verification            |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe.js / Elements publishable key             |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`  | Cloudinary cloud name used by the admin uploader |

The local Docker Compose configuration defaults to:

```text
POSTGRES_USER=postgres
POSTGRES_DB=heavy-fuel
```

when those variables are not explicitly supplied.

The Cloudinary upload preset `heavyfuel_products` is currently configured directly in the admin product uploader rather than through an environment variable.

---

## Project Structure

```text
app/
├── admin/                 Admin products, inventory, and orders
├── api/
│   ├── auth/[...all]/     Better Auth handler
│   ├── create-intent/     Stripe PaymentIntent creation
│   └── webhooks/stripe/   Stripe webhook fulfillment
├── auth/                  Authentication UI
├── cart/                  Shopping cart
├── pay/[id]/              Stripe Elements checkout
├── products/[id]/         Product details and reviews
├── profile/               User profile, reviews, and orders
├── shop/                  Category browsing
└── success/               Payment confirmation

components/
├── admin/
├── cart/
├── header/
├── product/
├── stripe/
└── ui/

lib/
├── actions/               Server Actions and data access
├── validations/           Zod schemas
├── auth.ts                Better Auth configuration
├── auth-client.ts         Client auth configuration
├── prisma.ts              Prisma client + PostgreSQL adapter
├── store.ts               Zustand cart store
├── product-types.ts       Serializable product UI types
└── types.ts               Shared cart/order types

prisma/
├── schema.prisma
├── migrations/
└── seeds.ts

providers/                 React Query provider
public/                    Static storefront and seeded product assets
```

---

## Database Seeding

The development seed creates a deterministic storefront catalog containing supplements, gear, and apparel with variant-specific images, sizes, pricing, inventory, and SKUs.

It also generates development reviews and sample order data using mock users.

The seed process intentionally resets store-related development data before rebuilding the catalog. It should not be used against a production database.

---

## Future Improvements

Heavy Fuel is an actively developed portfolio project. Potential next steps include:

- Product archival / soft deletion
- Signed Cloudinary upload flow
- Cloudinary asset deletion and replacement
- Stronger order fulfillment recovery for payment-success / inventory-conflict edge cases
- Enforced order status transition rules
- Automated integration and end-to-end testing
- Refund and cancellation workflows
- Expanded admin analytics

---

## Scripts

```bash
npm run dev       # Start development server
npm run build     # Create production build
npm run start     # Start production server
npm run lint      # Run linting
npm run db:seed   # Rebuild development seed data
```

---

## License

This project was built as a portfolio and learning project.
