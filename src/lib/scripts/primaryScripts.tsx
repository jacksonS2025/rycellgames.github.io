'use client'
import { GoogleAnalytics } from '@next/third-parties/google'
import Script from 'next/script'
export default function PrimaryScripts() {
    return (
        <>
            {
                process.env.NODE_ENV == "production" ?
                    <>
                        <Script defer src="https://cloud.umami.is/script.js" data-website-id="56d5663b-96f8-4cc8-9a00-7016cc30a9f8" strategy='afterInteractive'></Script>
                        <Script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "46c80f28914946c984176d3e1a314971"}' strategy='afterInteractive'></Script>
                        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-GYCV526F5B" strategy='afterInteractive'></Script>
                        <Script id="google-analytics" strategy='afterInteractive'>
                            {
                                `                                window.dataLayer = window.dataLayer || [];
                                function gtag() { dataLayer.push(arguments); }
                                gtag('js', new Date());

                                gtag('config', 'G-GYCV526F5B');`
                            }
                        </Script>
                    </> : null}
            <Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9758035810696915"
                            crossOrigin="anonymous" strategy='afterInteractive'></Script>

        </>
    )
}