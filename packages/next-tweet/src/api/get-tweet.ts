import type { Tweet } from './types/index.js'

const SYNDICATION_URL = 'https://cdn.syndication.twimg.com'

export class TwitterApiError extends Error {
  status: number
  data: any

  constructor({
    message,
    status,
    data,
  }: {
    message: string
    status: number
    data: any
  }) {
    super(message)
    this.name = 'TwitterError'
    this.status = status
    this.data = data
  }
}

export async function getTweet(id: string): Promise<Tweet | undefined> {
  const url = new URL(`${SYNDICATION_URL}/tweet-result`)

  url.searchParams.set('id', id)
  url.searchParams.set('lang', 'en')
  url.searchParams.set(
    'features',
    [
      'tfw_timeline_list:',
      'tfw_follower_count_sunset:true',
      'tfw_tweet_edit_backend:on',
      'tfw_refsrc_session:on',
      'tfw_show_business_verified_badge:on',
      'tfw_duplicate_scribes_to_settings:on',
      'tfw_show_blue_verified_badge:on',
      'tfw_legacy_timeline_sunset:true',
      'tfw_show_gov_verified_badge:on',
      'tfw_show_business_affiliate_badge:on',
      'tfw_tweet_edit_frontend:on',
    ].join(';')
  )

  const res = await fetch(url.toString())
  const isJson = res.headers.get('content-type')?.includes('application/json')

  if (res.ok) {
    return isJson ? res.json() : undefined
  }
  if (res.status === 404) return

  throw new TwitterApiError({
    message: `Fetch for the embedded tweets of "${id}" failed with: ${res.status}`,
    status: res.status,
    data: isJson ? await res.json() : undefined,
  })
}
