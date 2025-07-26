use candid::{CandidType, Nat, Principal};
use ic_cdk::api::management_canister::http_request::{
    http_request, CanisterHttpRequestArgument, HttpHeader, HttpMethod,
};
use serde::{Deserialize, Serialize};
use std::cell::RefCell;
use std::collections::HashMap;

// Enhanced state with ICP-native features while keeping original structure
#[derive(Serialize, Deserialize, Clone, CandidType, Default)]
struct State {
    // Original fields
    api_key: String, // Keep for backward compatibility
    api_keys: HashMap<String, String>, // Enhanced multi-provider support
    
    // Enhanced conversation storage with Principal support
    conversations: HashMap<Principal, Vec<ChatMessage>>,
    legacy_conversations: HashMap<String, Vec<ChatMessage>>, // Keep original string-based for compatibility
    
    user_preferences: HashMap<Principal, UserPreferences>,
    system_prompts: HashMap<String, String>,
    
    // ICP-specific features
    user_cycles_balance: HashMap<Principal, u64>,
    icrc_token_balances: HashMap<Principal, u64>,
    ai_content_storage: HashMap<String, AIContent>,
    sns_proposals: Vec<SNSProposal>,
    canister_metrics: CanisterMetrics,
    subscription_tiers: HashMap<Principal, SubscriptionTier>,
}

#[derive(Serialize, Deserialize, Clone, CandidType)]
struct ChatMessage {
    role: String,
    content: String,
    timestamp: u64,
    provider: String,
    // New ICP fields with defaults for compatibility
    cycles_cost: Option<u64>,
    content_stored_on_chain: Option<bool>,
    content_hash: Option<String>,
    ii_verified: Option<bool>,
}

#[derive(Serialize, Deserialize, Clone, CandidType, Default)]
struct UserPreferences {
    preferred_provider: String,
    conversation_style: String,
    max_context_messages: u32,
    language: String,
    // ICP-specific preferences
    auto_store_on_chain: bool,
    cycles_auto_topup: bool,
    participate_in_sns: bool,
    max_cycles_per_query: u64,
}

// ICP-native structures
#[derive(Serialize, Deserialize, Clone, CandidType)]
struct AIContent {
    content: String,
    content_type: String,
    creator: Principal,
    created_at: u64,
    size_bytes: u64,
    access_level: AccessLevel,
    cycles_cost_to_create: u64,
}

#[derive(Serialize, Deserialize, Clone, CandidType)]
enum AccessLevel {
    Public,
    Private,
    Community,
    Premium,
}

#[derive(Serialize, Deserialize, Clone, CandidType)]
struct SNSProposal {
    id: u64,
    proposer: Principal,
    title: String,
    description: String,
    proposal_type: SNSProposalType,
    votes_for: u64,
    votes_against: u64,
    total_voting_power: u64,
    deadline: u64,
    executed: bool,
    created_at: u64,
}

#[derive(Serialize, Deserialize, Clone, CandidType)]
enum SNSProposalType {
    AddAIProvider { provider_name: String, api_endpoint: String },
    UpdateCyclesRates { new_rates: CyclesRates },
    SystemPromptUpdate { prompt_name: String, new_prompt: String },
    TreasuryManagement { action: String, amount: u64 },
}

#[derive(Serialize, Deserialize, Clone, CandidType)]
struct CyclesRates {
    query_base_cost: u64,
    storage_cost_per_kb: u64,
    computation_multiplier: f32,
}

#[derive(Serialize, Deserialize, Clone, CandidType)]
enum SubscriptionTier {
    Basic { cycles_included: u64 },
    Premium { cycles_included: u64, priority_access: bool },
    Enterprise { cycles_included: u64, private_models: bool, custom_endpoints: bool },
}

#[derive(Serialize, Deserialize, Clone, CandidType, Default)]
struct CanisterMetrics {
    total_queries: u64,
    total_cycles_consumed: u64,
    total_users: u64,
    storage_used_bytes: u64,
    uptime_start: u64,
}

#[derive(Serialize, Deserialize, Clone, CandidType)]
struct UserDashboard {
    cycles_balance: u64,
    token_balance: u64,
    conversation_count: u64,
    stored_content_count: u64,
    subscription_tier: Option<SubscriptionTier>,
    total_cycles_spent: u64,
}

