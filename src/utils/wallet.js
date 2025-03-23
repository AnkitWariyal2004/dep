// src/utils/wallet.js
import Wallet from "@/lib/models/wallet";
import Transaction from "@/lib/models/transction";

export async function addorminus(customer, walletId, amount, type) {
  if (amount === null) {
    return {
      status: "failed",
      message: "Amount cannot be null",
    };
  }

  const userWallet = await Wallet.findById(walletId);
  let cumulative = 0;

  if (type === "debit") {
    const walletBalance = userWallet.amount;
    if (walletBalance < amount) {
      return {
        status: false,
        message: "Insufficient balance",
        error: "Insufficient balance in your wallet",
      };
    }
    cumulative = walletBalance - amount;
  } else if (type === "credit") {
    cumulative = userWallet.amount + amount;
  }

  try {
    const transaction = await Transaction.create({
      customerId: customer._id,
      amount,
      type,
      status: "pending",
      walletId,
      remark: "Transaction processed",
      cumulative,
    });

    userWallet.amount = transaction.cumulative;
    await userWallet.save();

    return {
      status: "success",
      message: type === "credit" ? "Transaction added successfully" : "Transaction successful",
      transaction,
    };
  } catch (error) {
    return {
      status: "failed",
      message: "Transaction failed",
      error: error.message,
    };
  }
}