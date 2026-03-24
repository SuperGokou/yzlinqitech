"use client";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ reset }: GlobalErrorProps) {
  return (
    <html lang="zh-CN">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a1020",
          color: "#e8ecf4",
          fontFamily: "system-ui, -apple-system, sans-serif",
          textAlign: "center",
          padding: "24px",
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            backgroundColor: "rgba(239, 68, 68, 0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 24,
            fontSize: 32,
          }}
        >
          !
        </div>
        <h1
          style={{
            fontSize: 24,
            fontWeight: 700,
            marginBottom: 12,
          }}
        >
          应用程序错误
        </h1>
        <p
          style={{
            fontSize: 14,
            color: "#8b95a8",
            marginBottom: 32,
            maxWidth: 400,
          }}
        >
          应用程序发生了意外错误。请刷新页面或稍后重试。
        </p>
        <button
          onClick={reset}
          style={{
            padding: "12px 32px",
            borderRadius: 12,
            border: "none",
            backgroundColor: "#00e5ff",
            color: "#0a1020",
            fontWeight: 600,
            fontSize: 14,
            cursor: "pointer",
          }}
        >
          重试
        </button>
      </body>
    </html>
  );
}
