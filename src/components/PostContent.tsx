import {
  useWindowDimensions,
} from "react-native";
import React from "react";
import { AdvancedImage} from "cloudinary-react-native";
import { thumbnail, scale } from "@cloudinary/url-gen/actions/resize";
import { cld } from "~/src/lib/cloudinary";
import { Video, ResizeMode } from "expo-av";
import Interface from "~/assets/data/interface";

export default function PostContent({ post } : {post: Interface}) {
  const { width } = useWindowDimensions();

  if (post.media_type === "image") {
    const image = cld.image(post.image);
    image.resize(thumbnail().width(width).height(width));
    return (
      <AdvancedImage cldImg={image} className="w-full aspect-square mt-2" />
    );
  } else {
    const video = cld.video(post.image);
    video.resize(scale().width(width));
    return (
      <Video
        style={{ width: "100%", aspectRatio: 1 }}
        source={{ uri: video.toURL() }}
        useNativeControls
        resizeMode={ResizeMode.CONTAIN}
        isLooping
      />
    );
  }
}
