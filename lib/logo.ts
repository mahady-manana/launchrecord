export const appLogo = ({
  logo,
  website,
}: {
  logo?: string;
  website?: string;
}) => {
  if (!logo && !website) {
    return "";
  }
  if (logo) {
    if (logo.includes("www.google.com")) {
      return logo + "&sz=64";
    }
    return logo;
  }
  if (!logo && website) {
    return "https://www.google.com/s2/favicons?sz=64&domain_url=" + website;
  }
  return "";
};
