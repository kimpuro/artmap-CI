import Link from 'next/link'

type onboardingLinkProps = {
  bgColor: string
  children: React.ReactNode
  href: string
}
export default function OnboardingLink({
  bgColor,
  children,
  href,
}: onboardingLinkProps) {
  let bgClass = ''
  let textColor = 'text-grayscale_white'
  if (bgColor === 'gray') {
    bgClass = 'bg-grayscale_gray3'
  } else if (bgColor === 'black') {
    bgClass = 'bg-grayscale_black'
  } else if (bgColor === 'purple') {
    bgClass = 'bg-point'
  } else if (bgColor === 'white') {
    bgClass = 'bg-white'
    textColor = 'text-grayscale_black'
  }

  return (
    // TODO: @dave17code 타입 수정 부탁드려용. 일단 커밋
    <Link
      href={href as any}
      className={`${bgClass} relative z-20 inline-flex h-[50px] w-11/12 items-center justify-center rounded-[5px] px-[15px] hover:opacity-75`}
    >
      <div
        className={`${textColor} font-['Noto Sans KR'] z-20 text-base font-bold leading-7`}
      >
        {children}
      </div>
    </Link>
  )
}