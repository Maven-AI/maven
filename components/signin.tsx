import { signIn } from "@/auth";

export function SignIn() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("slack");
      }}
    >
      <button type="submit">Signin with Slack</button>
    </form>
  );
}