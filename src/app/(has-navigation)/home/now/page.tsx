'use client'

import { useEffect, useState } from 'react'

import Image from 'next/image'

import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import 'swiper/css'
import 'swiper/css/navigation'
import { Swiper, SwiperSlide } from 'swiper/react'

import {
  getOngoingExhibitions,
  getUpcomingExhibitions,
} from '@/actions/getExhibitions'
import { MY_IMAGES } from '@/generated/path/images'

import ExhibitionCarousel from './ExhibitionCarousel'

interface Slide {
  background: string
  imageSrc: string
  title: string
  date: string
  place: string
}

export default function NowPage() {
  const [currentSlide, setCurrentSlide] = useState<number>(0)
  const [exhibitionsData, setExhibitionsData] = useState<unknown[][]>([])
  const [loading, setLoading] = useState(true)

  const slides: Slide[] = [
    {
      background: 'bg-now_poster1_background',
      imageSrc: MY_IMAGES.HOME_NOW_POSTER_1.src,
      title: 'Terrarium',
      date: '2024.08.17 ~ 2021.09.09',
      place: '중간지점',
    },
    {
      background: 'bg-now_poster2_background',
      imageSrc: MY_IMAGES.HOME_NOW_POSTER_2.src,
      title: '슈퍼픽션',
      date: '2024.08.17 ~ 2021.09.09',
      place: '세화미술관',
    },
  ]

  useEffect(() => {
    async function fetchData() {
      try {
        const ongoingResponse = await getOngoingExhibitions("서울")
        const upcomingResponse = await getUpcomingExhibitions("서울")

        setExhibitionsData([ongoingResponse.data, upcomingResponse.data])
      } catch (error) {
        console.error('Error fetching exhibitions:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="flex flex-col items-center">
      <div className="relative mx-auto w-[100%]">
        <div className="relative mb-[30px] flex h-[642px] items-center justify-center">
          <div className="absolute bottom-[75px] left-1/2 z-50 h-[3px] w-[300px] -translate-x-1/2 transform rounded-full bg-gray-400">
            <div
              className="h-full rounded-full bg-white transition-all duration-500 ease-in-out"
              style={{
                width: '50%',
                transform:
                  currentSlide === 0 ? 'translateX(0)' : 'translateX(100%)',
              }}
            ></div>
          </div>
          <Swiper
            effect="fade"
            onSlideChange={(swiper) => {
              setCurrentSlide(swiper.activeIndex)
            }}
            allowSlidePrev={currentSlide !== 0}
            allowSlideNext={currentSlide !== slides.length - 1}
            className="h-full w-full"
          >
            {slides.map((slide, index) => (
              <SwiperSlide key={index}>
                <div
                  className={`relative flex h-full w-full items-center justify-center ${slide.background}`}
                >
                  <div className="relative">
                    <Image
                      src={slide.imageSrc}
                      alt="image"
                      height={430}
                      width={300}
                    />
                    <div className="absolute bottom-0 left-0 h-1/3 w-full bg-gradient-to-t from-gray-800 to-transparent"></div>
                    <div className="absolute bottom-[10px] left-[10px] flex flex-col text-white">
                      <div className="mobile-extra-large font-bold">
                        {slide.title}
                      </div>
                      <div className="mobile-text">{slide.date}</div>
                      <div className="mobile-title">{slide.place}</div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* 진행 중인 전시 Carousel */}
        {loading ?
          <div className="grid grid-cols-2 gap-4 px-4 pb-5">
            {Array(4)
              .fill(0)
              .map((_, index) => (
                <div key={index} className="rounded bg-white p-3 shadow-md">
                  <Skeleton height={200} className="mb-2 rounded" />
                  <Skeleton height={20} className="my-1" />
                  <Skeleton height={20} width="60%" />
                </div>
              ))}
          </div>
        : <>
            {exhibitionsData[0] && (
              <ExhibitionCarousel exhibitions={exhibitionsData[0]}>
                진행 중인 전시
              </ExhibitionCarousel>
            )}
            {exhibitionsData[1] && (
              <ExhibitionCarousel exhibitions={exhibitionsData[1]}>
                다가오는 전시
              </ExhibitionCarousel>
            )}
          </>
        }
      </div>
    </div>
  )
}
