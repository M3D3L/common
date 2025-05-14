import { useRoute } from 'vue-router'

export function createSeoObject({
  title,
  summary,
  imageUri,
  pubDate,
  byline,
  tags = [],
  siteName = 'GuillermoMedel.com',
  twitterSite = '@gmedel',
  ogUrl = '',
  page = '1',
  baseUrl = process.server 
    ? process.env.NUXT_PUBLIC_SITE_URL || 'https://guillermomedel.com'
    : window.location.origin
}) {
  const route = useRoute()

  const pageTitleSuffix =
    page && unref(page) !== '1' ? ` - Page ${unref(page)}` : ''

  const full = `${unref(title)}${pageTitleSuffix} | ${siteName}`
  const finalTitle =
    full.length > 60
      ? `${unref(title).substring(0, 60 - pageTitleSuffix.length - siteName.length - 3)}${pageTitleSuffix} | ${siteName}`
      : full

  const cleanPath = route?.path.replace(/\/+/g, '/').replace(/([^/])$/, '$1/')
  const canonicalUrl = ogUrl || `${baseUrl.replace(/\/$/, '')}${cleanPath}`

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
      prefix: 'og: http://ogp.me/ns#',
    },
    {
      hid: 'og:description',
      property: 'og:description',
      content: unref(summary) || '',
      prefix: 'og: http://ogp.me/ns#',
    },
    {
      hid: 'og:site_name',
      property: 'og:site_name',
      content: siteName,
      prefix: 'og: http://ogp.me/ns#',
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
      hid: 'sailthru.title',
      name: 'sailthru.title',
      content: finalTitle,
    },
    {
      hid: 'sailthru.description',
      name: 'sailthru.description',
      content: unref(summary) || '',
    },
    {
      hid: 'og:url',
      property: 'og:url',
      content: canonicalUrl,
      prefix: 'og: http://ogp.me/ns#',
    }
  ]

  if (imageUri) {
    const imageUrl = unref(imageUri)
    meta.push(
      {
        hid: 'og:image',
        property: 'og:image',
        content: imageUrl,
        prefix: 'og: http://ogp.me/ns#',
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
      }
    )
  }

  if (pubDate) {
    meta.push({
      hid: 'sailthru.date',
      name: 'sailthru.date',
      content: unref(pubDate),
    })
  }

  if (byline) {
    meta.push({
      hid: 'sailthru.author',
      name: 'sailthru.author',
      content: unref(byline),
    })
  }

  if (unref(tags)?.length > 0) {
    meta.push({
      hid: 'sailthru.tags',
      name: 'sailthru.tags',
      content: unref(tags).join(','),
    })
  }

  return {
    title: finalTitle,
    meta,
    link: [
      {
        rel: 'canonical',
        href: canonicalUrl,
      },
    ],
  }
}