// Original Gemini API structures (unchanged)
#[derive(Serialize)]
struct GeminiRequest {
    contents: Vec<Content>,
}

#[derive(Serialize)]
struct Content {
    parts: Vec<Part>,
}

#[derive(Serialize)]
struct Part {
    text: String,
}

#[derive(Deserialize, Debug)]
struct GeminiResponse {
    candidates: Vec<Candidate>,
}

#[derive(Deserialize, Debug)]
struct Candidate {
    content: ContentResponse,
}

#[derive(Deserialize, Debug)]
struct ContentResponse {
    parts: Vec<PartResponse>,
    role: String,
}

#[derive(Deserialize, Debug)]
struct PartResponse {
    text: String,
}

thread_local! {
    static STATE: RefCell<State> = RefCell::new(State::default());
}

// Original functions (unchanged for backward compatibility)
#[ic_cdk::query]
fn greet(name: String) -> String {
    format!("Hello, {}! Welcome to your Universal AI Assistant powered by the Internet Computer!", name)
}

#[ic_cdk::update]
fn set_api_key(key: String) {
    let caller = ic_cdk::caller();
    if ic_cdk::api::is_controller(&caller) {
        STATE.with(|state| {
            let mut state = state.borrow_mut();
            state.api_key = key.clone();
            state.api_keys.insert("gemini".to_string(), key); // Also set in multi-provider map
        });
        ic_cdk::println!("API key set successfully");
    } else {
        ic_cdk::trap("Only a controller can set the API key.");
    }
}

// Original prompt function (unchanged - maintains compatibility)
#[ic_cdk::update]
async fn prompt(prompt_text: String) -> Result<String, String> {
    let api_key = STATE.with(|state| {
        let state = state.borrow();
        if !state.api_key.is_empty() {
            state.api_key.clone()
        } else {
            state.api_keys.get("gemini").cloned().unwrap_or_default()
        }
    });
    
    if api_key.is_empty() {
        return Err("API key is not set. Please call set_api_key first.".to_string());
    }

    let url = format!(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key={}",
        api_key
    );

    let request_body = GeminiRequest {
        contents: vec![Content {
            parts: vec![Part { text: prompt_text }],
        }],
    };

    let request_body_bytes = serde_json::to_vec(&request_body)
        .map_err(|e| format!("Serialization error: {}", e))?;

    let request = CanisterHttpRequestArgument {
        url,
        method: HttpMethod::POST,
        body: Some(request_body_bytes),
        max_response_bytes: Some(8192),
        transform: None,
        headers: vec![
            HttpHeader {
                name: "Content-Type".to_string(),
                value: "application/json".to_string(),
            },
        ],
    };

    match http_request(request, 20_000_000_000).await {
        Ok((response,)) => {
            if response.status >= Nat::from(200u32) && response.status < Nat::from(300u32) {
                let response_body: GeminiResponse = serde_json::from_slice(&response.body)
                    .map_err(|e| {
                        format!(
                            "Failed to parse response: {} Body: {}",
                            e,
                            String::from_utf8_lossy(&response.body)
                        )
                    })?;

                if let Some(candidate) = response_body.candidates.get(0) {
                    if let Some(part) = candidate.content.parts.get(0) {
                        return Ok(part.text.clone());
                    }
                }
                Err("No content found in Gemini response".to_string())
            } else {
                Err(format!(
                    "API call failed with status {}: {}",
                    response.status,
                    String::from_utf8_lossy(&response.body)
                ))
            }
        }
        Err((code, msg)) => Err(format!("HTTP request failed: {:?} {}", code, msg)),
    }
}

// Enhanced ICP-native functions
#[ic_cdk::update]
fn set_provider_api_key(provider: String, key: String) {
    let caller = ic_cdk::caller();
    if ic_cdk::api::is_controller(&caller) {
        STATE.with(|state| {
            state.borrow_mut().api_keys.insert(provider.clone(), key);
        });
        ic_cdk::println!("API key set successfully for provider: {}", provider);
    } else {
        ic_cdk::trap("Only a controller can set API keys.");
    }
}

#[ic_cdk::query]
fn get_user_cycles_balance(user: Principal) -> u64 {
    STATE.with(|state| {
        state.borrow().user_cycles_balance.get(&user).copied().unwrap_or(0)
    })
}

