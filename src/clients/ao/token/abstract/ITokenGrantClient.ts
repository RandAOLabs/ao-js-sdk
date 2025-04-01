import { IGrantToken } from "./IGrantToken";
import { ITokenClient } from "./ITokenClient";



export interface ITokenGrantClient extends ITokenClient, IGrantToken { }
