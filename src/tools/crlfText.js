const USER_PLATFORM_INFO = (
  navigator.userAgentData?.platform || navigator.platform
)?.toLowerCase();

const checkPlatform = (info) => {
  if (info.startsWith("win")) return "win";
  if (info.startsWith("mac")) return "mac";
  if (info.startsWith("linux")) return "linux";
  return "unknown";
};

const platform = checkPlatform(USER_PLATFORM_INFO);

export const setCRLF = (content) => {
  if (platform === "mac") {
    const text = content.replaceAll("\r\n", "\r");
    console.log("mac crlf : ", text);
    return text.replaceAll("\n", "\r");
  } else {
    const text = content.replaceAll("\r\n", "\n");
    console.log("win crlf : ", text);
    return text.replaceAll("\r", "\n");
  }
};
