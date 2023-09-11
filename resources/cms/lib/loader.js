import { h, render } from 'preact'
import { lcfirst } from '.'

const findComponent = async (name, path, modules) => {
  if (! (path in modules)) {
    return
  }

  const components = await modules[path]()

  if (path.endsWith(`${name}.jsx`) || ! (name in components)) {
    return components.default
  }

  return components[name]
}

const parseDom = (dom, source) => ({
  name: dom.dataset[source],
  path: `./${source}/${dom.dataset[source]}.jsx`,
  props: Object.keys(dom.dataset).filter(prop => prop.startsWith('prop')).reduce(
    (props, prop) => ({
      ...props,
      ...(/^[[{]/.test(dom.dataset[prop]) ? JSON.parse(dom.dataset[prop]) : {
        [lcfirst(prop.slice(4))]: dom.dataset[prop],
      }),
    }),
    {},
  )
})

export default (modules, source = 'pages') => document.querySelectorAll(`[data-${source}]`).forEach(async dom => {
  const { name, path, props } = parseDom(dom, source)
  const Component = await findComponent(name, path, modules)

  if (Component) {
    render(h(Component, props), dom)
  }
})
