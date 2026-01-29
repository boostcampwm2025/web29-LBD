'use client'

import { Plus, Trash2 } from 'lucide-react'

import { Controller, type UseFormReturn, useFieldArray } from 'react-hook-form'

import { SectionContainer } from '@/components/section-container'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DEFAULT_SG_RULE,
  RULE_TYPE_PRESETS,
  type RuleTypePreset,
  SOURCE_PRESETS,
  type SecurityGroupFormData,
} from '@/types/aws-services/ec2/security-group'

interface InboundRulesSectionProps {
  form: UseFormReturn<SecurityGroupFormData>
}

export function InboundRulesSection({ form }: InboundRulesSectionProps) {
  const { control, watch, setValue } = form

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'inboundRules',
  })

  const handleAddRule = () => {
    append({
      ...DEFAULT_SG_RULE,
      id: `rule-${Date.now()}`,
    })
  }

  const handleTypeChange = (index: number, type: RuleTypePreset) => {
    const preset = RULE_TYPE_PRESETS[type]
    setValue(`inboundRules.${index}.type`, type)
    setValue(
      `inboundRules.${index}.protocol`,
      preset.protocol as 'tcp' | 'udp' | '-1',
    )
    setValue(`inboundRules.${index}.fromPort`, preset.fromPort)
    setValue(`inboundRules.${index}.toPort`, preset.toPort)
  }

  const handleSourceChange = (
    index: number,
    source: 'anywhere' | 'anywherev6' | 'custom',
  ) => {
    setValue(`inboundRules.${index}.source`, source)
    if (source === 'anywhere') {
      setValue(`inboundRules.${index}.customCidr`, SOURCE_PRESETS.anywhere)
    } else if (source === 'anywherev6') {
      setValue(`inboundRules.${index}.customCidr`, SOURCE_PRESETS.anywherev6)
    } else {
      setValue(`inboundRules.${index}.customCidr`, '')
    }
  }

  return (
    <SectionContainer
      title="인바운드 규칙"
      description="인스턴스로 들어오는 트래픽을 제어하는 규칙을 추가하세요"
    >
      <div className="space-y-4">
        {fields.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[140px]">유형</TableHead>
                  <TableHead className="w-[100px]">프로토콜</TableHead>
                  <TableHead className="w-[120px]">포트 범위</TableHead>
                  <TableHead className="w-[140px]">소스</TableHead>
                  <TableHead>CIDR</TableHead>
                  <TableHead className="w-[60px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fields.map((field, index) => {
                  const ruleType = watch(`inboundRules.${index}.type`)
                  const source = watch(`inboundRules.${index}.source`)
                  const isCustomType =
                    ruleType === 'Custom TCP' || ruleType === 'Custom UDP'

                  return (
                    <TableRow key={field.id}>
                      {/* 유형 */}
                      <TableCell>
                        <Controller
                          name={`inboundRules.${index}.type`}
                          control={control}
                          render={({ field: typeField }) => (
                            <Select
                              value={typeField.value}
                              onValueChange={(value) =>
                                handleTypeChange(index, value as RuleTypePreset)
                              }
                            >
                              <SelectTrigger className="h-8 text-sm">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.keys(RULE_TYPE_PRESETS).map((type) => (
                                  <SelectItem key={type} value={type}>
                                    {type}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </TableCell>

                      {/* 프로토콜 */}
                      <TableCell>
                        <Controller
                          name={`inboundRules.${index}.protocol`}
                          control={control}
                          render={({ field: protoField }) => (
                            <span className="text-muted-foreground text-sm">
                              {protoField.value === '-1'
                                ? 'All'
                                : protoField.value.toUpperCase()}
                            </span>
                          )}
                        />
                      </TableCell>

                      {/* 포트 범위 */}
                      <TableCell>
                        {isCustomType ? (
                          <div className="flex items-center gap-1">
                            <Controller
                              name={`inboundRules.${index}.fromPort`}
                              control={control}
                              render={({ field: portField }) => (
                                <Input
                                  className="h-8 w-16 text-sm"
                                  placeholder="0"
                                  {...portField}
                                />
                              )}
                            />
                            <span className="text-muted-foreground">-</span>
                            <Controller
                              name={`inboundRules.${index}.toPort`}
                              control={control}
                              render={({ field: portField }) => (
                                <Input
                                  className="h-8 w-16 text-sm"
                                  placeholder="65535"
                                  {...portField}
                                />
                              )}
                            />
                          </div>
                        ) : (
                          <Controller
                            name={`inboundRules.${index}.fromPort`}
                            control={control}
                            render={({ field: portField }) => (
                              <span className="text-muted-foreground text-sm">
                                {portField.value === '0' &&
                                watch(`inboundRules.${index}.toPort`) ===
                                  '65535'
                                  ? 'All'
                                  : portField.value}
                              </span>
                            )}
                          />
                        )}
                      </TableCell>

                      {/* 소스 */}
                      <TableCell>
                        <Controller
                          name={`inboundRules.${index}.source`}
                          control={control}
                          render={() => (
                            <Select
                              value={source}
                              onValueChange={(value) =>
                                handleSourceChange(
                                  index,
                                  value as 'anywhere' | 'anywherev6' | 'custom',
                                )
                              }
                            >
                              <SelectTrigger className="h-8 text-sm">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="anywhere">
                                  Anywhere-IPv4
                                </SelectItem>
                                <SelectItem value="anywherev6">
                                  Anywhere-IPv6
                                </SelectItem>
                                <SelectItem value="custom">Custom</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </TableCell>

                      {/* CIDR */}
                      <TableCell>
                        <Controller
                          name={`inboundRules.${index}.customCidr`}
                          control={control}
                          render={({ field: cidrField }) => (
                            <Input
                              className="h-8 text-sm"
                              placeholder="0.0.0.0/0"
                              disabled={source !== 'custom'}
                              {...cidrField}
                              value={
                                source === 'anywhere'
                                  ? SOURCE_PRESETS.anywhere
                                  : source === 'anywherev6'
                                    ? SOURCE_PRESETS.anywherev6
                                    : cidrField.value
                              }
                            />
                          )}
                        />
                      </TableCell>

                      {/* 삭제 버튼 */}
                      <TableCell>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => remove(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-muted-foreground rounded-md border border-dashed p-8 text-center">
            <p>인바운드 규칙이 없습니다.</p>
            <p className="text-sm">아래 버튼을 클릭하여 규칙을 추가하세요.</p>
          </div>
        )}

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddRule}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          규칙 추가
        </Button>
      </div>
    </SectionContainer>
  )
}
