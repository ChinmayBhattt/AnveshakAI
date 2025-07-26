import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface AIContent {
  'creator' : Principal,
  'content' : string,
  'access_level' : AccessLevel,
  'size_bytes' : bigint,
  'content_type' : string,
  'created_at' : bigint,
  'cycles_cost_to_create' : bigint,
}
export type AccessLevel = { 'Premium' : null } |
  { 'Private' : null } |
  { 'Public' : null } |
  { 'Community' : null };
export interface CanisterMetrics {
  'storage_used_bytes' : bigint,
  'total_queries' : bigint,
  'total_users' : bigint,
  'uptime_start' : bigint,
  'total_cycles_consumed' : bigint,
}
export interface CyclesRates {
  'query_base_cost' : bigint,
  'storage_cost_per_kb' : bigint,
  'computation_multiplier' : number,
}
export type Result = { 'Ok' : bigint } |
  { 'Err' : string };
export type Result_1 = { 'Ok' : string } |
  { 'Err' : string };
export type Result_2 = { 'Ok' : AIContent } |
  { 'Err' : string };
export type Result_3 = { 'Ok' : UserDashboard } |
  { 'Err' : string };
export interface SNSProposal {
  'id' : bigint,
  'title' : string,
  'description' : string,
  'deadline' : bigint,
  'created_at' : bigint,
  'proposer' : Principal,
  'votes_for' : bigint,
  'total_voting_power' : bigint,
  'executed' : boolean,
  'proposal_type' : SNSProposalType,
  'votes_against' : bigint,
}
export type SNSProposalType = {
    'SystemPromptUpdate' : { 'prompt_name' : string, 'new_prompt' : string }
  } |
  { 'UpdateCyclesRates' : { 'new_rates' : CyclesRates } } |
  { 'TreasuryManagement' : { 'action' : string, 'amount' : bigint } } |
  { 'AddAIProvider' : { 'provider_name' : string, 'api_endpoint' : string } };
export type SubscriptionTier = {
    'Premium' : { 'cycles_included' : bigint, 'priority_access' : boolean }
  } |
  {
    'Enterprise' : {
      'cycles_included' : bigint,
      'private_models' : boolean,
      'custom_endpoints' : boolean,
    }
  } |
  { 'Basic' : { 'cycles_included' : bigint } };
export interface UserDashboard {
  'cycles_balance' : bigint,
  'total_cycles_spent' : bigint,
  'stored_content_count' : bigint,
  'subscription_tier' : [] | [SubscriptionTier],
  'token_balance' : bigint,
  'conversation_count' : bigint,
}
export interface _SERVICE {
  'create_sns_proposal' : ActorMethod<
    [string, string, SNSProposalType],
    Result
  >,
  'deposit_user_cycles' : ActorMethod<[Principal], Result_1>,
  'get_ai_token_balance' : ActorMethod<[Principal], bigint>,
  'get_available_providers' : ActorMethod<[], Array<string>>,
  'get_canister_metrics' : ActorMethod<[], CanisterMetrics>,
  'get_sns_proposals' : ActorMethod<[], Array<SNSProposal>>,
  'get_stored_content' : ActorMethod<[string], Result_2>,
  'get_user_cycles_balance' : ActorMethod<[Principal], bigint>,
  'get_user_dashboard' : ActorMethod<[Principal], Result_3>,
  'greet' : ActorMethod<[string], string>,
  'icp_ai_prompt' : ActorMethod<
    [string, [] | [string], [] | [string], [] | [boolean]],
    Result_1
  >,
  'mint_ai_tokens' : ActorMethod<[Principal, bigint], Result_1>,
  'prompt' : ActorMethod<[string], Result_1>,
  'set_api_key' : ActorMethod<[string], undefined>,
  'set_provider_api_key' : ActorMethod<[string, string], undefined>,
  'store_ai_content' : ActorMethod<[string, string, AccessLevel], Result_1>,
  'vote_sns_proposal' : ActorMethod<[bigint, boolean], Result_1>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
