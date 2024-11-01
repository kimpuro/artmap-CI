'use client'

import { useState } from 'react'

import dynamic from 'next/dynamic'

import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'

const ExhibitionList = dynamic(() => import('./ExhibitionList'), {
  loading: () => <div>로딩중...</div>,
  ssr: false,
})

export default function ExhibitionDrawer() {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <Drawer
      open={isOpen}
      onOpenChange={setIsOpen}
      shouldScaleBackground={false}
      snapPoints={[0.17, 1]}
      dismissible={false}
    >
      <DrawerContent
        className="m-auto h-dvh max-w-screen-sm cursor-pointer"
        isOverlayHidden={true}
      >
        <DrawerHeader>
          <DrawerTitle className="text-center text-point sm:mobile-text-small">
            이 주변의 전시 리스트
          </DrawerTitle>
        </DrawerHeader>
        <div className="hide-scrollbar overflow-y-auto p-4">
          <ExhibitionList />
        </div>
        <DrawerFooter className="h-[100px]"></DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
