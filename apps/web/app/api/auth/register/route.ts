import { API_URL } from "@/utils/constants";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    const nextRes = NextResponse.json(data, { status: response.status });

    const setCookie = response.headers.get("set-cookie");
    if (setCookie) {
      nextRes.headers.set("Set-Cookie", setCookie);
    }
    return nextRes;
  } catch {
    return NextResponse.json(
      { error: "Failed to register user" },
      { status: 500 },
    );
  }
}
