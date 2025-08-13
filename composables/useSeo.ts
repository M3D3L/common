export function createSeoObject({
  title,
  summary,
  imageUri,
  pubDate,
  byline,
  tags = '',
  siteName = '',
  twitterSite = '',
  twitterCreator = '',
  ogUrl = 'test.com',
  page = '1',
  titleLimit = true,
  hideSiteName = false,
}) {
  const pageTitleSuffix =
    page && unref(page) !== '1' ? ` - Page ${unref(page)}` : '';

  const full = `${unref(title)}${pageTitleSuffix}${hideSiteName ? '' : ` | ${siteName}`}`

  const siteNameAppendix = hideSiteName ? '' : ` | ${siteName}`;

  const finalTitle =
    unref(titleLimit) && full.length > 60
      ? `${unref(title).substring(0, 60 - pageTitleSuffix.length - siteName.length - 3)}${pageTitleSuffix}${siteNameAppendix}`
      : full;

  // Improved URL handling
  const rawUrl = ogUrl ? unref(ogUrl) : useRequestURL().href;
  const canonicalUrl = rawUrl.split('?')[0];

  const secureUrl = canonicalUrl.replace('http:', 'https:');

  const meta = [
    {
      hid: 'description',
      name: 'description',
      content: unref(summary) || '',
    },
    {
      hid: 'og:title',
      property: 'og:title',
      content: finalTitle,
    },
    {
      hid: 'og:image:alt',
      property: 'og:image:alt',
      content: `An image related to ${unref(title)}`,
    },
    {
      hid: 'og:description',
      property: 'og:description',
      content: unref(summary) || '',
    },
    {
      hid: 'og:site_name',
      property: 'og:site_name',
      content: siteName,
    },
    {
      hid: 'og:type',
      property: 'og:type',
      content: 'article',
    },
    {
      hid: 'twitter:title',
      name: 'twitter:title',
      content: finalTitle,
    },
    {
      hid: 'twitter:description',
      name: 'twitter:description',
      content: unref(summary) || '',
    },
    {
      hid: 'twitter:card',
      name: 'twitter:card',
      content: 'summary_large_image',
    },
    {
      hid: 'twitter:site',
      name: 'twitter:site',
      content: unref(twitterSite),
    },
    {
      hid: 'twitter:creator',
      name: 'twitter:creator',
      content: unref(twitterCreator) || unref(twitterSite),
    },
    {
      hid: 'og:url',
      property: 'og:url',
      content: secureUrl,
    },
    {
      hid: 'og:locale',
      property: 'og:locale',
      content: 'en_US',
    },
    {
      hid: 'sailthru.title',
      name: 'sailthru.title',
      content: finalTitle,
    },
    {
      hid: 'sailthru.description',
      name: 'sailthru.description',
      content: unref(summary) || '',
    },
  ];

  if (imageUri) {
    const imageUrl = unref(imageUri);
    meta.push(
      {
        hid: 'og:image',
        property: 'og:image',
        content: imageUrl,
      },
      {
        hid: 'og:image:width',
        property: 'og:image:width',
        content: '1200',
      },
      {
        hid: 'og:image:height',
        property: 'og:image:height',
        content: '627',
      },
      {
        hid: 'twitter:image',
        name: 'twitter:image',
        content: imageUrl,
      },
      {
        hid: 'sailthru.image.full',
        name: 'sailthru.image.full',
        content: imageUrl,
      },
      {
        hid: 'sailthru.image.thumb',
        name: 'sailthru.image.thumb',
        content: imageUrl,
      }
    );
  }

  if (pubDate) {
    meta.push({
      hid: 'sailthru.date',
      name: 'sailthru.date',
      content: unref(pubDate),
    });
  }

  if (byline) {
    meta.push({
      hid: 'sailthru.author',
      name: 'sailthru.author',
      content: unref(byline),
    });
  }

  if (tags) {
    meta.push({
      hid: 'sailthru.tags',
      name: 'sailthru.tags',
      content: unref(tags),
    });
  }

  return {
    title: finalTitle,
    meta,
    link: [
      {
        rel: 'canonical',
        href: secureUrl,
      },
    ],
  };
}