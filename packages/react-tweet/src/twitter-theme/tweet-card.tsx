import clsx from 'clsx'
import {
  BindingValues,
  Card,
  PollChoice,
  StringValue,
} from '../api/types/card.js'
import s from './tweet-card.module.css'
import infoStyles from './tweet-info.module.css'
import { formatRemainingTime } from '../date-utils.js'
import { formatVoteCount } from '../utils.js'

export const TweetCard = ({ card }: { card: Card }) => {
  // Poll card, e.g. https://x.com/elonmusk/status/1604617643973124097
  return card.name.startsWith('poll') ? (
    <TweetPoll poll={card.binding_values} />
  ) : undefined
}

const TweetPoll = ({ poll }: { poll: BindingValues }) => {
  const totalChoiceCount = Object.keys(poll).filter(
    (key) => key.startsWith('choice') && key.endsWith('_label')
  ).length

  const totalVoteCount = Object.keys(poll)
    .filter((key) => key.startsWith('choice') && key.endsWith('_count'))
    .reduce((acc, key) => {
      return (
        acc +
        parseInt((poll[key as keyof BindingValues] as StringValue).string_value)
      )
    }, 0)

  const choicePercentages = Array.from({ length: totalChoiceCount }, (_, i) => {
    const choiceCount = (
      poll[`choice${i + 1}_count` as keyof BindingValues] as StringValue
    ).string_value
    return ((parseInt(choiceCount) / totalVoteCount) * 100).toFixed(1)
  })

  const choices: PollChoice[] = Array.from(
    { length: totalChoiceCount },
    (_, i) => {
      const choiceLabel = (
        poll[`choice${i + 1}_label` as keyof BindingValues] as StringValue
      ).string_value
      const choiceCount = parseInt(
        (poll[`choice${i + 1}_count` as keyof BindingValues] as StringValue)
          .string_value
      )
      return {
        label: choiceLabel,
        count: choiceCount,
        percentage: choicePercentages[i],
      }
    }
  )

  return (
    <div className={s.root}>
      {choices.map((choice, i) => (
        <TweetPollChoice key={i} choice={choice} />
      ))}
      <TweetPollInfo
        voteCount={totalVoteCount}
        endDateTime={poll.end_datetime_utc.string_value}
      />
    </div>
  )
}

const TweetPollInfo = ({
  voteCount,
  endDateTime,
}: {
  voteCount: number
  endDateTime: string
}) => {
  return (
    <div className={clsx(infoStyles.info)}>
      <span>
        {formatVoteCount(voteCount)} votes ·{' '}
        {formatRemainingTime(new Date(endDateTime))}
      </span>
    </div>
  )
}

const TweetPollChoice = ({ choice }: { choice: PollChoice }) => {
  return (
    <div className={s.choice} title={`Votes: ${formatVoteCount(choice.count)}`}>
      <div>
        <div
          className={s.bar}
          style={{
            width: `${choice.percentage}%`,
          }}
        ></div>
        <div className={s.percent}>{choice.percentage}%</div>
      </div>
      <div className={s.label}>{choice.label}</div>
    </div>
  )
}
