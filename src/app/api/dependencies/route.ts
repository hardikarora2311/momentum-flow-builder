import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const flow = searchParams.get("flow");

  const dependencies = [
    "ProxyConfig.load_team_config",
    "parse_cache_control",
    "select_data_generator",
    "ProxyLogging.during_call_hook",
    "ProxyLogging.post_call_failure_hook",
    "ProxyLogging.post_call_success_hook",
    "ProxyLogging.pre_call_hook",
    "_is_valid_team_configs",
    "_read_request_body",
    "ProxyConfig.get_config",
    "async_data_generator",
    "ProxyLogging.alerting_handler",
    "print_verbose",
    "update_spend",
  ];

  return NextResponse.json(dependencies);
}
