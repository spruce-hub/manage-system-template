import day from 'dayjs'

export const dateFormat = 'yyyy-MM-dd'
export const DatetimeFormat = 'yyyy-MM-dd HH:mm:ss'

export function getFormattedDatetime() {
  return day().format('YYYY-MM-DD HH:mm:ss')
}

export function getFormattedMonthDay(time) {
  let date = new Date(time)
  return day(date).format('MM.DD')
}
