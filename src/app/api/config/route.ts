import { Configuration } from "@/types";
import { NextResponse } from "next/server";

let configurations: { [key: string]: Configuration } = {};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const flow = searchParams.get("flow");

  return NextResponse.json(
    configurations[flow!] || {
      flow: flow,
      entities_to_mock: [],
      is_db_mocked: false,
      db_config: {
        username: "",
        password: "",
      },
    }
  );
}

export async function POST(request: Request) {
  const config: Configuration = await request.json();
  configurations[config.flow] = config;
  return NextResponse.json({ success: true });
}
