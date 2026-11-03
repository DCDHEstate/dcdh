import LoginClient from "./LoginClient";

// The login form is also the signup page, and referral links point here. When a
// link carries a code, give WhatsApp's link preview an invitation rather than
// a generic "Sign In" card — that preview is what the recipient decides on.
export async function generateMetadata({ searchParams }) {
  const { ref } = await searchParams;
  if (!ref) return {};

  const title = "You're invited to DCDH Empire";
  const description =
    "Create your free account for zero-brokerage property search — rent, buy or list with verified owners.";
  return {
    title: { absolute: title },
    description,
    openGraph: { title, description },
    twitter: { title, description },
  };
}

export default function LoginPage() {
  return <LoginClient />;
}
