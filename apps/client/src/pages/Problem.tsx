import { useState } from 'react'
import {
  ec2Schema,
  type TFormValues,
  getEC2Warnings,
  type EC2Warning,
} from '@/lib/ec2/ec2ZodSchema'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ReactFlow, type Node, type Edge } from '@xyflow/react'
import {
  initialEdges,
  initialNodes,
  ec2Node,
  ec2Edge,
} from '@/lib/ec2/initDatas'
import '@xyflow/react/dist/style.css'

function Problem() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes)
  const [edges, setEdges] = useState<Edge[]>(initialEdges)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [errorMessages, setErrorMessages] = useState<string[]>([])
  const [warningMessages, setWarningMessages] = useState<EC2Warning[]>([])

  const { handleSubmit, control, getValues } = useForm<TFormValues>({
    defaultValues: {
      instance: 't2.micro',
      ami: '',
      vpc: '',
      subnet: 'subnet-public-1a',
      securityGroup: '',
    },
    mode: 'onChange',
    resolver: zodResolver(ec2Schema),
  })

  const onSubmit = (data: TFormValues) => {
    console.log('Form data:', data)

    // Warning 체크 (error가 아니므로 제출은 진행됨)
    const warnings = getEC2Warnings(data)

    if (warnings.length > 0) {
      console.warn('경고:', warnings)
      // Warning을 모달로 표시
      setErrorMessages([]) // error 초기화
      setWarningMessages(warnings)
      setIsDialogOpen(true)
    }

    // EC2 인스턴스가 이미 추가되었는지 확인
    const ec2Exists = nodes.some((node) => node.id === 'ec2')

    if (!ec2Exists) {
      // EC2 노드와 엣지 추가
      setNodes((prevNodes) => [...prevNodes, ec2Node])
      setEdges((prevEdges) => [...prevEdges, ec2Edge])
    }
  }

  const onError = (errors: unknown) => {
    console.log('Validation errors:', errors)

    // 에러 메시지 수집
    const messages: string[] = []

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Object.entries(errors as any).forEach(([, error]: [string, any]) => {
      if (error?.message) {
        messages.push(error.message)
      }
    })

    // 현재 form 값으로 warning도 체크
    const currentValues = getValues()
    const warnings = getEC2Warnings(currentValues)

    // 에러와 warning을 함께 모달로 표시
    setErrorMessages(messages)
    setWarningMessages(warnings)
    setIsDialogOpen(true)
  }

  return (
    <section className="grid grid-cols-[450px_1fr] h-screen">
      <Tabs defaultValue="description">
        <TabsList>
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="problem">problem</TabsTrigger>
        </TabsList>
        <TabsContent value="description">
          <Card>
            <CardHeader>
              <CardTitle>문제설명</CardTitle>
            </CardHeader>
            <CardContent>정상 동작하는 EC2 인스턴스를 생성하세요.</CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="problem">
          <Card>
            <CardHeader>
              <CardTitle>EC2 인스턴스 설정</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit, onError)}>
                <Controller
                  name="instance"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <Label className="mb-2">인스턴스 타입</Label>
                      <SelectTrigger className="w-full mb-2">
                        <SelectValue placeholder="인스턴스 타입: t2.micro" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="t2.micro">t2.micro</SelectItem>
                        <SelectItem value="t2.small">t2.small</SelectItem>
                        <SelectItem value="t3.micro">t3.micro</SelectItem>
                        <SelectItem value="t3.small">t3.small</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />

                <Controller
                  name="ami"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <Label className="mb-2">AMI</Label>
                      <SelectTrigger className="w-full mb-2">
                        <SelectValue placeholder="Amazon linux 2" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="amazon-linux-2">Amazon 2</SelectItem>
                        <SelectItem value="ubuntu-20.04">
                          Ubuntu 20.04
                        </SelectItem>
                        <SelectItem value="ubuntu-22.04">
                          Ubuntu 22.04
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                <Controller
                  name="vpc"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <Label className="mb-2">VPC</Label>
                      <SelectTrigger className="w-full mb-2">
                        <SelectValue placeholder="VPC (default)" />
                      </SelectTrigger>
                    </Select>
                  )}
                />
                <Controller
                  name="subnet"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <Label className="mb-2">서브넷</Label>
                      <SelectTrigger className="w-full mb-2">
                        <SelectValue placeholder="subnet-public-1a" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="subnet-public-1a">
                          subnet-public-1a
                        </SelectItem>
                        <SelectItem value="subnet-public-1b">
                          subnet-public-1b
                        </SelectItem>
                        <SelectItem value="subnet-private-1a">
                          subnet-private-1a
                        </SelectItem>
                        <SelectItem value="subnet-private-1b">
                          subnet-private-1b
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                <Controller
                  name="securityGroup"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <Label className="mb-2">보안 그룹</Label>
                      <SelectTrigger className="w-full mb-2">
                        <SelectValue placeholder="인스턴스 타입: t2.micro" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sg-ssh">
                          sg-ssh (SSH 허용)
                        </SelectItem>
                        <SelectItem value="sg-web">
                          sg-web (HTTP/HTTPS 허용)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" type="button">
                    힌트 보기
                  </Button>
                  <Button type="submit">인스턴스 시작</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="bg-gray-50">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
        />
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {errorMessages.length > 0
                ? 'EC2 인스턴스 생성 실패'
                : 'EC2 인스턴스 생성 경고'}
            </DialogTitle>
            <DialogDescription>
              {errorMessages.length > 0
                ? '다음 문제를 해결한 후 다시 시도해주세요.'
                : '다음 권장사항을 확인해주세요.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {errorMessages.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-red-600">오류</h4>
                {errorMessages.map((message, index) => (
                  <div
                    key={`error-${index}`}
                    className="flex items-start gap-2 text-sm text-red-600"
                  >
                    <span className="mt-0.5">•</span>
                    <span>{message}</span>
                  </div>
                ))}
              </div>
            )}
            {warningMessages.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-yellow-600">경고</h4>
                {warningMessages.map((warning, index) => (
                  <div
                    key={`warning-${warning.field}-${index}`}
                    className="flex items-start gap-2 text-sm text-yellow-600"
                  >
                    <span className="mt-0.5">•</span>
                    <span>{warning.message}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              확인
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  )
}

export default Problem
