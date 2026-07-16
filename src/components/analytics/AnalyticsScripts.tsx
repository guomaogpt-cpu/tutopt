import Script from "next/script";

function readAnalyticsEnv(name: "NEXT_PUBLIC_GA_ID" | "NEXT_PUBLIC_YANDEX_METRIKA_ID"): string | null {
  const value = process.env[name]?.trim();
  return value ? value : null;
}

export function AnalyticsScripts() {
  const gaId = readAnalyticsEnv("NEXT_PUBLIC_GA_ID");
  const metrikaId = readAnalyticsEnv("NEXT_PUBLIC_YANDEX_METRIKA_ID");

  if (!gaId && !metrikaId) {
    return null;
  }

  return (
    <>
      {gaId ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}');
            `}
          </Script>
        </>
      ) : null}

      {metrikaId ? (
        <Script id="yandex-metrika" strategy="afterInteractive">
          {`
            (function(m,e,t,r,i,k,a){
              m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
              m[i].l=1*new Date();
              for (var j = 0; j < document.scripts.length; j++) {
                if (document.scripts[j].src === r) { return; }
              }
              k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
            })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
            ym(${metrikaId}, "init", {
              clickmap: true,
              trackLinks: true,
              accurateTrackBounce: true
            });
          `}
        </Script>
      ) : null}
    </>
  );
}
