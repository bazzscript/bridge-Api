import "reflect-metadata";
import { Container } from "inversify";
import { IAuthService } from "./interfaces/IAuthService";
import { AuthService } from "./services/AuthService";
import { ProfileService } from "./services/ProfileService";
import { IProfileService } from "./interfaces/IProfileService";
import { IPropertyService } from "./interfaces/IPropertyService";
import { PropertyService } from "./services/PropertyService";
import { IPaymentService } from "./interfaces/IPaymentService";
import { PaymentService } from "./services/PaymentService";

const myContainer = new Container();
myContainer.bind<IAuthService>("IAuthService").to(AuthService);
myContainer.bind<IProfileService>("IProfileService").to(ProfileService);
myContainer.bind<IPropertyService>("IPropertyService").to(PropertyService);
myContainer.bind<IPaymentService>("IPaymentService").to(PaymentService);

export { myContainer };
