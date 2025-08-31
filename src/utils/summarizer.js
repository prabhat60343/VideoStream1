import { HfInference } from "@huggingface/inference";

const hf = new HfInference(process.env.HF_API_KEY);

export async function summarizeText(text) {
    try {
        if (!text || text.length < 20) {
            return "Description too short for summarization.";
        }

        const result = await hf.summarization({
            model: "facebook/bart-large-cnn",
            inputs: text,
            parameters: { max_length: 50, min_length: 5 } // smaller limits
        });

        return result.summary_text || "Summary unavailable";
    } catch (err) {
        console.error("Summarization error:", err);
        return "Error generating summary";
    }
}
