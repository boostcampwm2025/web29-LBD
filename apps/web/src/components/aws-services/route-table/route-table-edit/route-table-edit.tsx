'use client'

import { RoutesEditor, SubnetAssociations } from './sections'

import { useEffect, useMemo } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useProblemForm } from '@/contexts/problem-form-context'
import { getRouteTables } from '@/lib/get-route-tables'
import type {
  RouteItem,
  RouteTableEditFormData,
} from '@/types/aws-services/route-table/route-table.types'

interface RouteTableEditProps {
  onAfterSubmit?: () => void
}

export default function RouteTableEdit({ onAfterSubmit }: RouteTableEditProps) {
  const { submitConfig, setSubmitConfig } = useProblemForm()

  // 1. 필요한 데이터 목록 가져오기 (RouteTable, VPC, Subnet)
  const routeTableItems = getRouteTables(submitConfig)
  const vpcItems = submitConfig.vpc || []
  const subnetItems = submitConfig.subnet || []

  const methods = useForm<RouteTableEditFormData>({
    mode: 'onChange',
    defaultValues: {
      selectedRouteTableId: '',
      routes: [],
      associatedSubnetIds: [],
    },
  })

  const { watch, reset, setValue, handleSubmit, formState } = methods
  const selectedRouteTableId = watch('selectedRouteTableId')
  const isDirty = formState.isDirty

  // 2. 현재 선택된 라우팅 테이블의 VPC ID 찾기
  const selectedRouteTable = routeTableItems.find(
    (rt) => rt.id === selectedRouteTableId,
  )
  const currentVpcId = selectedRouteTable?.data.vpcId

  // 3. 해당 VPC에 속한 서브넷만 필터링 (SubnetAssociations에 전달용)
  const availableSubnets = useMemo(() => {
    if (!currentVpcId) return []
    return subnetItems
      .filter((subnet) => subnet.data.vpcId === currentVpcId)
      .map((subnet) => subnet?.data)
  }, [subnetItems, currentVpcId])

  // 4. 라우팅 테이블 선택 시 폼 초기화 (데이터 매핑 로직 포함)
  useEffect(() => {
    if (!selectedRouteTableId || !selectedRouteTable) return

    const targetData = selectedRouteTable.data

    // (A) 라우트 데이터 매핑: destinationCidrBlock -> destination 변환
    const formRoutes: RouteItem[] = (targetData.routes || []).map(
      (r: { destinationCidr?: string; targetGatewayId?: string }) => ({
        // 저장된 데이터에 destinationCidrBlock이 있다면 이를 destination으로 매핑
        destinationCidr: r.destinationCidr || '',
        targetGatewayId: r.targetGatewayId || '',
      }),
    )

    // (B) local 라우트가 없고, VPC 정보가 있다면 자동으로 추가 (UI 표시용)
    const hasLocalRoute = formRoutes.some((r) => r.targetGatewayId === 'local')
    if (!hasLocalRoute && currentVpcId) {
      const targetVpc = vpcItems.find((v) => v.id === currentVpcId)
      if (targetVpc && targetVpc.data.cidrBlock) {
        formRoutes.unshift({
          destinationCidr: targetVpc.data.cidrBlock,
          targetGatewayId: 'local',
        })
      }
    }

    reset({
      selectedRouteTableId,
      routes: formRoutes,
      associatedSubnetIds:
        targetData.associations?.map((a: { subnetId: string }) => a.subnetId) ||
        [],
    })
  }, [selectedRouteTableId, selectedRouteTable, currentVpcId, vpcItems, reset])

  const handleFormSubmit = handleSubmit((data) => {
    setSubmitConfig((prev) => {
      if (!prev.routeTable) return prev

      return {
        ...prev,
        routeTable: prev.routeTable.map((item) => {
          if (item.id === data.selectedRouteTableId) {
            return {
              ...item,
              isReady: true,
              data: {
                ...item.data,
                routes: data.routes,
                associations: data.associatedSubnetIds.map((subnetId) => ({
                  subnetId,
                })),
              },
            }
          }
          return item
        }),
      }
    })

    reset(data)
    if (onAfterSubmit) onAfterSubmit()
  })

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleFormSubmit}
        className="mx-auto max-w-5xl space-y-6 p-6 pb-20"
      >
        <div className="mb-6 space-y-2">
          <h1 className="text-2xl font-bold">라우팅 테이블 편집</h1>
          <p className="text-muted-foreground text-sm">
            기존 라우팅 테이블의 라우트 규칙 및 서브넷 연결을 수정합니다.
          </p>
        </div>

        {/* 1. 편집 대상 선택 */}
        <div className="bg-card space-y-4 rounded-lg border p-6 shadow-sm">
          <div className="space-y-2">
            <Label>편집할 라우팅 테이블 선택</Label>
            <Select
              onValueChange={(val) => setValue('selectedRouteTableId', val)}
              value={selectedRouteTableId}
            >
              <SelectTrigger className="max-w-xl">
                <SelectValue placeholder="목록에서 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {routeTableItems.length > 0 ? (
                  routeTableItems.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.data.name || item.id} ({item.id})
                    </SelectItem>
                  ))
                ) : (
                  <div className="text-muted-foreground p-2 text-center text-sm">
                    생성된 라우팅 테이블이 없습니다.
                  </div>
                )}
              </SelectContent>
            </Select>
          </div>

          {currentVpcId && (
            <div className="text-muted-foreground bg-muted/50 inline-block rounded border p-3 text-sm">
              <span className="mr-2 font-semibold">VPC:</span>
              {currentVpcId}
            </div>
          )}
        </div>

        {/* 2. 편집 탭 */}
        {selectedRouteTableId && (
          <div className="bg-card animate-in fade-in slide-in-from-bottom-2 overflow-hidden rounded-lg border shadow-sm duration-300">
            <Tabs defaultValue="routes" className="w-full">
              <div className="bg-muted/30 border-b px-6 pt-4">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                  <TabsTrigger value="routes">라우트 편집</TabsTrigger>
                  <TabsTrigger value="associations">서브넷 연결</TabsTrigger>
                </TabsList>
              </div>

              <div className="p-6">
                <TabsContent value="routes" className="mt-0 space-y-6">
                  <RoutesEditor />
                </TabsContent>

                <TabsContent value="associations" className="mt-0 space-y-6">
                  {/* 필터링된 서브넷 목록 전달 */}
                  <SubnetAssociations availableSubnets={availableSubnets} />
                </TabsContent>
              </div>
            </Tabs>

            <div className="bg-muted/10 flex justify-end gap-3 border-t p-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  // 리셋 로직도 useEffect와 동일하게 처리하기 위해
                  // 단순히 선택된 ID를 다시 설정하여 useEffect 트리거 (혹은 useEffect 로직 복사)
                  // 여기서는 간단히 setValue로 트리거합니다.
                  setValue('selectedRouteTableId', '')
                  setTimeout(
                    () =>
                      setValue('selectedRouteTableId', selectedRouteTableId),
                    0,
                  )
                }}
              >
                변경사항 초기화
              </Button>
              <Button
                type="submit"
                className="bg-orange-600 font-bold text-white hover:bg-orange-700"
                disabled={!isDirty}
              >
                변경사항 저장
              </Button>
            </div>
          </div>
        )}
      </form>
    </FormProvider>
  )
}
