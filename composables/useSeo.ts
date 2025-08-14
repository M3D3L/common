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
  twitterCreator = '',
  ogUrl = '',
  page = '1',
  titleLimit = true,
  hideSiteName = false,
  baseUrl = process.server
    ? process.env.NUXT_PUBLIC_SITE_URL || 'https://guillermomedel.com'
    : window.location.origin
}) {
  const route = useRoute()

  // Page suffix
  const pageTitleSuffix = page && unref(page) !== '1' ? ` - Page ${unref(page)}` : ''
  const siteNameAppendix = hideSiteName ? '' : ` | ${siteName}`

  // Title handling
  const fullTitle = `${unref(title)}${pageTitleSuffix}${siteNameAppendix}`
  const finalTitle =
    unref(titleLimit) && fullTitle.length > 60
      ? `${unref(title).substring(0, 60 - pageTitleSuffix.length - siteName.length - 3)}${pageTitleSuffix}${siteNameAppendix}`
      : fullTitle

  // Canonical URL
  const cleanPath = route?.path.replace(/\/+/g, '/').replace(/([^/])$/, '$1/')
  const rawUrl = ogUrl || `${baseUrl.replace(/\/$/, '')}${cleanPath}`
  const canonicalUrl = rawUrl.split('?')[0].replace('http:', 'https:')

  const meta = [
    { hid: 'description', name: 'description', content: unref(summary) || '' },
    { hid: 'og:title', property: 'og:title', content: finalTitle, prefix: 'og: http://ogp.me/ns#' },
    { hid: 'og:description', property: 'og:description', content: unref(summary) || '', prefix: 'og: http://ogp.me/ns#' },
    { hid: 'og:site_name', property: 'og:site_name', content: siteName, prefix: 'og: http://ogp.me/ns#' },
    { hid: 'og:type', property: 'og:type', content: 'article' },
    { hid: 'twitter:title', name: 'twitter:title', content: finalTitle },
    { hid: 'twitter:description', name: 'twitter:description', content: unref(summary) || '' },
    { hid: 'twitter:card', name: 'twitter:card', content: 'summary_large_image' },
    { hid: 'twitter:site', name: 'twitter:site', content: unref(twitterSite) },
    { hid: 'twitter:creator', name: 'twitter:creator', content: unref(twitterCreator) || unref(twitterSite) },
    { hid: 'og:url', property: 'og:url', content: canonicalUrl, prefix: 'og: http://ogp.me/ns#' },
    { hid: 'og:locale', property: 'og:locale', content: 'en_US' },
    { hid: 'sailthru.title', name: 'sailthru.title', content: finalTitle },
    { hid: 'sailthru.description', name: 'sailthru.description', content: unref(summary) || '' }
  ]

  // Images
  if (imageUri) {
    const imageUrl = unref(imageUri)
    meta.push(
      { hid: 'og:image', property: 'og:image', content: imageUrl, prefix: 'og: http://ogp.me/ns#' },
      { hid: 'og:image:width', property: 'og:image:width', content: '1200' },
      { hid: 'og:image:height', property: 'og:image:height', content: '627' },
      { hid: 'og:image:alt', property: 'og:image:alt', content: `An image related to ${unref(title)}` },
      { hid: 'twitter:image', name: 'twitter:image', content: imageUrl },
      { hid: 'sailthru.image.full', name: 'sailthru.image.full', content: imageUrl },
      { hid: 'sailthru.image.thumb', name: 'sailthru.image.thumb', content: imageUrl }
    )
  }

  // Dates / Author / Tags
  if (pubDate) {
    meta.push({ hid: 'sailthru.date', name: 'sailthru.date', content: unref(pubDate) })
  }
  if (byline) {
    meta.push({ hid: 'sailthru.author', name: 'sailthru.author', content: unref(byline) })
  }
  if (unref(tags)?.length > 0) {
    meta.push({ hid: 'sailthru.tags', name: 'sailthru.tags', content: Array.isArray(unref(tags)) ? unref(tags).join(',') : unref(tags) })
  }

  return {
    title: finalTitle,
    meta,
    link: [
      { rel: 'canonical', href: canonicalUrl }
    ]
  }
}
