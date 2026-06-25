import React, { useEffect, useRef, useState } from 'react'
import { useApp } from '../../context/App'
import Desktop from 'components/Desktop'
import TaskBarMenu from 'components/TaskBarMenu'
import AppWindow from 'components/AppWindow'
import { AnimatePresence, motion } from 'framer-motion'
import CookieBannerToast from 'components/CookieBanner/ToastVersion'
import { DotLottiePlayer, PlayerEvents } from '@dotlottie/react-player'
import WebsiteFooter from 'components/WebsiteFooter'

export default function Wrapper() {
    const {
        windows,
        constraintsRef,
        compact,
        closingAllWindowsAnimation,
        setClosingAllWindowsAnimation,
        closeAllWindows,
    } = useApp()
    const [shakeReady, setShakeReady] = useState(false)
    const [mounted, setMounted] = useState(false)
    const dotLottieRef = useRef<any>(null)

    useEffect(() => setMounted(true), [])

    useEffect(() => {
        if (closingAllWindowsAnimation && dotLottieRef.current) {
            dotLottieRef.current.play()
        }
    }, [closingAllWindowsAnimation])

    return (
        <div data-scheme="primary" className="h-screen flex flex-col p-2" id="app-container">
            {!compact && <TaskBarMenu />}
            <div ref={constraintsRef} className={`flex-grow relative min-h-0 overflow-clip`}>
                <Desktop />
                <div className="flex size-full justify-center items-center">
                    <AnimatePresence>
                        {windows.map((item) => (
                            <AppWindow item={item} key={item.key} chrome={item.key !== 'search'} />
                        ))}
                    </AnimatePresence>
                </div>
            </div>
            <WebsiteFooter />
            {/*             
            {!compact && <Dock />}
            */}
            <CookieBannerToast />
            {mounted && (
                <AnimatePresence>
                    <motion.div
                        exit={{ opacity: 0 }}
                        className={`fixed inset-0 size-full z-[999999] ${
                            closingAllWindowsAnimation ? 'block' : 'hidden'
                        }`}
                    >
                        <DotLottiePlayer
                            className="size-full"
                            src="/lotties/hogzilla-swipe.lottie"
                            ref={dotLottieRef}
                            onEvent={(event) => {
                                if (event === PlayerEvents.Play) {
                                    setTimeout(() => {
                                        setShakeReady(true)
                                        setTimeout(() => {
                                            closeAllWindows()
                                            setShakeReady(false)
                                        }, 500)
                                    }, 2200)
                                }
                                if (event === PlayerEvents.Complete) {
                                    setClosingAllWindowsAnimation(false)
                                    dotLottieRef.current.stop()
                                }
                            }}
                        />
                    </motion.div>
                </AnimatePresence>
            )}
        </div>
    )
}
