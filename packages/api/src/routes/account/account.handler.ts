/**
 * @fileoverview Account route handler implementation
 * Contains the business logic for the account endpoint.
 *
 * @module routes/account/handler
 */

import * as HttpStatusCodes from "stoker/http-status-codes";
import { cdpClient } from "../../lib/cdp";
import { AppRouteHandler } from "../../lib/types";
import { AccountRoute } from "./account.routes";

/**
 * Account endpoint handler
 * @type {AppRouteHandler<AccountRoute>}
 * @description Handles GET requests to the /account endpoint
 *
 * @param {import('hono').Context} c - The Hono context object
 * @returns {Promise<Response>} JSON response with account message
 */
export const accountHandler: AppRouteHandler<AccountRoute> = async (c) => {
  try {
    const body = await c.req.json();
    const { accessToken } = body;
    console.log("accessToken", accessToken);

    if (!accessToken) {
      return c.json(
        {
          error: "Missing accessToken parameter",
          details: "The accessToken field is required in the request body",
        },
        HttpStatusCodes.BAD_REQUEST,
      );
    }

    const endUser = await cdpClient.endUser.validateAccessToken({
      accessToken,
    });

    const accountId = endUser.userId;

    console.log("AccountId", accountId);
    console.log("EOA Address", endUser.evmAccounts[0]);
    console.log("Smart Account Address:", endUser.evmSmartAccounts[0]);

    console.log("Attempting to create/get account with CDP client...");

    const ownerAccount = await cdpClient.evm.getOrCreateAccount({
      name: accountId,
    });

    const account = await cdpClient.evm.getOrCreateSmartAccount({
      name: accountId,
      owner: ownerAccount,
    });

    return c.json(
      {
        evmEOAAddress: ownerAccount.address,
        evmSmartAddress: account.address,
        accountId: accountId,
      },
      HttpStatusCodes.OK,
    );
  } catch (error) {
    console.error("Error in account handler:", error);
    return c.json(
      {
        error: "Failed to create/get account",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
};
