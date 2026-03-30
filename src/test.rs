#![cfg(test)]
use super::*;
use soroban_sdk::{testutils::Address as _, Address, Env, String};

#[test]
fn test_happy_path_registration_and_reward() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, GameDevExContract);
    let client = GameDevExContractClient::new(&env, &contract_id);

    let dev = Address::generate(&env);
    let task_hash = String::from_str(&env, "shader_optimization_v1");

    // Test Registration
    client.register_certificate(&task_hash, &dev);
    
    // Test Reward logic trigger
    client.reward_student(&dev, &1000);
}

#[test]
#[should_panic(expected = "Certificate hash already registered")]
fn test_duplicate_registration_rejected() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, GameDevExContract);
    let client = GameDevExContractClient::new(&env, &contract_id);

    let dev1 = Address::generate(&env);
    let dev2 = Address::generate(&env);
    let task_hash = String::from_str(&env, "unique_game_asset_001");

    client.register_certificate(&task_hash, &dev1);
    // This second call should trigger the panic
    client.register_certificate(&task_hash, &dev2);
}

#[test]
fn test_state_verification() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, GameDevExContract);
    let client = GameDevExContractClient::new(&env, &contract_id);

    let dev = Address::generate(&env);
    let task_hash = String::from_str(&env, "verified_math_module");

    client.register_certificate(&task_hash, &dev);

    // Assert that the contract returns true for the existing hash
    assert_eq!(client.verify_certificate(&task_hash), true);
    
    // Assert that a non-existent hash returns false
    let fake_hash = String::from_str(&env, "fake_hash");
    assert_eq!(client.verify_certificate(&fake_hash), false);
}