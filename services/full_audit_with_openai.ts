import { getOpenAIClient } from "@/lib/openai";
import { promptMasterGeneralAnalyze } from "./audit_system_prompt";
import { getWebsiteContent } from "./getWebsiteContent";
import { responsesFormatter } from "./responses_formatter";
import { user_prompt, UserPromptProduct } from "./user_prompt";

export const fullAuditWithOpenAI = async (
  data: Omit<UserPromptProduct, "websiteContent">,
) => {
  const client = getOpenAIClient();

  const webContent = await getWebsiteContent(data.website);
  const userContent = user_prompt({
    ...data,
    websiteContent: JSON.stringify(webContent, null, 2),
  });
  const auditResponse = await client.chat.completions.create({
    model: "gpt-4o-mini-search-preview",
    messages: [
      {
        role: "system",
        content: promptMasterGeneralAnalyze,
      },
      { role: "user", content: userContent },
    ],
  });

  const content = auditResponse.choices[0]?.message?.content;
  if (!content) {
    throw new Error("No formatted content returned from OpenAI");
  }
  const formatResponse = await client.chat.completions.create({
    model: "gpt-4.1-nano",
    messages: [
      {
        role: "system",
        content: responsesFormatter,
      },
      { role: "user", content: content },
    ],
    response_format: { type: "json_object" },
  });

  const formattedResponse = formatResponse.choices[0]?.message?.content;
  if (!formattedResponse) {
    throw new Error("No formatted content returned from OpenAI");
  }
  return formattedResponse;
};
