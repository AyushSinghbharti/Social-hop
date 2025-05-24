import { supabase } from "~/src/lib/supabase";

export async function sendLikeNotification(like) {
  // console.log(like);

  const { data } = await supabase
    .from("likes")
    .select("*, posts(*, profiles(*))")
    .eq("id", like.id)
    .single();
  // console.log(JSON.stringify(data, null, 2));

  const pushToken = data?.posts?.profiles?.push_token;
  console.log("pushToken at notifications.tsx\n", pushToken);
  if(!pushToken) return;

  const message = {
    to: pushToken,
    sound: "default",
    title: "Someone Liked your post",
    body: `${data?.posts?.profiles.username} liked your post!`,
    data: { postId: data.posts.id },
  };

  sendPushNotification(message);
}

async function sendPushNotification(message) {
  
    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
  }
