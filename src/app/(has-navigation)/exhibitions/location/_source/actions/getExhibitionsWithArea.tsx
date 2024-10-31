'use server'

import {
  ExhibitionStatus,
  OverlayApiType,
} from '@/apis/exhibitions/types/model/map'
import prisma from '@/apis/prismaClient'

import { areaCenterPosition, defaultPosition } from '../constants/map'

interface GetExhibitionsParams {
  area?: string
  status?: ExhibitionStatus
}

export async function getExhibitionsWithArea({
  area,
  status,
}: GetExhibitionsParams = {}) {
  try {
    const where = {
      ...(area && { area }),
      ...(status && { status }),
    }

    const exhibitions = await prisma.exhibition.findMany({
      where,
      select: {
        id: true,
        title: true,
        gpsX: true,
        gpsY: true,
        thumbnail: true,
        area: true,
        startDate: true,
        endDate: true,
        place: true,
        status: true,
      },
    })


    // 지역별 그룹
    const groupedByArea = exhibitions.reduce(
      (acc : Record<string,OverlayApiType>, exhibition) => {
        const area = exhibition.area
        if (!acc[area]) {
          acc[area] = {
            area,
            count: 0,
            position: areaCenterPosition[area] || defaultPosition,
          }
        }
        acc[area].count++
        return acc
      },
      {} as Record<string, OverlayApiType>,
    )

    return {
      exhibitions,
      areaGroups: Object.values(groupedByArea),
    }
  } catch (error) {
    console.error('Error fetching exhibitions:', error)
    throw new Error('An error occurred while fetching exhibitions')
  } finally {
    await prisma.$disconnect()
  }
}
