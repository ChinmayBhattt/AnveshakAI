export const idlFactory = ({ IDL }) => {
  const CyclesRates = IDL.Record({
    'query_base_cost' : IDL.Nat64,
    'storage_cost_per_kb' : IDL.Nat64,
    'computation_multiplier' : IDL.Float32,
  });
  const SNSProposalType = IDL.Variant({
    'SystemPromptUpdate' : IDL.Record({
      'prompt_name' : IDL.Text,
      'new_prompt' : IDL.Text,
    }),
    'UpdateCyclesRates' : IDL.Record({ 'new_rates' : CyclesRates }),
    'TreasuryManagement' : IDL.Record({
      'action' : IDL.Text,
      'amount' : IDL.Nat64,
    }),
    'AddAIProvider' : IDL.Record({
      'provider_name' : IDL.Text,
      'api_endpoint' : IDL.Text,
    }),
  });
  const Result = IDL.Variant({ 'Ok' : IDL.Nat64, 'Err' : IDL.Text });
  const Result_1 = IDL.Variant({ 'Ok' : IDL.Text, 'Err' : IDL.Text });
  const CanisterMetrics = IDL.Record({
    'storage_used_bytes' : IDL.Nat64,
    'total_queries' : IDL.Nat64,
    'total_users' : IDL.Nat64,
    'uptime_start' : IDL.Nat64,
    'total_cycles_consumed' : IDL.Nat64,
  });
  const SNSProposal = IDL.Record({
    'id' : IDL.Nat64,
    'title' : IDL.Text,
    'description' : IDL.Text,
    'deadline' : IDL.Nat64,
    'created_at' : IDL.Nat64,
    'proposer' : IDL.Principal,
    'votes_for' : IDL.Nat64,
    'total_voting_power' : IDL.Nat64,
    'executed' : IDL.Bool,
    'proposal_type' : SNSProposalType,
    'votes_against' : IDL.Nat64,
  });
  const AccessLevel = IDL.Variant({
    'Premium' : IDL.Null,
    'Private' : IDL.Null,
    'Public' : IDL.Null,
    'Community' : IDL.Null,
  });
  const AIContent = IDL.Record({
    'creator' : IDL.Principal,
    'content' : IDL.Text,
    'access_level' : AccessLevel,
    'size_bytes' : IDL.Nat64,
    'content_type' : IDL.Text,
    'created_at' : IDL.Nat64,
    'cycles_cost_to_create' : IDL.Nat64,
  });
  const Result_2 = IDL.Variant({ 'Ok' : AIContent, 'Err' : IDL.Text });
  const SubscriptionTier = IDL.Variant({
    'Premium' : IDL.Record({
      'cycles_included' : IDL.Nat64,
      'priority_access' : IDL.Bool,
    }),
    'Enterprise' : IDL.Record({
      'cycles_included' : IDL.Nat64,
      'private_models' : IDL.Bool,
      'custom_endpoints' : IDL.Bool,
    }),
    'Basic' : IDL.Record({ 'cycles_included' : IDL.Nat64 }),
  });
  const UserDashboard = IDL.Record({
    'cycles_balance' : IDL.Nat64,
    'total_cycles_spent' : IDL.Nat64,
    'stored_content_count' : IDL.Nat64,
    'subscription_tier' : IDL.Opt(SubscriptionTier),
    'token_balance' : IDL.Nat64,
    'conversation_count' : IDL.Nat64,
  });
  const Result_3 = IDL.Variant({ 'Ok' : UserDashboard, 'Err' : IDL.Text });
  return IDL.Service({
    'create_sns_proposal' : IDL.Func(
        [IDL.Text, IDL.Text, SNSProposalType],
        [Result],
        [],
      ),
    'deposit_user_cycles' : IDL.Func([IDL.Principal], [Result_1], []),
    'get_ai_token_balance' : IDL.Func([IDL.Principal], [IDL.Nat64], ['query']),
    'get_available_providers' : IDL.Func([], [IDL.Vec(IDL.Text)], ['query']),
    'get_canister_metrics' : IDL.Func([], [CanisterMetrics], ['query']),
    'get_sns_proposals' : IDL.Func([], [IDL.Vec(SNSProposal)], ['query']),
    'get_stored_content' : IDL.Func([IDL.Text], [Result_2], ['query']),
    'get_user_cycles_balance' : IDL.Func(
        [IDL.Principal],
        [IDL.Nat64],
        ['query'],
      ),
    'get_user_dashboard' : IDL.Func([IDL.Principal], [Result_3], ['query']),
    'greet' : IDL.Func([IDL.Text], [IDL.Text], ['query']),
    'icp_ai_prompt' : IDL.Func(
        [IDL.Text, IDL.Opt(IDL.Text), IDL.Opt(IDL.Text), IDL.Opt(IDL.Bool)],
        [Result_1],
        [],
      ),
    'mint_ai_tokens' : IDL.Func([IDL.Principal, IDL.Nat64], [Result_1], []),
    'prompt' : IDL.Func([IDL.Text], [Result_1], []),
    'set_api_key' : IDL.Func([IDL.Text], [], []),
    'set_provider_api_key' : IDL.Func([IDL.Text, IDL.Text], [], []),
    'store_ai_content' : IDL.Func(
        [IDL.Text, IDL.Text, AccessLevel],
        [Result_1],
        [],
      ),
    'vote_sns_proposal' : IDL.Func([IDL.Nat64, IDL.Bool], [Result_1], []),
  });
};
export const init = ({ IDL }) => { return []; };
