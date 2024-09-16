import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsInt, IsOptional, IsString, ValidateNested } from 'class-validator';
// DTO yang memiliki updatedContent sebagai array dari Difference[]

export class UpdateContentDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Difference)
    updatedContent?: Difference[];
}


export class Difference {
    @IsInt()
    index?: number;

    @IsOptional()
    @IsString()
    value?: string;

    @IsInt()
    count?: number;

    @IsBoolean()
    added?: boolean;

    @IsBoolean()
    removed?: boolean;
}

