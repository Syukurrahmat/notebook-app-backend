import { PartialType } from '@nestjs/mapped-types';
import { CreateNoteDto } from './create-tag.dto';

export class UpdateNoteDto extends PartialType(CreateNoteDto) {}
