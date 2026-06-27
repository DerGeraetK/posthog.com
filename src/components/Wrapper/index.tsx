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
    const { windows, constraintsRef, compact } = useApp()

    return (
        <div data-scheme="primary" className="h-screen flex flex-col p-2" id="app-container">
            {!compact && <TaskBarMenu />}
            <div ref={constraintsRef} className={`flex-grow relative min-h-0 overflow-clip`}>
                <Desktop />
                <div className="flex size-full justify-center items-center">
                    {windows.map((item) => (
                        <AppWindow item={item} key={item.key} chrome={item.key !== 'search'} />
                    ))}
                </div>
            </div>
            <WebsiteFooter />
            {/*             
            {!compact && <Dock />}
            */}
            <CookieBannerToast />
        </div>
    )
}