#[ic_cdk::update]
fn deposit_user_cycles(user: Principal) -> Result<String, String> {
    let caller = ic_cdk::caller();
    if caller != user && !ic_cdk::api::is_controller(&caller) {
        return Err("Unauthorized to deposit cycles for this user".to_string());
    }
    
    let cycles_available = ic_cdk::api::call::msg_cycles_available128();
    if cycles_available == 0 {
        return Err("No cycles sent with this call".to_string());
    }
    
    let cycles = cycles_available as u64;
    ic_cdk::api::call::msg_cycles_accept128(cycles_available);
    
    STATE.with(|state| {
        let mut state = state.borrow_mut();
        let current = state.user_cycles_balance.get(&user).copied().unwrap_or(0);
        state.user_cycles_balance.insert(user, current + cycles);
    });
    
    Ok(format!("Deposited {} cycles for user", cycles))
}

#[ic_cdk::query]
fn get_ai_token_balance(user: Principal) -> u64 {
    STATE.with(|state| {
        state.borrow().icrc_token_balances.get(&user).copied().unwrap_or(0)
    })
}

#[ic_cdk::update]
fn mint_ai_tokens(user: Principal, amount: u64) -> Result<String, String> {
    let caller = ic_cdk::caller();
    if !ic_cdk::api::is_controller(&caller) {
        return Err("Only controllers can mint tokens".to_string());
    }
    
    STATE.with(|state| {
        let mut state = state.borrow_mut();
        let current = state.icrc_token_balances.get(&user).copied().unwrap_or(0);
        state.icrc_token_balances.insert(user, current + amount);
    });
    
    Ok(format!("Minted {} AI tokens for user", amount))
}

#[ic_cdk::update]
async fn icp_ai_prompt(
    prompt_text: String,
    provider: Option<String>,
    assistant_type: Option<String>,
    store_on_chain: Option<bool>,
) -> Result<String, String> {
    let caller = ic_cdk::caller();
    
    // Calculate cycles cost
    let cycles_cost = calculate_cycles_cost(&prompt_text, &provider);
    
    // Check user cycles balance
    let user_cycles = STATE.with(|state| {
        state.borrow().user_cycles_balance.get(&caller).copied().unwrap_or(0)
    });
    
    if user_cycles < cycles_cost {
        // If no cycles, fall back to original prompt function for free usage
        return prompt(prompt_text).await;
    }
    
    // Get API key for provider
    let api_key = STATE.with(|state| {
        let state = state.borrow();
        let default_provider = "gemini".to_string();
        let provider_name = provider.as_ref().unwrap_or(&default_provider);
        state.api_keys.get(provider_name).cloned().unwrap_or_else(|| state.api_key.clone())
    });
    
    if api_key.is_empty() {
        return Err("API key is not set for the selected provider".to_string());
    }
    
    // Enhanced prompt with ICP context
    let enhanced_prompt = format!(
        "User Principal: {}\nAssistant Type: {}\nQuery: {}",
        caller.to_text(),
        assistant_type.unwrap_or_else(|| "casual".to_string()),
        prompt_text
    );
    
    // Call original Gemini API logic
    let response = call_gemini_api(enhanced_prompt, api_key).await?;
    
    // Deduct cycles and update state
    STATE.with(|state| {
        let mut state = state.borrow_mut();
        
        // Deduct cycles
        let remaining_cycles = user_cycles - cycles_cost;
        state.user_cycles_balance.insert(caller, remaining_cycles);
        
        // Store conversation with enhanced metadata
        let conversation = state.conversations.entry(caller).or_insert_with(Vec::new);
        conversation.push(ChatMessage {
            role: "assistant".to_string(),
            content: response.clone(),
            timestamp: ic_cdk::api::time(),
            provider: provider.unwrap_or_else(|| "gemini".to_string()),
            cycles_cost: Some(cycles_cost),
            content_stored_on_chain: store_on_chain,
            content_hash: None,
            ii_verified: Some(true),
        });
        
        // Update metrics
        state.canister_metrics.total_queries += 1;
        state.canister_metrics.total_cycles_consumed += cycles_cost;
    });
    
    // Optionally store response on-chain
    if store_on_chain.unwrap_or(false) {
        let _ = store_ai_content_internal(response.clone(), "ai_response".to_string(), AccessLevel::Private, caller);
    }
    
    Ok(response)
}

