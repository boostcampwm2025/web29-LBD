import type { Control, FieldValues, UseFormSetValue } from 'react-hook-form'

export interface AwsSectionProps<
  T extends FieldValues,
  TConfig extends Record<string, boolean> = Record<string, boolean>,
> {
  control: Control<T>
  config: TConfig
}

export type AwsWithSetValueSectionProps<
  T extends FieldValues,
  TConfig extends Record<string, boolean> = Record<string, boolean>,
> = {
  setValue: UseFormSetValue<T>
} & AwsSectionProps<T, TConfig>

/**
 * 서비스별 Section 타입을 일괄 생성하는 유틸리티 타입
 * @example
 * type S3Types = AwsServiceSectionTypes<S3BucketFormData, S3BucketCreateConfig>
 * export type S3SectionProps = S3Types['SectionProps']
 */
export type AwsServiceSectionTypes<
  TForm extends FieldValues,
  TConfig extends Record<string, boolean>,
> = {
  SectionProps: AwsSectionProps<TForm, TConfig>
  WithSetValueProps: AwsWithSetValueSectionProps<TForm, TConfig>
}
