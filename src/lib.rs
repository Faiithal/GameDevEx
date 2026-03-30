#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Address, Env, String, Symbol, Vec};

// --- CONTRACT LOGIC START ---
#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    Cert(String),
}

#[contract]
pub struct GameDevExContract;

#[contractimpl]
impl GameDevExContract {
    pub fn register_certificate(env: Env, hash: String, developer: Address) {
        developer.require_auth();
        if env.storage().persistent().has(&DataKey::Cert(hash.clone())) {
            panic!("Certificate hash already registered.");
        }
        env.storage().persistent().set(&DataKey::Cert(hash.clone()), &developer);
        env.events().publish((symbol_short!("reg_cert"), hash), developer);
    }

    pub fn reward_student(env: Env, developer: Address, amount: i128) {
        if amount <= 0 { panic!("Reward amount must be positive."); }
        env.events().publish((symbol_short!("reward"), developer), amount);
    }

    pub fn verify_certificate(env: Env, hash: String) -> bool {
        let exists = env.storage().persistent().has(&DataKey::Cert(hash.clone()));
        env.events().publish((symbol_short!("verify"), hash), exists);
        exists
    }

    pub fn link_payment(env: Env, employer: Address, developer: Address, amount: i128) {
        employer.require_auth();
        env.events().publish((symbol_short!("pay_link"), employer, developer), amount);
    }
}
// --- CONTRACT LOGIC END ---

// --- TEST BLOCK START ---
#[cfg(test)]
mod tests {
    use super::*; // This now correctly points to the logic above
    use soroban_sdk::{testutils::Address as _, Address, Env, String};

    #[test]
    fn test_happy_path() {
        let env = Env::default();
        env.mock_all_auths();

        let contract_id = env.register_contract(None, GameDevExContract);
        let client = GameDevExContractClient::new(&env, &contract_id);

        let dev = Address::generate(&env);
        let task_hash = String::from_str(&env, "shader_v1");

        client.register_certificate(&task_hash, &dev);
        client.reward_student(&dev, &1000);
    }

    #[test]
    #[should_panic(expected = "Certificate hash already registered")]
    fn test_duplicate() {
        let env = Env::default();
        env.mock_all_auths();
        let contract_id = env.register_contract(None, GameDevExContract);
        let client = GameDevExContractClient::new(&env, &contract_id);

        let dev = Address::generate(&env);
        let task_hash = String::from_str(&env, "unique_asset");

        client.register_certificate(&task_hash, &dev);
        client.register_certificate(&task_hash, &dev); // Should panic
    }

    #[test]
    fn test_state() {
        let env = Env::default();
        env.mock_all_auths();
        let contract_id = env.register_contract(None, GameDevExContract);
        let client = GameDevExContractClient::new(&env, &contract_id);

        let dev = Address::generate(&env);
        let task_hash = String::from_str(&env, "math_module");

        client.register_certificate(&task_hash, &dev);
        assert!(client.verify_certificate(&task_hash));
    }
}
// --- TEST BLOCK END ---