async fn call_gemini_api(prompt: String, api_key: String) -> Result<String, String> {
    let url = format!(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key={}",
        api_key
    );

    let request_body = GeminiRequest {
        contents: vec![Content {
            parts: vec![Part { text: prompt }],
        }],
    };

    let request_body_bytes = serde_json::to_vec(&request_body)
        .map_err(|e| format!("Serialization error: {}", e))?;

    let request = CanisterHttpRequestArgument {
        url,
        method: HttpMethod::POST,
        body: Some(request_body_bytes),
        max_response_bytes: Some(16384),
        transform: None,
        headers: vec![
            HttpHeader {
                name: "Content-Type".to_string(),
                value: "application/json".to_string(),
            },
        ],
    };

    match http_request(request, 20_000_000_000).await {
        Ok((response,)) => {
            if response.status >= Nat::from(200u32) && response.status < Nat::from(300u32) {
                let response_body: GeminiResponse = serde_json::from_slice(&response.body)
                    .map_err(|e| format!("Failed to parse response: {}", e))?;

                if let Some(candidate) = response_body.candidates.get(0) {
                    if let Some(part) = candidate.content.parts.get(0) {
                        return Ok(part.text.clone());
                    }
                }
                Err("No content found in Gemini response".to_string())
            } else {
                Err(format!(
                    "API call failed with status {}: {}",
                    response.status,
                    String::from_utf8_lossy(&response.body)
                ))
            }
        }
        Err((code, msg)) => Err(format!("HTTP request failed: {:?} {}", code, msg)),
    }
}

#[ic_cdk::update]
fn store_ai_content(
    content: String,
    content_type: String,
    access_level: AccessLevel,
) -> Result<String, String> {
    let caller = ic_cdk::caller();
    store_ai_content_internal(content, content_type, access_level, caller)
}

fn store_ai_content_internal(
    content: String,
    content_type: String,
    access_level: AccessLevel,
    creator: Principal,
) -> Result<String, String> {
    let size_bytes = content.len() as u64;
    let storage_cost = calculate_storage_cost(size_bytes);
    
    let user_cycles = STATE.with(|state| {
        state.borrow().user_cycles_balance.get(&creator).copied().unwrap_or(0)
    });
    
    if user_cycles < storage_cost {
        return Err(format!("Insufficient cycles. Need {} cycles for storage", storage_cost));
    }
    
    let content_id = format!("ai_content_{}_{}", creator.to_text(), ic_cdk::api::time());
    
    STATE.with(|state| {
        let mut state = state.borrow_mut();
        
        // Deduct cycles
        let remaining_cycles = user_cycles - storage_cost;
        state.user_cycles_balance.insert(creator, remaining_cycles);
        
        // Store content
        state.ai_content_storage.insert(content_id.clone(), AIContent {
            content,
            content_type,
            creator,
            created_at: ic_cdk::api::time(),
            size_bytes,
            access_level,
            cycles_cost_to_create: storage_cost,
        });
        
        state.canister_metrics.storage_used_bytes += size_bytes;
    });
    
    Ok(content_id)
}

#[ic_cdk::query]
fn get_stored_content(content_id: String) -> Result<AIContent, String> {
    let caller = ic_cdk::caller();
    
    STATE.with(|state| {
        let state = state.borrow();
        match state.ai_content_storage.get(&content_id) {
            Some(content) => {
                match &content.access_level {
                    AccessLevel::Public => Ok(content.clone()),
                    AccessLevel::Private => {
                        if content.creator == caller {
                            Ok(content.clone())
                        } else {
                            Err("Private content - access denied".to_string())
                        }
                    },
                    AccessLevel::Community => {
                        let token_balance = state.icrc_token_balances.get(&caller).copied().unwrap_or(0);
                        if token_balance > 0 {
                            Ok(content.clone())
                        } else {
                            Err("Community content requires AI tokens".to_string())
                        }
                    },
                    AccessLevel::Premium => {
                        if state.subscription_tiers.contains_key(&caller) {
                            Ok(content.clone())
                        } else {
                            Err("Premium content requires subscription".to_string())
                        }
                    }
                }
            },
            None => Err("Content not found".to_string())
        }
    })
}

