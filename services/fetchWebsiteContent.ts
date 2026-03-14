import axios from "axios";

export async function fetchWebsiteContent(url: string): Promise<string> {
  const { data: html } = await axios.get<string>(url, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; SidleBot/1.0)" },
  });
  return html;
}
