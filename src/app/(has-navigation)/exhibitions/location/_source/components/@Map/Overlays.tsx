import { useCallback, useEffect, useRef } from 'react'

import { useGlobalMapStore } from '@/stores/map/store'

import { useVisibleElements } from '../../hooks/useVisibleElements'
import {OverlayApiType} from "@/apis/exhibitions/types/model/map";

export default function Overlays() {
  const map = useGlobalMapStore((state) => state.map)
  const overlaysRef = useRef<kakao.maps.CustomOverlay[]>([])

  const {
    visibleElements: { overlays },
  } = useVisibleElements()

  // 모든 오버레이 제거 함수
  const removeAllOverlays = useCallback(() => {
    overlaysRef.current.forEach((overlay) => overlay.setMap(null))
    overlaysRef.current = []
  }, [])

  // 오버레이 로드 및 클린업
  useEffect(() => {
    if (!map || !overlays) return

    removeAllOverlays()

    const newOverlays = overlays?.map((overlay:OverlayApiType) => {
      const content = document.createElement('div')
      content.className = 'custom-overlay'
      content.innerHTML = `
        <div class="bg-grayscale_gray5 w-[82px] h-[82px] rounded-full flex flex-col items-center justify-center">
          <span class="font-bold mobile-title-small text-grayscale_white">${(overlay).area}</span>
          <span class="text-grayscale_white mobile-text-large font-bold">${(overlay).count}</span>
        </div>
      `

      const { lat, lng } = (overlay).position

      // 커스텀 오버레이 생성
      const customOverlay = new window.kakao.maps.CustomOverlay({
        position: new window.kakao.maps.LatLng(lat, lng),
        content: content,
        xAnchor: 0.5,
        yAnchor: 1.0,
      })

      customOverlay.setMap(map)
      return customOverlay
    })

    overlaysRef.current = newOverlays || []

    return () => {
      removeAllOverlays()
    }
  }, [map, overlays, removeAllOverlays])

  return null
}
