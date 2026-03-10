import createImageUrlBuilder, { type SanityImageSource } from "@sanity/image-url";
import { client } from "./client";

const builder = client ? createImageUrlBuilder(client) : null;

export function urlFor(source: SanityImageSource) {
  if (!builder) {
    return null;
  }

  return builder.image(source);
}
