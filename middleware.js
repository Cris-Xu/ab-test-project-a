import { NextResponse, NextRequest } from "next/server";

const SPLIT_RATE = 0.5;

// This function can be marked `async` if using `await` inside
function middleware(request) {
  console.log("nextUrl", request.nextUrl);
  const abTestCookie = request.cookies.get("abTest")?.value;
  console.log("abTestCookie", abTestCookie);

  const randomNumber = Math.random();

  const queryB = request.nextUrl.search?.includes("abTest=b");

  let version = "";

  if (abTestCookie === "b" || queryB) {
    version = "b";
  }

  if (!version) {
    // AB测试分流, 随机分50%的流量
    const abTest = randomNumber < SPLIT_RATE;
    version = abTest ? "a" : "b";
  }

  if (version === "b") {
    return NextResponse.rewrite(
      new URL(
        `https://ab-test-project-b.netlify.app${request.nextUrl.pathname}`,
        request.url
      )
    );
  }

  return NextResponse.rewrite(new URL(request.nextUrl.pathname, request.url));
}

export default middleware;

export const config = {
  matcher: ["/", "/products/:path*"],
};
