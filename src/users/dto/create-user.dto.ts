//import {RoleEntity} from "../../roles/entity/role.entity";

export class CreateUserDto {
    id: number;
    email: string
    firstName: string;
    lastName: string;

    createdDate: Date;
    lastModified?: Date;
    active?: boolean;

    roleId: number;
}
