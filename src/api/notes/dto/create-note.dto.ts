import { Type } from "class-transformer";
import { IsArray, IsInt, IsOptional, IsString, ValidateIf, ValidateNested } from "class-validator"

export class CreateNoteDto {
    @IsString()
    @IsOptional()
    name?: string

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Tag) // Assuming you have a TagDto defined similarly
    tags?: Tag[];
}

export class Tag {
    @IsInt()
    @IsOptional()
    id?: number;

    @IsString()
    name?: string;
}
