"use server";

import {
  ACHClass,
  CountryCode,
  TransferAuthorizationCreateRequest,
  TransferCreateRequest,
  TransferNetwork,
  TransferType,
} from "plaid";

var plaidClient = require('../plaid').plaidClient;
var parseStringify = require('../utils').parseStringify;

//import { getTransactionsByBankId } from "./transaction.actions";
var getBanks = require('./user.actions').getBanks;
var getBank = require('./user.actions').getBank;
var getTransactionsByBankId = require('./transaction.actions').getTransactionsByBankId;

// getAccounts Aided using common development resources
// export const getAccounts = async ({ userId }: getAccountsProps) => {
//   try {
//     console.log("Fetching banks for userId:", userId);
//     const banks = await getBanks({ userId });
//     console.log("Banks fetched:", banks);

//     if (!banks || banks.length === 0) {
//       throw new Error("No banks found for the user.");
//     }

//     const accounts = await Promise.all(
//       banks.map(async (bank: Bank) => {
//         try {
//           console.log(`Fetching accounts for bank ID: ${bank.$id}`);
//           const accountsResponse = await plaidClient.accountsGet({
//             access_token: bank.accessToken,
//           });
//           console.log("Accounts response:", accountsResponse.data);

//           const institutionId = accountsResponse.data.item.institution_id;
//           if (!institutionId) {
//             throw new Error("Institution ID is missing from accounts response.");
//           }
//           console.log("Fetching institution info for ID:", institutionId);
//           const institution = await getInstitution({ institutionId });
//           console.log("Institution fetched:", institution);

//           const accountData = accountsResponse.data.accounts[0];
//           console.log("Account data:", accountData);

//           return {
//             id: accountData.account_id,
//             availableBalance: accountData.balances?.available ?? 0,
//             currentBalance: accountData.balances?.current ?? 0,
//             institutionId: institution.institution_id,
//             name: accountData.name ?? "Unknown Account",
//             officialName: accountData.official_name ?? "N/A",
//             mask: accountData.mask ?? "0000",
//             type: accountData.type ?? "unknown",
//             subtype: accountData.subtype ?? "unknown",
//             appwriteItemId: bank.$id,
//             sharableId: bank.sharableId,
//           };
//         } catch (error) {
//           console.error(`Error processing bank ${bank.$id}:`, error.response?.data || error.message);
//           return null;
//         }
//       })
//     );

//     const validAccounts = accounts.filter((account) => account !== null);
//     console.log("Valid accounts:", validAccounts);

//     const totalBanks = validAccounts.length;
//     const totalCurrentBalance = validAccounts.reduce((total, account) => {
//       return total + account.currentBalance;
//     }, 0);

//     console.log("Accounts summary:", { totalBanks, totalCurrentBalance });

//     // Debug parseStringify
//     try {
//       const finalData = parseStringify({ data: validAccounts, totalBanks, totalCurrentBalance });
//       console.log("Successfully parsed data:", finalData);
//       return finalData;
//     } catch (parseError) {
//       console.error("Error during parseStringify:", parseError);
//       throw parseError;
//     }
//   } catch (error) {
//     console.error("An error occurred while getting the accounts:", error.response?.data || error.message);
//     throw error;
//   }
// };




// Get multiple bank accounts
var getAccounts = async function ({ userId }: getAccountsProps) {
  try {
    // get banks from db
    var banks = await getBanks({ userId });

    var accounts = await Promise.all(
      banks?.map(async (bank: Bank) => {
        // get each account info from plaid
        var accountsResponse = await plaidClient.accountsGet({
          access_token: bank.accessToken,
        });
        var accountData = accountsResponse.data.accounts[0];

        // get institution info from plaid
        var institution = await getInstitution({
          institutionId: accountsResponse.data.item.institution_id!,
        });

        var account = {
          id: accountData.account_id,
          availableBalance: accountData.balances.available!,
          currentBalance: accountData.balances.current!,
          institutionId: institution.institution_id,
          name: accountData.name,
          officialName: accountData.official_name,
          mask: accountData.mask!,
          type: accountData.type as string,
          subtype: accountData.subtype! as string,
          appwriteItemId: bank.$id,
          sharableId: bank.sharableId,
        };

        return account;
      })
    );

    var totalBanks = accounts.length;
    var totalCurrentBalance = accounts.reduce((total, account) => {
      return total + account.currentBalance;
    }, 0);

    return parseStringify({ data: accounts, totalBanks, totalCurrentBalance });
  } catch (error) {
    console.error("An error occurred while getting the accounts:", error);
  }
};

