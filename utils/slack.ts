export const SLACK_TOKEN = process.env.NEXT_PUBLIC_SLACK_OAUTH_TOKEN!;

interface Channel {
  id: string;
  user: string;
}

interface Message {
  text: string;
  user: string;
}

class Slack {
  private static instance: Slack;
  private readonly bot_token: string;

  private constructor(token?: string) {
    console.log("SlackSDK initialized");
    this.bot_token = token || SLACK_TOKEN;
  }

  public static getInstance(): Slack {
    if (!Slack.instance) {
      Slack.instance = new Slack();
    }
    return Slack.instance;
  }

  public async fetchDMChannels(): Promise<Channel[]> {
    const url = "https://slack.com/api/conversations.list";

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${this.bot_token}`,
        },
      });

      const resp_data = await response.json();
      if (!resp_data.ok) {
        throw new Error(`Slack API error: ${resp_data.error}`);
      }

      const channels = resp_data.channels.map((channel: any) => ({
        id: channel.id,
        user: channel.user,
      }));

      console.log(channels.map((channel: any) => channel.id));
      return channels;
    } catch (error: any) {
      console.error("Error fetching DM channels:", error.message);
      return [];
    }
  }

  public async fetchMessages(channelId: string): Promise<Message[]> {
    const url = `https://slack.com/api/conversations.history?channel=${channelId}&limit=10&inclusive=true&oldest=0`;

    try {
      const params = new URLSearchParams();
      params.append("token", this.bot_token);
      params.append("channel", channelId);
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${this.bot_token}`,
        },
        body: params,
      });

      const resp_data = await response.json();
      if (!resp_data.ok) {
        throw new Error(`Slack API error: ${resp_data.error}`);
      }

      const messages = resp_data.messages.map((message: any) => ({
        text: message.text,
        user: message.user,
      }));

      return messages;
    } catch (error: any) {
      console.error(
        `Error fetching messages for channel ${channelId}:`,
        error.message
      );
      return [];
    }
  }
}

export const SlackSDK = Slack.getInstance();
