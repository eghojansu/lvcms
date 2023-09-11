export const isary = val => Array.isArray(val)
export const isobj = val => val && !isary(val) && /^o/.test(typeof val)
export const isstr = val => /^s/.test(typeof val)
export const isfn = val => /^f/.test(typeof val)

export const lcfirst = str => `${str.charAt(0).toLowerCase()}${str.slice(1)}`
export const ucfirst = str => `${str.charAt(0).toUpperCase()}${str.slice(1)}`
export const toWords = (text, glue, leave) => text
  .replace(/(\W|-|_)|([A-Z])/g, word => word ? ` ${word}` : '')
  .split(' ')
  .filter(Boolean)
  .map(word => toWord(word, leave))
  .join(glue || '')
export const toWord = (word, leave) => {
  if (word.length < 2 || /^[A-Z]+$/.test(word)) {
    return word
  }

  return `${word.slice(0, 1).toUpperCase()}${leave ? word.slice(1) : word.slice(1).toLowerCase()}`
}
export const caseTitle = text => toWords(text, ' ')
export const caseKebab = text => toWords(text, '-').toLowerCase()
export const casePascal = text => toWords(text)

export const randstr = (len, alphanum) => {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.concat(alphanum ? '' : '~!@-#$')

  return Array.from(crypto.getRandomValues(new Uint32Array(len || 8))).map(r => chars[r % chars.length]).join('')
}

export const clsx = (...args) => clsr(...args).join(' ') || null
export const clsr = (...args) => args.reduce((args, val) => {
  if (!val) {
    return args
  }

  if ('object' === typeof val) {
    return [
      ...args, ...(
        Array.isArray(val) ? val : Object.entries(val).map(([key, val]) => val ? key : null)
      ).map(val => clsr(val)),
    ]
  }

  return [...args, ...val.split(' ')]
}, []).filter((val, i, all) => i === all.indexOf(val))

export const isEmptyObj = val => Object.keys(val).length === 0

export const timer = (cb, delay) => {
  let timeId, start, remaining = delay

  const pause = () => {
    clearTimeout(timeId)

    timeId = null
    remaining -= Date.now() - start
  }
  const resume = () => {
    if (timeId) {
      return
    }

    start = Date.now()
    timeId = setTimeout(cb, remaining)
  }

  resume()

  return { resume, pause }
}
