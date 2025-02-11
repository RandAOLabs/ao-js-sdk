import { ITokenClient } from "./ITokenClient";
import { IGrantToken } from "./IGrantToken";

export interface ITokenGrantClient extends ITokenClient, IGrantToken {}
