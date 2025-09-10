/**
 * @fileoverview Account route definitions
 * Defines the OpenAPI schema for the account endpoints.
 *
 * @module routes/account/routes
 */

import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { createMessageObjectSchema } from "stoker/openapi/schemas";
import { z } from "zod";

/**
 * Account route configuration
 * @description Defines a POST endpoint that accepts an auth token and returns account information
 *
 * @openapi
 * /account:
 *   post:
 *     tags:
 *       - Account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               accessToken:
 *                 type: string
 *                 description: Access token for authentication
 *             required:
 *               - accessToken
 *     responses:
 *       200:
 *         description: Successful account response
 *       400:
 *         description: Bad request - missing or invalid access token
 *       500:
 *         description: Internal server error
 */
const AccountRequestSchema = z.object({
  accessToken: z.string().describe("Access token for authentication"),
});

const AccountResponseSchema = z.object({
  evmEOAAddress: z.string().describe("EVM EOA address"),
  evmSmartAddress: z.string().describe("EVM Smart address"),
  accountId: z.string().describe("Account identifier"),
});

const ErrorResponseSchema = z.object({
  error: z.string().describe("Error message"),
  details: z.string().describe("Error details"),
});

export const accountRoute = createRoute({
  path: "/account",
  method: "post",
  tags: ["Account"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: AccountRequestSchema,
        },
      },
    },
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(AccountResponseSchema, "Account information"),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(ErrorResponseSchema, "Bad request"),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      ErrorResponseSchema,
      "Internal server error",
    ),
  },
});

export type AccountRoute = typeof accountRoute;
