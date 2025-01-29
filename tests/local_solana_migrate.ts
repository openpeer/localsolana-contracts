import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { LocalSolanaMigrate } from "../target/types/local_solana_migrate";
import { expect } from 'chai';

describe("local_solana_migrate", () => {
  // Configure the client to use the local cluster
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.LocalSolanaMigrate as Program<LocalSolanaMigrate>;
  const wallet = provider.wallet as anchor.Wallet;

  it("Initialize escrow state", async () => {
    try {
      // Find PDA for escrow state
      const [escrowStatePDA] = anchor.web3.PublicKey.findProgramAddressSync(
        [
          Buffer.from("escrow_state"),
          wallet.publicKey.toBuffer()
        ],
        program.programId
      );

      console.log("Escrow State PDA:", escrowStatePDA.toString());
      console.log("Wallet pubkey:", wallet.publicKey.toString());

      const tx = await program.methods
        .initialize(
          new anchor.BN(100), // fee_bps (1%)
          new anchor.BN(5_000_000), // dispute_fee
          wallet.publicKey // fee_discount_nft
        )
        .accounts({
          escrowState: escrowStatePDA,
          seller: wallet.publicKey,
          feePayer: wallet.publicKey,  // Added fee_payer
          arbitrator: wallet.publicKey,
          feeRecipient: wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();

      console.log("Transaction signature:", tx);

      // Fetch the created account
      const account = await program.account.escrowState.fetch(escrowStatePDA);
      expect(account.isInitialized).to.be.true;
      expect(account.seller.toString()).to.equal(wallet.publicKey.toString());
      
    } catch (err) {
      console.error("Error:", err);
      throw err;
    }
  });
}); 