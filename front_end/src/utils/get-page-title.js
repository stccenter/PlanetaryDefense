import defaultSettings from '@/settings'

const title = defaultSettings.title || 'Publication Analysis'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
