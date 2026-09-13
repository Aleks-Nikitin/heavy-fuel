import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";
export const { useSession, signIn, signOut } = createAuthClient({
  plugins: [
    inferAdditionalFields({
      user: {
        isAdmin: {
          type: "boolean",
          required: false,
        },
      },
    }),
  ],
});
