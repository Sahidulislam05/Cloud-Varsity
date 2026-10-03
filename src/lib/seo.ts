import type { Metadata } from "next";

const SITE_NAME = "CloudVarsity";

type SeoInput = {
  title: string;
  description: string;
  path: string;
  absoluteTitle?: boolean;
};

export function createMetadata({
  title,
  description,
  path,
  absoluteTitle = false,
}: SeoInput): Metadata {
  const fullTitle = absoluteTitle ? title : `${title} | ${SITE_NAME}`;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: fullTitle,
      description,
      url: path,
      siteName: SITE_NAME,
      type: "website",
    },
    twitter: { card: "summary", title: fullTitle, description },
  };
}
