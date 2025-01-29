// Network-specific program ID
#[cfg(feature = "localnet")]
pub const PROGRAM_ID: &str = "GYAAArQX2sW9ju2FqXawS73bSjA3JwHKT2gmyLWsRZeN";
#[cfg(feature = "devnet")]
pub const PROGRAM_ID: &str = "3ZCPySRfFaDPthn5G5en7WzvZd5dtv3XvBR7zjHVRxZh";
#[cfg(feature = "mainnet")]
pub const PROGRAM_ID: &str = "YOUR_MAINNET_PROGRAM_ID";

// Fee constants
#[cfg(feature = "localnet")]
pub const DISPUTE_FEE: u64 = 5_000_000; // 0.005 SOL
#[cfg(feature = "devnet")]
pub const DISPUTE_FEE: u64 = 5_000_000; // 0.005 SOL
#[cfg(feature = "mainnet")]
pub const DISPUTE_FEE: u64 = 5_000_000; // 0.005 SOL

// Time constraints (in seconds)
pub const MIN_SELLER_WAITING_TIME: i64 = 15 * 60;     // 15 minutes
pub const MAX_SELLER_WAITING_TIME: i64 = 24 * 60 * 60; // 24 hours

// Fee calculation
pub const OPEN_PEER_FEE_BPS: u64 = 100; // 1.0% 