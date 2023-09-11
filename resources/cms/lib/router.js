import { h } from 'preact'
import { lazy, Suspense } from 'preact/compat'
import Router from 'preact-router'

const resolvePath = (file, start, prefix) => `${prefix}${file.substring(0, file.lastIndexOf('.')).replace('.', '-').split('/').slice(start).join('/')}`
const sortPath = (a, b) => {
  const aC = a.split('/')
  const aB = b.split('/')

  return (aC.length === aC.length || aB[aB.length - 1].startsWith('index')) ? 0 : (
    aC < aB ? 1 : -1
  )
}

const buildGroups = ({ prefix, start = 1, pages }) => Object.keys(pages)
  .toSorted(sortPath)
  .reduce((groups, file) => {
    let currentLevel = groups

    const path = resolvePath(file, start, prefix)

    path.split('/').filter(Boolean).forEach(segment => {
      if (!currentLevel[segment]) {
        currentLevel[segment] = {
          file,
          children: {},
        }
      }

      currentLevel = currentLevel[segment].children
    })

    return groups
  }, {})

const buildRoutes = ({ prefix, groups, loading: fallback, fallback: dflt, pages }) => Object.keys(groups)
  .filter(part => !['_layout'].includes(part))
  .reduce((routes, part) => {
    const route = groups[part]
    const children = Object.keys(route.children)
    const props = {
      path: `${prefix}${['home','index'].includes(part) ? '' : part}`,
      fallback,
    }

    if (children.length > 0) {
      if (children.includes('index')) {
        props.path += '/:rest*'
      } else {
        props.children = buildRoutes({
          fallback,
          pages,
          prefix: `${props.path}/`,
          groups: route.children,
        })
      }
    }

    if (props.children) {
      if (children.includes('_layout')) {
        props.path += '/:rest*'

        routes.push(h(Suspense, props, h(
          lazy(pages[route.children._layout.file]),
          null,
          h(Router, null, ...props.children.concat([dflt]))
        )))
      } else {
        routes.push(...props.children)
      }
    } else {
      routes.push(h(Suspense, props, h(lazy(pages[route.file]))))
    }

    return routes
  }, [])

const build = ({ prefix, start = 1, pages, loading, fallback }) => {
  const groups = buildGroups({ prefix, start, pages })

  return buildRoutes({ prefix, pages, fallback, groups, loading }).concat([fallback])
}

export default ({ prefix = '/', start = 1, pages, loading, fallback, includes, ...props }) => h(
  Router,
  props,
  build({ prefix, start, pages, loading, fallback })
)
