type PartsObject = Record<keyof Intl.DateTimeFormatPartTypesRegistry, string>

const options: Intl.DateTimeFormatOptions = {
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
  weekday: 'short',
  month: 'short',
  day: 'numeric',
  year: 'numeric',
}

const formatter = new Intl.DateTimeFormat('en-US', options)

const partsArrayToObject = (
  parts: ReturnType<typeof formatter.formatToParts>
): PartsObject => {
  const result = {} as PartsObject

  for (const part of parts) {
    result[part.type] = part.value
  }

  return result
}

export const formatDate = (date: Date) => {
  const parts = partsArrayToObject(formatter.formatToParts(date))
  const formattedTime = `${parts.hour}:${parts.minute} ${parts.dayPeriod}`
  const formattedDate = `${parts.month} ${parts.day}, ${parts.year}`
  return `${formattedTime} · ${formattedDate}`
}

export const formatRemainingTime = (date: Date) => {
  const timeDiff = date.getTime() - Date.now()

  if (timeDiff < 0) {
    return 'Final results'
  }

  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'always' })

  const seconds = Math.floor(timeDiff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  let result = []

  if (days > 0) {
    result = rtf.formatToParts(days, 'day')
  } else if (hours > 0) {
    result = rtf.formatToParts(hours, 'hour')
  } else if (minutes > 0) {
    result = rtf.formatToParts(minutes, 'minute')
  } else {
    result = rtf.formatToParts(seconds, 'second')
  }

  result.shift()
  result.push({ type: 'literal', value: 'left' })

  return result.map((part) => part.value).join(' ')
}
