import { Address } from "./address";

export class User {
    username: string = '';
    firstName: string = '';
    lastName: string = '';
    email: string = '';
    birthDate: number = 0;
    address: Address = new Address();
    password: string = '';
    enabled: boolean = true;
}
