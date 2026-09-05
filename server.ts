import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

// Allow JSON body up to 20MB for slip image uploads
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

// Lazy init Gemini client
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({ apiKey });
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Slip OCR Endpoint using Gemini 2.5 Flash Vision
app.post("/api/ocr-slip", async (req, res) => {
  try {
    const { imageBase64, mimeType = "image/jpeg" } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: "Missing imageBase64 data in request body" });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({
        error: "GEMINI_API_KEY is not configured in server environment. Please set GEMINI_API_KEY in Secrets.",
      });
    }

    // Clean base64 string
    const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z0-9+]+;base64,/, "");

    const prompt = `คุณคือผู้เชี่ยวชาญด้านการตรวจสอบและอ่านสลิปการโอนเงินธนาคารของประเทศไทย (Thai Bank Transfer Slip OCR)
โปรดวิเคราะห์รูปสลิปนี้และดึงข้อมูลออกมาในรูปแบบ JSON เท่านั้น โดยมีโครงสร้างดังนี้:
{
  "amount": <ตัวเลขจำนวนเงินที่โอน เช่น 13000 หรือ 50000 เป็น number เท่านั้น ไม่มีลูกน้ำ>,
  "transferDate": "<วันที่โอนในรูปแบบ YYYY-MM-DD หากระบุปี พ.ศ. ให้แปลงเป็น ค.ศ. เช่น 2024-05-15>",
  "transferTime": "<เวลาที่โอน เช่น 14:35:12 หรือ null>",
  "bankName": "<ชื่อธนาคาร เช่น กสิกรไทย, ไทยพาณิชย์, กรุงไทย, กรุงเทพ, ttb หรือ PromptPay>",
  "senderName": "<ชื่อผู้โอน เช่น ทพ. สมชาย หรือ นาย... หรือ null>",
  "receiverName": "<ชื่อผู้รับเงิน หรือ ธนาคาร/ไฟแนนซ์ผู้รับ เช่น ธนาคารเกียรตินาคิน, ธนชาต, Geely leasing หรือชื่อบุคคล>",
  "transactionId": "<รหัสอ้างอิงการทำรายการ / Transaction ID / Ref. No.>",
  "memo": "<บันทึกช่วยจำ เช่น ผ่อนค่างวด Geely EX5 ค่างวดที่...>",
  "isValidSlip": <true หากเป็นสลิปโอนเงินจริง, false หากไม่ใช่>,
  "summary": "<สรุปสั้นๆ ภาษาไทย เช่น สลิปโอนเงิน 13,000 บาท เมื่อ 15 พ.ค. 2024 สำเร็จ>"
}
ตอบกลับด้วย JSON เท่านั้น อย่าใส่ backticks หรือ markdown text นอกเหนือจาก JSON object`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                data: cleanBase64,
                mimeType: mimeType || "image/jpeg",
              },
            },
            {
              text: prompt,
            },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
      },
    });

    const responseText = response.text?.trim() || "{}";
    let parsedData = {};
    try {
      parsedData = JSON.parse(responseText);
    } catch {
      // Clean possible markdown code fence
      const sanitized = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
      parsedData = JSON.parse(sanitized);
    }

    return res.json({
      success: true,
      data: parsedData,
    });
  } catch (error: any) {
    console.error("Error processing slip OCR:", error);
    return res.status(500).json({
      error: error?.message || "Failed to process slip with Gemini OCR",
    });
  }
});

// Setup server and Vite middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Geely EX5 Loan Tracker server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
