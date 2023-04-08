const getEnv = (key: string, required = true) => {
  const env = import.meta.env[key]
  if (!env && required) {
    throw new Error(`Environment variable ${key} was undefined!`)
  }
  return env
}

const parseInteger = (env?: string) => {
  try {
    return parseInt(env || '')
  } catch (err) {}
  return undefined
}

export const getPrefixedWS_URL = (url?: string) => {
  if (url && url.slice(0, 2) !== 'ws' && typeof window !== 'undefined') {
    return `ws://${window.location.host}${url.charAt(0) !== '/' ? '/' : ''}${url}`
  }
  return url
}

export const DEV = import.meta.env.DEV
export const YJS_URL = getPrefixedWS_URL(getEnv('VITE_YJS_URL', false))
// More about SvelteKit's default env variables https://vitejs.dev/guide/env-and-mode.html
// TODO rather than importing DEV everywhere, create logger that checks for DEV
// which also would allow for event logging like in Redux
