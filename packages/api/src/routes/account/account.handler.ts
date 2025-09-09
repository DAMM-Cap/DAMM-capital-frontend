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
    const address = endUser.evmAccounts[0]; // This is the unique possible address of the account
    const needToCreateAccount = endUser.evmSmartAccounts.length === 0;

    console.log("Attempting to create/get account with CDP client...");
    console.log("Address", address);
    console.log("AccountId", accountId);
    console.log("Smart Account:", endUser.evmSmartAccounts[0]);

    const account = await cdpClient.evm.getOrCreateAccount({
      name: accountId,
      //address: address as `0x${string}`,
    });

    /* let account;
    if (needToCreateAccount) {
        account = await cdpClient.evm.getOrCreateAccount({
        //name: session!.user.id,
        name: accountId,
      });
      console.log("Smart Account Created:", account.address);
    } else {
      account = await cdpClient.evm.getAccount({
        name: accountId,
        address: endUser.evmSmartAccounts[0] as `0x${string}`,
      });
      console.log("Smart Account Retrieved:", account.address);
    } */

    return c.json(
      {
        address: account.address,
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
