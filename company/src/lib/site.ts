const whatsappNumber =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "6282225572581";

const whatsappMessage =
  "Halo Tim TrustLens, saya tertarik untuk mengetahui lebih lanjut mengenai peluang investasi atau kerja sama strategis dengan TrustLens. Boleh kita menjadwalkan diskusi singkat?";

export const siteConfig = {
  name: "TrustLens",
  shortDescription:
    "Platform fraud intelligence real-time berbasis Graph Neural Network dan Federated Learning.",

  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",

  productDemoUrl:
    process.env.NEXT_PUBLIC_PRODUCT_DEMO_URL ??
    "https://trustlens-one.vercel.app",

  whatsappNumber,
  whatsappMessage,

  whatsappUrl: `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    whatsappMessage,
  )}`,

  navigation: [
    {
      label: "Masalah",
      href: "#masalah",
    },
    {
      label: "Solusi",
      href: "#solusi",
    },
    {
      label: "Teknologi",
      href: "#teknologi",
    },
    {
      label: "Produk",
      href: "#produk",
    },
    {
      label: "Investor",
      href: "#investasi",
    },
  ],
} as const;