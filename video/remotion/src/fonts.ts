// Centralized typography — every scene imports `fontFamily` from here
// instead of hardcoding a font stack, so the whole video renders with one
// real, loaded font (not whatever happens to be on the rendering machine).
//
// Loaded from a local file in assets/fonts/ rather than Google's CDN
// (@remotion/google-fonts): this sandbox's proxy does TLS interception
// that the render browser doesn't trust for fonts.gstatic.com, and more
// importantly, a local font renders identically offline and on any
// machine — no CDN dependency at render time.
import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

export const fontFamily = "Inter";

loadFont({
  family: fontFamily,
  url: staticFile("fonts/Inter-SemiBold.woff2"),
  weight: "600",
});
