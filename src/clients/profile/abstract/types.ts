/** Profile data structure */
export interface Profile {
    UserName?: string;
    DisplayName?: string;
    Description?: string;
    CoverImage?: string;
    ProfileImage?: string;
    DateCreated?: string;
    DateUpdated?: string;
}

/** Asset data structure */
export interface Asset {
    Id: string;
    Type?: string;
    Quantity: string;
}

/** Collection data structure */
export interface Collection {
    Id: string;
    Name: string;
    SortOrder: number;
}

/** Profile info response */
export interface ProfileInfo {
    Profile: Profile;
    Assets: Asset[];
    Collections: Collection[];
    Owner: string;
}
