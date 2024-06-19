import { SlackSDK } from "@/utils/slack";
import React from "react";

const page = async () => {
  const channels = await SlackSDK.fetchDMChannels();
  const channelId = channels[0].id;
  return <div>{channelId}</div>;
};

export default page;
