import { IsOptional, IsString, ValidateIf } from "class-validator"

export class CreateNotebookDto {
    @IsString()
    @IsOptional()
    name?: string

    @IsString()
    @IsOptional()
    description?: string

    @IsString()
    @IsOptional()
    emoji?: string
}