import { IsEmail, IsEnum, IsString, Matches, ValidateIf } from 'class-validator';
import { regex } from '@common/utils/regex';
import { EUser } from '@common/utils/enum';

export class LoginDto {
   @ValidateIf((o) => !!!o.userName)
   @IsEmail()
   email?: string;

   @ValidateIf((o) => !!!o.email)
   @Matches(regex.userName)
   userName?: string;

   @IsString()
   password: string;

   @IsEnum(EUser)
   user: EUser;
}
