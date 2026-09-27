import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);

// This sandbox's network is allowlisted and blocks remotion.media, so
// Remotion can't download its own headless Chrome shell. A Playwright
// Chromium build already exists on this machine — point Remotion at it
// instead of downloading. On another machine without this exact path,
// unset this or point it at wherever Chrome/Chromium is installed there.
if (process.env.REMOTION_BROWSER_EXECUTABLE) {
  Config.setBrowserExecutable(process.env.REMOTION_BROWSER_EXECUTABLE);
}
