let cachedAccessToken: { token: string; expiresAt: number} | null = null;

export const getFreshAccessToken = async () => {
  const now = Date.now();

  if (cachedAccessToken && now < cachedAccessToken.expiresAt) {
    return cachedAccessToken.token;
  }

  const refreshToken = process.env.MY_GOOGLE_REFRESH_TOKEN!;
  const clientId = process.env.GOOGLE_CLIENT_ID!;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET!;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });

  if (!res.ok) {
    const error = await res.json();
    if (error.error === "invalid_grant") {
      throw new Error("認証情報が無効です。再認証が必要です。[https://your-site.com/api/oauth/start]こちらのURLをブラウザに入れて再取得してください");
    }
    throw new Error("アクセストークンの取得に失敗しました。")
  }

  const data = await res.json();
  const token = data.access_token as string;
  const expiresIn = data.expires_in as number;
  cachedAccessToken = {
    token,
    expiresAt: now + (expiresIn - 60) * 1000,
  }

  return token;
};