#[ic_cdk::query]
fn get_user_dashboard(user: Principal) -> Result<UserDashboard, String> {
    let caller = ic_cdk::caller();
    if caller != user && !ic_cdk::api::is_controller(&caller) {
        return Err("Unauthorized".to_string());
    }
    
    STATE.with(|state| {
        let state = state.borrow();
        Ok(UserDashboard {
            cycles_balance: state.user_cycles_balance.get(&user).copied().unwrap_or(0),
            token_balance: state.icrc_token_balances.get(&user).copied().unwrap_or(0),
            conversation_count: state.conversations.get(&user).map(|c| c.len() as u64).unwrap_or(0),
            stored_content_count: state.ai_content_storage.values()
                .filter(|content| content.creator == user)
                .count() as u64,
            subscription_tier: state.subscription_tiers.get(&user).cloned(),
            total_cycles_spent: state.conversations.get(&user)
                .map(|msgs| msgs.iter().filter_map(|m| m.cycles_cost).sum())
                .unwrap_or(0),
        })
    })
}

#[ic_cdk::update]
fn create_sns_proposal(
    title: String,
    description: String,
    proposal_type: SNSProposalType,
) -> Result<u64, String> {
    let caller = ic_cdk::caller();
    
    let token_balance = STATE.with(|state| {
        state.borrow().icrc_token_balances.get(&caller).copied().unwrap_or(0)
    });
    
    if token_balance < 1000 {
        return Err("Need at least 1000 AI tokens to create proposals".to_string());
    }
    
    STATE.with(|state| {
        let mut state = state.borrow_mut();
        let proposal_id = state.sns_proposals.len() as u64;
        let current_time = ic_cdk::api::time();
        
        state.sns_proposals.push(SNSProposal {
            id: proposal_id,
            proposer: caller,
            title,
            description,
            proposal_type,
            votes_for: 0,
            votes_against: 0,
            total_voting_power: 0,
            deadline: current_time + (7 * 24 * 60 * 60 * 1_000_000_000),
            executed: false,
            created_at: current_time,
        });
        
        Ok(proposal_id)
    })
}

#[ic_cdk::update]
fn vote_sns_proposal(proposal_id: u64, vote_for: bool) -> Result<String, String> {
    let caller = ic_cdk::caller();
    
    STATE.with(|state| {
        let mut state = state.borrow_mut();
        
        if proposal_id >= state.sns_proposals.len() as u64 {
            return Err("Proposal not found".to_string());
        }
        
        let voting_power = state.icrc_token_balances.get(&caller).copied().unwrap_or(0);
        if voting_power == 0 {
            return Err("No voting power - need AI tokens".to_string());
        }
        
        let proposal = &mut state.sns_proposals[proposal_id as usize];
        
        if ic_cdk::api::time() > proposal.deadline {
            return Err("Voting period has ended".to_string());
        }
        
        if vote_for {
            proposal.votes_for += voting_power;
        } else {
            proposal.votes_against += voting_power;
        }
        proposal.total_voting_power += voting_power;
        
        Ok("Vote recorded".to_string())
    })
}

#[ic_cdk::query]
fn get_available_providers() -> Vec<String> {
    STATE.with(|state| {
        state.borrow().api_keys.keys().cloned().collect()
    })
}

#[ic_cdk::query]
fn get_sns_proposals() -> Vec<SNSProposal> {
    STATE.with(|state| state.borrow().sns_proposals.clone())
}

#[ic_cdk::query]
fn get_canister_metrics() -> CanisterMetrics {
    STATE.with(|state| state.borrow().canister_metrics.clone())
}

// Helper functions
fn calculate_cycles_cost(prompt: &str, provider: &Option<String>) -> u64 {
    let base_cost = (prompt.len() as u64) * 1000; // 1000 cycles per character
    let provider_multiplier = match provider.as_ref().map(|s| s.as_str()) {
        Some("openai") => 2,
        Some("anthropic") => 3,
        _ => 1, // Gemini default
    };
    base_cost * provider_multiplier
}

fn calculate_storage_cost(size_bytes: u64) -> u64 {
    size_bytes * 100 // 100 cycles per byte
}

ic_cdk::export_candid!();