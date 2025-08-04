import { NextResponse, NextRequest } from "next/server";

const SPLIT_RATE = 0.5;

// This function can be marked `async` if using `await` inside
function middleware(request) {
  console.log("nextUrl", request.nextUrl);
  const abTestCookie = request.cookies.get("abTest");

  // AB测试分流, 随机分50%的流量
  const abTest = Math.random() < SPLIT_RATE;
  if (abTestCookie === "b" || abTest) {
    console.log("b project");
    return NextResponse.rewrite(
      new URL(
        `https://ab-test-project-b.netlify.app${request.nextUrl.pathname}?abTest=${abTest}`,
        request.url
      ),
      {
        request: {
          headers: {
            "Set-Cookie": "abTest=b",
          },
        },
      }
    );
  }

  console.log("a project");

  return NextResponse.rewrite(new URL(request.nextUrl.pathname, request.url), {
    request: {
      headers: {
        "Set-Cookie": "abTest=a",
      },
    },
  });
}

export default middleware;

export const config = {
  matcher: ["/", "/products/:path*"],
};
