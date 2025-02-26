import { Fragment } from 'react'
import clsx from 'clsx'
import {
  type EnrichedTweet,
  type EnrichedQuotedTweet,
  getMediaUrl,
} from '../utils.js'
import { MediaDetails } from '../api/index.js'
import type { TwitterComponents } from './types.js'
import { TweetMediaVideo } from './tweet-media-video.js'
import { MediaImg } from './media-img.js'
import s from './tweet-media.module.css'

const getSkeletonStyle = (media: MediaDetails, itemCount: number) => {
  let paddingBottom = 56.25 // default of 16x9

  // if we only have 1 item, show at original ratio
  if (itemCount === 1)
    paddingBottom =
      (100 / media.original_info.width) * media.original_info.height

  // if we have 2 items, double the default to be 16x9 total
  if (itemCount === 2) paddingBottom = paddingBottom * 2

  return {
    width: media.type === 'photo' ? undefined : 'unset',
    paddingBottom: `${paddingBottom}%`,
  }
}

type Props = {
  tweet: EnrichedTweet | EnrichedQuotedTweet
  components?: TwitterComponents
  quoted?: boolean
}

export const TweetMedia = ({ tweet, components, quoted }: Props) => {
  const length = tweet.mediaDetails?.length ?? 0
  const Img = components?.MediaImg ?? MediaImg

  return (
    <div className={clsx(s.root, !quoted && s.rounded)}>
      <div
        className={clsx(
          s.mediaWrapper,
          length > 1 && s.grid2Columns,
          length === 3 && s.grid3,
          length > 4 && s.grid2x2
        )}
      >
        {tweet.mediaDetails?.map((media) => (
          <Fragment key={media.media_url_https}>
            {media.type === 'photo' ? (
              <a
                key={media.media_url_https}
                href={tweet.url}
                className={clsx(s.mediaContainer, s.mediaLink)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div
                  className={s.skeleton}
                  style={getSkeletonStyle(media, length)}
                />
                <Img
                  src={getMediaUrl(media, 'small')}
                  alt={media.ext_alt_text || 'Image'}
                  className={s.image}
                  draggable
                  decoding="async"
                />
              </a>
            ) : (
              <div key={media.media_url_https} className={s.mediaContainer}>
                <div
                  className={s.skeleton}
                  style={getSkeletonStyle(media, length)}
                />
                <TweetMediaVideo tweet={tweet} media={media} />
              </div>
            )}
          </Fragment>
        ))}
      </div>
    </div>
  )
}
