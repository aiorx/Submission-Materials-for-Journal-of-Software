```typescript
// This was autoAided via basic GitHub coding utilities
enum Party {
  SENDER,
  RECIPIENT,
}
contract.on("TransferCancelled", (from, to, amount, party: BigInt) => {
  console.log("Debug: transfer has been cancellled.");
  get(ref(db, "users/" + from)).then((fromSnapshot) => {
    console.log("Value fetched.");
    const fromEmail = fromSnapshot.val().email;
    const fromName = fromSnapshot.val().name;
    get(ref(db, "users/" + to)).then((toSnapshot) => {
      console.log("Second value fetched.");
      const toEmail = toSnapshot.val().email;
      if (Number(party) === Party.SENDER) {
        let msg = {
          to: fromEmail,
          from: "etransfer@xavierdmello.com",
          subject: "INTERAC e-Transfer: Your transfer was cancelled.",
          text: "Hi " + fromName + ",\n\nYour transfer of $" + ethers.formatEther(amount) + " (USD) to " + to + " was cancelled by you.",
        };
        sgMail
          .send(msg)
          .then(() => {
            console.log("Sent transfer cancelled email to " + fromEmail + " for " + ethers.formatEther(amount) + "USD.");
          })
          .catch((error: any) => {
            if (error instanceof Error) {
              console.error(error);
            }
          });

        msg = {
          to: toEmail,
          from: "etransfer@xavierdmello.com",
          subject: "INTERAC e-Transfer: Transfer cancelled.",
          text: "Hi,\n\nThe transfer of $" + ethers.formatEther(amount) + " (USD) from " + from + " to you was cancelled by the sender.",
        };
        sgMail
          .send(msg)
          .then(() => {
            console.log("Sent transfer cancelled email to " + toEmail + " for " + ethers.formatEther(amount) + "USD.");
          })
          .catch((error: any) => {
            if (error instanceof Error) {
              console.error(error);
            }
          });
      } else if (Number(party) === Party.RECIPIENT) {
        let msg = {
          to: fromEmail,
          from: "etransfer@xavierdmello.com",
          subject: "INTERAC e-Transfer: Your transfer was cancelled.",
          text: "Hi " + fromName + ",\n\nYour transfer of $" + ethers.formatEther(amount) + " (USD) to " + to + " was cancelled by the recipient.",
        };
        sgMail
          .send(msg)
          .then(() => {
            console.log("Sent transfer cancelled email to " + fromEmail + " for " + ethers.formatEther(amount) + "USD.");
          })
          .catch((error: any) => {
            if (error instanceof Error) {
              console.error(error);
            }
          });

        msg = {
          to: toEmail,
          from: "etransfer@xavierdmello.com",
          subject: "INTERAC e-Transfer: Transfer cancelled.",
          text: "Hi,\n\nThe transfer of $" + ethers.formatEther(amount) + " (USD) from " + from + " to you was cancelled by you.",
        };
        sgMail
          .send(msg)
          .then(() => {
            console.log("Sent transfer cancelled email to " + toEmail + " for " + ethers.formatEther(amount) + "USD.");
          })
          .catch((error: any) => {
            if (error instanceof Error) {
              console.error(error);
            }
          });
      } else {
        console.log("Error sending transfer cancelled email. Party is not SENDER or RECIPIENT.");
        console.log(party);
      }
    });
  });
});
```