// Get one bank account
var getAccount = async function ({ appwriteItemId }: getAccountProps) {
  try {
    // get bank from db
    var bank = await getBank({ documentId: appwriteItemId });

    // get account info from plaid
    var accountsResponse = await plaidClient.accountsGet({
      access_token: bank.accessToken,
    });
    var accountData = accountsResponse.data.accounts[0];

    //get transfer transactions from appwrite
    var transferTransactionsData = await getTransactionsByBankId({
      bankId: bank.$id,
    });

    var transferTransactions = transferTransactionsData.documents.map(
      (transferData: Transaction) => ({
        id: transferData.$id,
        name: transferData.name!,
        amount: transferData.amount!,
        date: transferData.$createdAt,
        paymentChannel: transferData.channel,
        category: transferData.category,
        type: transferData.senderBankId === bank.$id ? "debit" : "credit",
      })
    );

    // get institution info from plaid
    var institution = await getInstitution({
      institutionId: accountsResponse.data.item.institution_id!,
    });

    var transactions = await getTransactions({
      accessToken: bank?.accessToken,
    });

    var account = {
      id: accountData.account_id,
      availableBalance: accountData.balances.available!,
      currentBalance: accountData.balances.current!,
      institutionId: institution.institution_id,
      name: accountData.name,
      officialName: accountData.official_name,
      mask: accountData.mask!,
      type: accountData.type as string,
      subtype: accountData.subtype! as string,
      appwriteItemId: bank.$id,
    };

    // sort transactions by date such that the most recent transaction is first
    var allTransactions = [
      ...transactions, 
      ...transferTransactions].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return parseStringify({
      data: account,
      transactions: allTransactions,
    });
  } catch (error) {
    console.error("An error occurred while getting the account:", error);
  }
};

// Get bank info
var getInstitution = async function ({
  institutionId,
}: getInstitutionProps) {
  try {
    var institutionResponse = await plaidClient.institutionsGetById({
      institution_id: institutionId,
      country_codes: ["US"] as CountryCode[],
    });

    var intitution = institutionResponse.data.institution;

    return parseStringify(intitution);
  } catch (error) {
    console.error("An error occurred while getting the accounts:", error);
  }
};

// Get transactions
var getTransactions = async function ({
  accessToken,
}: getTransactionsProps) {
  var hasMore = true;
  var transactions: any = [];

  try {
    // Iterate through each page of new transaction updates for item
    while (hasMore) {
      var response = await plaidClient.transactionsSync({
        access_token: accessToken,
      });

      var data = response.data;

      transactions = response.data.added.map((transaction) => ({
        id: transaction.transaction_id,
        name: transaction.name,
        paymentChannel: transaction.payment_channel,
        type: transaction.payment_channel,
        accountId: transaction.account_id,
        amount: transaction.amount,
        pending: transaction.pending,
        category: transaction.category ? transaction.category[0] : "",
        date: transaction.date,
        image: transaction.logo_url,
      }));

      hasMore = data.has_more;
    }

    return parseStringify(transactions);
  } catch (error) {
    console.error("An error occurred while getting the accounts:", error);
  }
};

// Create Transfer
var createTransfer = async function () {
  var transferAuthRequest: TransferAuthorizationCreateRequest = {
    access_token: "access-sandbox-cddd20c1-5ba8-4193-89f9-3a0b91034c25",
    account_id: "Zl8GWV1jqdTgjoKnxQn1HBxxVBanm5FxZpnQk",
    funding_account_id: "442d857f-fe69-4de2-a550-0c19dc4af467",
    type: "credit" as TransferType,
    network: "ach" as TransferNetwork,
    amount: "10.00",
    ach_class: "ppd" as ACHClass,
    user: {
      legal_name: "Anne Charleston",
    },
  };
  try {
    var transferAuthResponse =
      await plaidClient.transferAuthorizationCreate(transferAuthRequest);
    var authorizationId = transferAuthResponse.data.authorization.id;

    var transferCreateRequest: TransferCreateRequest = {
      access_token: "access-sandbox-cddd20c1-5ba8-4193-89f9-3a0b91034c25",
      account_id: "Zl8GWV1jqdTgjoKnxQn1HBxxVBanm5FxZpnQk",
      description: "payment",
      authorization_id: authorizationId,
    };

    var responseCreateResponse = await plaidClient.transferCreate(
      transferCreateRequest
    );

    var transfer = responseCreateResponse.data.transfer;
    return parseStringify(transfer);
  } catch (error) {
    console.error(
      "An error occurred while creating transfer authorization:",
      error
    );
  }
};