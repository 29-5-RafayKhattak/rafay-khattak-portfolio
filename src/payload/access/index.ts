import type { Access, FieldAccess } from "payload";

/**
 * -----------------------------------------------------------------------------
 * ACCESS RULES — all in one module
 * -----------------------------------------------------------------------------
 * The portfolio is a published site: everything it renders is meant to be read
 * by anyone. So reads are open and every write is gated on an authenticated
 * user. There is no partial-visibility model here because there is nothing in
 * the schema that some readers should see and others should not — inventing
 * one would be ceremony rather than protection.
 *
 * The one place that is genuinely restricted is `users`: an account may read
 * and edit itself, and only an admin may create, delete or list accounts.
 * -----------------------------------------------------------------------------
 */

/** Anyone may read. The site is public by definition. */
export const publicRead: Access = () => true;

/** Any signed-in editor may write. */
export const authenticated: Access = ({ req }) => Boolean(req.user);

/** Admin-only — used for destructive and account operations. */
export const adminOnly: Access = ({ req }) =>
  Boolean(req.user && req.user.role === "admin");

/** An account may act on itself; an admin may act on any. */
export const selfOrAdmin: Access = ({ req }) => {
  if (!req.user) return false;
  if (req.user.role === "admin") return true;
  return { id: { equals: req.user.id } };
};

/** Only an admin may change another account's role. */
export const adminOnlyField: FieldAccess = ({ req }) =>
  Boolean(req.user && req.user.role === "admin");
