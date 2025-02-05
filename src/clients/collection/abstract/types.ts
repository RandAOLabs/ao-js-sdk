export interface CollectionInfo {
    Name: string;
    Description: string;
    Creator: string;
    Banner: string;
    Thumbnail: string;
    DateCreated: string;
    Assets: string[];
}

export interface UpdateAssetsRequest {
    AssetIds: string[];
    UpdateType: 'Add' | 'Remove';
}
