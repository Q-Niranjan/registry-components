import { NextResponse } from "next/server";
const FASTAPI_URL = "http://localhost:8000/data";

export async function GET() {
  try {
    const response = await fetch(FASTAPI_URL, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });

    if (!response.ok) {
      throw new Error("FastAPI fetch failed");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Unable to fetch data from FastAPI" },
      { status: 500 }
    );
  }
}
