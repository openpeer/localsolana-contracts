use solana_program::program_error::ProgramError;
use thiserror::Error;

#[derive(Error, Debug, Copy, Clone)]
pub enum ProgramError {
    #[error("Invalid Instruction")]
    InvalidInstruction,
    // Add more custom errors as needed
}

impl From<ProgramError> for ProgramError {
    fn from(e: ProgramError) -> Self {
        ProgramError::Custom(e as u32)
    }
} 