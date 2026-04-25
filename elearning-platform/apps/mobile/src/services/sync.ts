import NetInfo from "@react-native-community/netinfo";

import { getPendingProgressMutations, markProgressMutationSynced } from "../storage/encryptedDb";
import { pushProgressCheckpoint } from "./api";


export async function flushProgressQueue(tenantId: string, accessToken: string) {
  const state = await NetInfo.fetch();
  if (!state.isConnected) {
    return { flushed: 0, skipped: true };
  }

  const pending = await getPendingProgressMutations();
  let flushed = 0;
  for (const item of pending) {
    await pushProgressCheckpoint(tenantId, accessToken, item.payload);
    await markProgressMutationSynced(item.id);
    flushed += 1;
  }
  return { flushed, skipped: false };
}
