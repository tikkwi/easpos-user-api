import { IsBoolean, IsMongoId, IsOptional, ValidateIf } from 'class-validator';
import { CreateUserDto } from '@shared/user/user.dto';

export class CreateEmployeeDto extends CreateUserDto {
   @ValidateIf((o) => !o.isOwner)
   @IsMongoId()
   roleId?: string;

   @IsOptional()
   @IsBoolean()
   isOwner?: boolean;
}
