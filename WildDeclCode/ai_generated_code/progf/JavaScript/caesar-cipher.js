// THIS WAS Supported via standard programming aids - IT IS NOT WORKING AT THE MOMENT
// WHY DON'T I GET A VERSION OF THIS THAT DOESN'T MESS AROUND WITH COMMAND LINE ARGUMENTS??

const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Check command line argument
if (process.argv.length !== 3 || isNaN(parseInt(process.argv[2]))) {
  console.log(`Usage: node caesar.js key`);
  process.exit(1);
}
const k = parseInt(process.argv[2]);

// Get plaintext from user
rl.question("plaintext: ", plaintext => {
  // Encrypt plaintext
  let ciphertext = "";
  for (let i = 0; i < plaintext.length; i++) {
    let c = plaintext[i];
    if (/[a-zA-Z]/.test(c)) {
      let base = c === c.toUpperCase() ? "A" : "a";
      c = String.fromCharCode(
        ((c.charCodeAt(0) - base + k) % 26) + base.charCodeAt(0)
      );
    }
    ciphertext += c;
  }
  console.log(`ciphertext: ${ciphertext}`);
  rl.close();
});
