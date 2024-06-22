/* eslint-disable @next/next/no-img-element */
import { auth } from "@/auth";
import { SignIn } from "@/components/signin";
import { SignOut } from "@/components/signout";
import { Button } from "@/components/ui/button";
import { SlackSDK } from "@/utils/slack";
import Link from "next/link";

export default async function Home() {
  const session = await auth();
  if (!session)
    return (
      <div>
        You are signed out
        <SignIn />
      </div>
    );

  const channel = await SlackSDK.fetchDMChannels();
  const channelId = channel[0].id;
  const messages = await SlackSDK.fetchMessages(channelId);

  return (
    <main className="p-10">
      <div className="text-center text-2xl font-semibold">Maven</div>
      <SignOut />
      <div>{session.user?.name}</div>
      <img
        src={session.user?.image || ""}
        alt="avatar"
        width={128}
        height={128}
      />
      <div>Display all messages of a particular channel {channelId}</div>
      <div>
        {messages.map((m, index) => (
          <div key={index}>{m.text}</div>
        ))}
      </div>
      <Link href="/home">
        <Button>Go Home</Button>
      </Link>
    </main>
  );
}
