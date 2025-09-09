/**
 * @fileoverview Account route module entry point
 * Combines the route configuration and handler into a single router.
 *
 * @module routes/account
 */

import { createRouter } from "../../lib/create-app";
import * as handler from "./account.handler";
import * as routes from "./account.routes";

/**
 * Configured account router
 * @description Combines the account route definition with its handler
 * @type {import('../../lib/types').AppOpenAPI}
 */
const router = createRouter().openapi(routes.accountRoute, handler.accountHandler);

export default router;
