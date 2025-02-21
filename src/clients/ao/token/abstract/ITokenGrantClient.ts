import { IGrantToken } from "src/clients/ao/token/abstract/IGrantToken";
import { ITokenClient } from "src/clients/ao/token/abstract/ITokenClient";



export interface ITokenGrantClient extends ITokenClient, IGrantToken { }
