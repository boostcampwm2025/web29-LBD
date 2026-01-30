'use client'

import { useForm, Controller } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { SectionContainer } from '@/components/section-container'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useProblemForm } from '@/contexts/problem-form-context'
import { getDefaultSubnets } from '@/lib/get-default-subnets'
import type { NATGatewayFormData, NATGatewaySubmitConfig } from '@/types/aws-services/nat-gateway/nat-gateway.types'

const DEFAULT_VALUES: NATGatewayFormData = {
    nameTag: '',
    subnetId: '',
}

interface NATGatewayCreateProps {
    onSubmit: (data: NATGatewaySubmitConfig) => void
}

export default function NATGatewayCreate({ onSubmit }: NATGatewayCreateProps) {
    const { control, handleSubmit, formState: { isValid }, reset } = useForm<NATGatewayFormData>({
        mode: 'onChange',
        defaultValues: DEFAULT_VALUES,
    })

    const { submitConfig } = useProblemForm()
    const currentSubnets = getDefaultSubnets(submitConfig)

    const handleFormSubmit = handleSubmit((data) => {
        const selectedSubnet = currentSubnets.find(s => s.id === data.subnetId)

        const submitData: NATGatewaySubmitConfig = {
            _type: 'natGateway',
            name: data.nameTag,
            id: data.nameTag || crypto.randomUUID(),
            subnetId: data.subnetId,
            subnetName: selectedSubnet?.name || data.subnetId,
            vpcId: selectedSubnet?.vpcId,
            vpcName: selectedSubnet?.vpcName
        }
        onSubmit(submitData)
        reset(DEFAULT_VALUES)
    })

    return (
        <form onSubmit={handleFormSubmit} className="mx-auto max-w-5xl space-y-6 p-6 pb-20">
            <div className="mb-4 space-y-2">
                <h1 className="text-2xl font-bold">NAT 게이트웨이 생성</h1>
                <p className="text-muted-foreground text-sm">
                    프라이빗 서브넷의 인스턴스가 인터넷에 연결할 수 있도록 NAT 게이트웨이를 생성합니다.
                </p>
            </div>

            {/* Name Section */}
            <SectionContainer title="이름 및 태그" description="NAT 게이트웨이의 이름을 지정합니다.">
                <div className="space-y-2">
                    <Label>이름 태그</Label>
                    <Controller
                        name="nameTag"
                        control={control}
                        rules={{ required: "이름을 입력해주세요." }}
                        render={({ field }) => (
                            <Input {...field} placeholder="my-nat-gateway" />
                        )}
                    />
                </div>
            </SectionContainer>

            {/* Subnet Section */}
            <SectionContainer title="서브넷" description="NAT 게이트웨이를 배치할 퍼블릭 서브넷을 선택합니다.">
                <div className="space-y-2">
                    <Label>서브넷</Label>
                    <Controller
                        name="subnetId"
                        control={control}
                        rules={{ required: "서브넷을 선택해주세요." }}
                        render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="서브넷 선택" />
                                </SelectTrigger>
                                <SelectContent>
                                    {currentSubnets.map(subnet => (
                                        <SelectItem key={subnet.id} value={subnet.id}>
                                            {subnet.name} ({subnet.cidrBlock})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div>
            </SectionContainer>

            <div className="flex justify-end pt-4">
                <Button
                    type="submit"
                    size="lg"
                    disabled={!isValid}
                >
                    NAT 게이트웨이 생성
                </Button>
            </div>
        </form>
    )
}
