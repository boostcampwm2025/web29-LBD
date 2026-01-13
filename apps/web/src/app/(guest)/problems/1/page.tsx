'use client'

import React, { Suspense } from 'react'

import CloudFrontCacheBehavior from '@/aws-services/cloudfront/cloudfront-cache-behavior'
import CloudFrontDistributionSettings from '@/aws-services/cloudfront/cloudfront-distribution-settings'
import CloudFrontOriginSettings from '@/aws-services/cloudfront/cloudfront-origin-settings'
import CloudFrontWebsiteSettings from '@/aws-services/cloudfront/cloudfront-website-settings'
import S3BucketCreate from '@/aws-services/s3/s3-bucket-create'
import S3FileUpload from '@/aws-services/s3/s3-file-upload'
import { StepsNavigator } from '@/components/steps'
import type { StepConfig } from '@/components/steps'
import { Spinner } from '@/components/ui/spinner'

const REACT_DEPLOY_STEPS: StepConfig[] = [
  {
    id: 's3-create',
    title: 'S3 버킷 생성',
    description: '정적 파일 저장소',
    render: ({ onNext, onPrev, canGoPrev }) => (
      <S3BucketCreate onNext={onNext} onPrev={onPrev} canGoPrev={canGoPrev} />
    ),
  },
  {
    id: 's3-upload',
    title: '빌드 파일 업로드',
    description: 'React 빌드 결과물',
    render: ({ onNext, onPrev, canGoPrev }) => (
      <S3FileUpload onNext={onNext} onPrev={onPrev} canGoPrev={canGoPrev} />
    ),
  },
  {
    id: 'cf-origin',
    title: 'Origin 설정',
    description: 'S3 버킷 연결',
    render: ({ onNext, onPrev, canGoPrev }) => (
      <CloudFrontOriginSettings
        onNext={onNext}
        onPrev={onPrev}
        canGoPrev={canGoPrev}
      />
    ),
  },
  {
    id: 'cf-distribution',
    title: '배포 설정',
    description: 'CloudFront 구성',
    render: ({ onNext, onPrev, canGoPrev }) => (
      <CloudFrontDistributionSettings
        onNext={onNext}
        onPrev={onPrev}
        canGoPrev={canGoPrev}
      />
    ),
  },
  {
    id: 'cf-cache',
    title: '캐시 및 동작',
    description: '캐시 정책 설정',
    render: ({ onNext, onPrev, canGoPrev }) => (
      <CloudFrontCacheBehavior
        onNext={onNext}
        onPrev={onPrev}
        canGoPrev={canGoPrev}
      />
    ),
  },
  {
    id: 'cf-website',
    title: '웹사이트 설정',
    description: 'Default Root Object',
    render: ({ onNext, onPrev, canGoPrev }) => (
      <CloudFrontWebsiteSettings
        onNext={onNext}
        onPrev={onPrev}
        canGoPrev={canGoPrev}
      />
    ),
  },
]

export default function Problem1Page({
  searchParams,
}: {
  readonly searchParams: Promise<{ q?: string }>
}) {
  return (
    <div className="bg-background min-h-screen">
      {/* Problem Header */}
      <div className="bg-card border-b">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="bg-primary text-primary-foreground rounded-md px-3 py-1 text-sm font-semibold">
                문제 #1
              </span>
              <h1 className="text-3xl font-bold">
                React 앱을 S3와 CloudFront로 배포하기
              </h1>
            </div>
            <p className="text-muted-foreground text-lg">
              React 빌드 결과물은 html, css, js등 정적 파일입니다.
              <br />
              즉, 정적 자원을 전송하는 웹 서버만 있어도 유저가 브라우저로 볼 수
              있다는 의미입니다.
              <br /> 이번 문제에서는 객체저장소인 S3와 CDN서비스인 CloudFront를
              활용해서 간단하게 전세계에 배포하는 과정을 실습합니다.
            </p>
            <div className="flex gap-2">
              <span className="bg-muted text-muted-foreground rounded-md px-3 py-1 text-sm">
                난이도: 하
              </span>
              <span className="bg-muted text-muted-foreground rounded-md px-3 py-1 text-sm">
                예상 시간: 30분
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Steps Navigator */}
      <Suspense
        fallback={
          <div className="gird items-center">
            <Spinner className="size-6" />
          </div>
        }
      >
        <StepsNavigator
          steps={REACT_DEPLOY_STEPS}
          defaultStep={0}
          queryParamName="step"
          className="p-6"
        />
      </Suspense>
    </div>
  )
}
