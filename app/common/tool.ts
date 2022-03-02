export function getAllDay(date: Date) {
  let y = date.getFullYear(),
    m = date.getMonth(),
    d = date.getDate()
  let begin = new Date(y, m, d, 0, 0, 0)
  let now = new Date()
  if (y === now.getFullYear() && m === now.getMonth() && d === now.getDate()) {
    return {
      begin: begin,
      end: now,
    }
  }
  return {
    begin: new Date(y, m, d, 0, 0, 0),
    end: new Date(y, m, d, 23, 59, 59, 999),
  }
}

export function enumForeach<T>(
  type: ThisType<T>,
  callback: (value: T) => void
) {
  for (var key in type) {
    var keyToAny: any = key
    if (!isNaN(keyToAny)) {
      var t: any = type[key]
      var e: T = t
      callback(e)
    }
  }
}

export function getElement(html: HTMLElement | string): HTMLElement {
  if (typeof html === 'string') {
    if (html.indexOf('#') === 0 || html.indexOf('.') === 0) {
      return document.querySelector(html) as HTMLElement
    } else {
      return document.getElementById(html) as HTMLElement
    }
  } else {
    return html
  }
}

export function dateFormat(date: Date, fmt: string) {
  var o = {
    'M+': date.getMonth() + 1, //月份
    'd+': date.getDate(), //日
    'h+': date.getHours() % 12 == 0 ? 12 : date.getHours() % 12, //小时
    'H+': date.getHours(), //小时
    'm+': date.getMinutes(), //分
    's+': date.getSeconds(), //秒
    'q+': Math.floor((date.getMonth() + 3) / 3), //季度
    S: date.getMilliseconds(), //毫秒
  }
  var week = {
    '0': '\u65e5',
    '1': '\u4e00',
    '2': '\u4e8c',
    '3': '\u4e09',
    '4': '\u56db',
    '5': '\u4e94',
    '6': '\u516d',
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + '').substr(4 - RegExp.$1.length)
    )
  }
  if (/(E+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (RegExp.$1.length > 1
        ? RegExp.$1.length > 2
          ? '\u661f\u671f'
          : '\u5468'
        : '') + week[date.getDay() + '']
    )
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      )
    }
  }
  return fmt
}

export function getQueryVariable(variable: string) {
  var query = window.location.search.substring(1)
  var vars = query.split('&')
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=')
    if (pair[0].toLocaleLowerCase() == variable.toLowerCase()) {
      return pair[1]
    }
  }
  return undefined
}

export function getQueryVariable2(variable: string) {
  let url = new URL(window.location.toString())
  let searchParams = url.searchParams

  return searchParams.get(variable)
}

export class TableAttribute {
  pageSize = 20
}

export function TheDayTime(date: Date) {
  let y = date.getFullYear(),
    m = date.getMonth(),
    d = date.getDate()
  return {
    begin: new Date(y, m, d, 0, 0, 0),
    end: new Date(y, m, d, 23, 59, 59),
  }
}

export function TheDay(day = 0) {
  const date = new Date()
  let y = date.getFullYear(),
    m = date.getMonth(),
    d = date.getDate()
  return {
    begin: new Date(y, m, d + day, 0, 0, 0),
    end: new Date(y, m, d + day, 23, 59, 59),
  }
}

export function unique(arr: any[]) {
  var hash = []
  for (var i = 0; i < arr.length; i++) {
    if (arr.indexOf(arr[i]) == i) {
      hash.push(arr[i])
    }
  }
  return hash
}

export function TimeInterval(
  dateString: string,
  seconds = 0,
  minutes = 0,
  hours = 0,
  date = 0
) {
  const start = new Date(dateString),
    end = new Date(dateString)
  start.setSeconds(start.getSeconds() + seconds)
  start.setMinutes(start.getMinutes() + minutes)
  start.setHours(start.getHours() + hours)
  start.setDate(start.getDate() + date)
  return {
    start: start,
    end: end,
  }
}

export function MonthLastDay(year: number, month: number) {
  var new_year = year //取当前的年份
  var new_month = month++ //取下一个月的第一天，方便计算（最后一天不固定）
  if (month > 12) {
    new_month -= 12 //月份减
    new_year++ //年份增
  }
  var new_date = new Date(new_year, new_month, 1) //取当年当月中的第一天
  return new Date(new_date.getTime() - 1000 * 60 * 60 * 24).getDate() //获取当月最后一天日期
}

//获取周1 - 周7
export function OneWeekDate(now: Date) {
  var nowTime = now.getTime()
  var day = now.getDay()
  var oneDayLong = 24 * 60 * 60 * 1000
  var MondayTime = nowTime - (day - 1) * oneDayLong
  var SundayTime = nowTime + (7 - day) * oneDayLong
  return {
    monday: new Date(MondayTime),
    sunday: new Date(SundayTime),
  }
}
