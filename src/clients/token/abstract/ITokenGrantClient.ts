import { IGrantToken } from "src/clients/token/abstract/IGrantToken";
import { ITokenClient } from "src/clients/token/abstract/ITokenClient";


export interface ITokenGrantClient extends ITokenClient, IGrantToken { }
