/**
 * Shared appearance for Clerk's prebuilt components, tuned to the Beyond Lace
 * palette. Passed once to <ClerkProvider> so every <SignIn/>, <SignUp/> and
 * <UserButton/> inherits it.
 *
 * NB: this build of @clerk/nextjs honours only a subset of appearance
 * `variables` (colorPrimary + colorBackground apply; text/input colours do not)
 * and ignores `elements` classNames entirely. Text-contrast on the dark card is
 * therefore fixed with real CSS against Clerk's stable `.cl-*` classes — see the
 * "Clerk components" block in globals.css.
 */
export const clerkAppearance = {
  variables: {
    colorPrimary: "#c9a66b", // gold — primary buttons + links
    colorBackground: "#160b13", // dark card surface, lifted off pure ink
    colorInputText: "#090909", // inputs render on a light field
    borderRadius: "0.5rem",
  },
} as const;
