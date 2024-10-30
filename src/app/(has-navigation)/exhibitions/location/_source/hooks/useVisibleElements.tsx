import { useMemo } from 'react'

import { useGetExhibitionsWithAreaQuery } from '@/apis/exhibitions/location/ExhibitionsLoctionApi.query'
import { useMapStateContext } from '@/app/_source/context/useMapStateContext'
import { useGlobalMapStore } from '@/stores/map/store'

import { MAP_OPTIONS } from '../types/map'

/**
 * - 지도에 표시될 마커와 오버레이 데이터를 관리합니다.
 * - 현재 지도 영역과 줌 레벨에 따라 마커 OR 오버레이를 필터링합니다.
 * - 필터링 된 데이터는 스토어에 업데이트 됩니다.
 * @returns
 *
 */
export const useVisibleElements = () => {
  const map = useGlobalMapStore((state) => state.map)
  const bounds = useMapStateContext((state) => state.bounds)
  const zoomLevel = useMapStateContext((state) => state.zoomLevel)

  const { data, isLoading, error } = useGetExhibitionsWithAreaQuery()

  /**
   * 1. 초기 로드 시: map 객체로 bounds와 zoomLevel 계산
   * 2. 이벤트 발생 시: bounds와 zoomLevel로 필터링
   * - 오버레이 줌 레벨(7) 이상: 오버레이만 표시
   * - 오버레이 줌 레벨 미만: 마커만 표시
   */
  const visibleElements = useMemo(() => {
    if (!map || !data) return { markers: [], overlays: [], exhibitions: [] }

    // 현재 사용할 bounds와 zoom level 결정
    // 이벤트로 업데이트된 값이 있으면 그 값을 사용, 없으면 map에서 직접 가져옴
    const currentBounds = bounds || map.getBounds()
    const currentZoomLevel = zoomLevel ?? map.getLevel()
    const isOverlayZoom = currentZoomLevel >= MAP_OPTIONS.ZOOM.OVERLAY

    // 현재 영역 내의 전시 필터링
    const visibleExhibitions = data.exhibitions.filter((exhibition) =>
      currentBounds.contain(
        new kakao.maps.LatLng(+exhibition.gpsY, +exhibition.gpsX),
      ),
    )

    // 줌 레벨에 따라 마커/오버레이 결정
    const filteredMarkers = !isOverlayZoom ? visibleExhibitions : []
    const filteredOverlays =
      isOverlayZoom ?
        data.areaGroups.filter((overlay) =>
          currentBounds.contain(
            new kakao.maps.LatLng(overlay.position.lat, overlay.position.lng),
          ),
        )
      : []
    return {
      markers: filteredMarkers,
      overlays: filteredOverlays,
      exhibitions: visibleExhibitions,
    }
  }, [bounds, data, map, zoomLevel])

  return { visibleElements, isLoading, error }
}