import { IsArray, ValidateNested, IsString, IsObject } from 'class-validator';
import { Type } from 'class-transformer';

export class ConfigDto {
  @IsString()
  configType: string;

  @IsObject()
  configInfo: Record<string, any>;
}

export class SubmitRequestDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ConfigDto)
  submitConfig: ConfigDto[];
}
