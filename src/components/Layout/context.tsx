import React, { createContext, useEffect, useRef, useState } from 'react'
import menu, { docsMenu } from '../../navs'
import { IMenu } from 'components/PostLayout/types'
import { useLocation } from '@reach/router'
import { navigate } from 'gatsby'
import { useActions } from 'kea'
import { layoutLogic } from 'logic/layoutLogic'

export const Context = createContext<any>(undefined)

function recursiveSearch(array, value) {
    for (let i = 0; i < array?.length || 0; i++) {
        const element = array[i]

        if (typeof element === 'string' && element.split('?')[0] === value) {
            return true
        }

        if (typeof element === 'object' && element !== null) {
            const found = recursiveSearch(Object.values(element), value)
            if (found) {
                return true
            }
        }
    }

    return false
}

export interface IProps {
    children: React.ReactNode
    parent?: IMenu
    activeInternalMenu?: IMenu
}

export const LayoutProvider = ({ children, ...other }: IProps) => {
    const { pathname, search } = useLocation()
    const { setWebsiteTheme } = useActions(layoutLogic)
    // `mounted` is false during SSR and the first client render. We gate browser-only reads
    // (iframe detection, localStorage) on it so the first client render matches the
    // server-rendered HTML and we don't trigger hydration mismatches (React error #418).
    const [mounted, setMounted] = useState(false)
    const isInIframe = typeof window !== 'undefined' && window !== window.parent
    const compact = mounted && isInIframe
    const [fullWidthContent, setFullWidthContent] = useState<boolean>(false)
    const [hedgehogModeEnabled, _setHedgehogModeEnabled] = useState<boolean>(false)
    const fullWidthContentInitialized = useRef(false)
    const [enterpriseMode, setEnterpriseMode] = useState(false)
    const [theoMode, setTheoMode] = useState(false)
    const [post, setPost] = useState<boolean>(false)
    const parent =
        other.parent ??
        menu.find(({ children, url }) => {
            const currentURL = pathname
            return currentURL === url.split('?')[0] || recursiveSearch(children, currentURL)
        })

    const internalMenu = parent?.children

    const activeInternalMenu =
        other.activeInternalMenu ??
        internalMenu?.find((menuItem) => {
            const currentURL = pathname
            return currentURL === menuItem.url?.split('?')[0] || recursiveSearch(menuItem.children, currentURL)
        })

    // Read the real (browser-only) initial values after mount. Kept out of the useState
    // initializers above so the first client render matches SSR (avoids React #418).
    useEffect(() => {
        setMounted(true)

        setFullWidthContent(isInIframe || localStorage.getItem('full-width-content') === 'true')

        // Only default hedgehog mode on if it's April 1st, but still respect an explicit opt-out
        const today = new Date()
        const isAprilFirst = today.getMonth() === 3 && today.getDate() === 1
        const storedHedgehogMode = localStorage.getItem('hedgehog-mode-enabled')
        _setHedgehogModeEnabled(
            storedHedgehogMode === 'true' || (isAprilFirst && typeof storedHedgehogMode !== 'string')
        )
    }, [])

    useEffect(() => {
        // Skip the first run so we don't overwrite the stored value before the mount effect
        // above has loaded it.
        if (!fullWidthContentInitialized.current) {
            fullWidthContentInitialized.current = true
            return
        }
        localStorage.setItem('full-width-content', fullWidthContent + '')
    }, [fullWidthContent])

    const setHedgehogModeEnabled = (enabled: boolean) => {
        _setHedgehogModeEnabled(enabled)
        localStorage.setItem('hedgehog-mode-enabled', enabled + '')
    }

    useEffect(() => {
        // Read iframe state directly rather than the render-gated `compact`, which is
        // intentionally `false` on the first render (pre-mount) for hydration.
        if (isInIframe) {
            // nosemgrep: javascript.browser.security.wildcard-postmessage-configuration.wildcard-postmessage-configuration - intentional for docs embedding, parent origin unknown, non-sensitive navigation data
            window.parent.postMessage(
                {
                    type: 'internal-navigation',
                    url: pathname,
                },
                '*'
            )
        }
    }, [pathname])

    useEffect(() => {
        if (isInIframe) {
            // nosemgrep: javascript.browser.security.wildcard-postmessage-configuration.wildcard-postmessage-configuration - intentional for docs embedding, parent origin unknown, non-sensitive menu data
            window.parent.postMessage(
                {
                    type: 'docs-active-menu',
                    activeMenuName: activeInternalMenu?.name,
                },
                '*'
            )
        }
    }, [activeInternalMenu])

    useEffect(() => {
        if (window) {
            setWebsiteTheme(window.__theme)
            window.__onThemeChange = () => {
                setWebsiteTheme(window.__theme)
            }
        }
        if (isInIframe) {
            // nosemgrep: javascript.browser.security.wildcard-postmessage-configuration.wildcard-postmessage-configuration - intentional for docs embedding, parent origin unknown, non-sensitive ready signal
            window.parent.postMessage(
                {
                    type: 'docs-ready',
                },
                '*'
            )

            // nosemgrep: javascript.browser.security.wildcard-postmessage-configuration.wildcard-postmessage-configuration - intentional for docs embedding, parent origin unknown, non-sensitive menu data
            window.parent.postMessage(
                {
                    type: 'docs-menu',
                    menu: docsMenu.children,
                },
                '*'
            )
        }

        const onMessage = (e: MessageEvent): void => {
            if (e.data.type === 'theme-toggle') {
                window.__setPreferredTheme(e.data.isDarkModeOn ? 'dark' : 'light')
                return
            }
            if (e.data.type === 'navigate') {
                navigate(e.data.url)
            }
        }

        window.addEventListener('message', onMessage)

        return () => window.removeEventListener('message', onMessage)
    }, [])

    useEffect(() => {
        if (enterpriseMode) {
            document.querySelector('body')?.setAttribute('style', 'font-family: Verdana !important')
        } else {
            document.querySelector('body')?.removeAttribute('style')
        }
    }, [enterpriseMode])

    useEffect(() => {
        if (pathname !== '/') {
            setEnterpriseMode(false)
        }
        if (pathname === '/' && search.includes('synergy=true')) {
            setEnterpriseMode(true)
        }
        if (
            ['/blog/', '/founders/', '/product-engineers/', '/newsletter/'].some((prefix) =>
                pathname.startsWith(prefix)
            )
        ) {
            setPost(true)
        } else {
            setPost(false)
            setTheoMode(false)
        }
    }, [pathname])

    return (
        <Context.Provider
            value={{
                menu,
                parent,
                internalMenu,
                activeInternalMenu,
                fullWidthContent,
                setFullWidthContent,
                compact,
                enterpriseMode,
                setEnterpriseMode,
                theoMode,
                setTheoMode,
                post,
                hedgehogModeEnabled,
                setHedgehogModeEnabled,
            }}
        >
            {children}
        </Context.Provider>
    )
}
