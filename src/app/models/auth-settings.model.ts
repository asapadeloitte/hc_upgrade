export interface IAuthSettings {
    authority: string;
    client_id: string;
    redirect_uri: string;
    silent_redirect_uri: string;
    response_type: string;
    scope: string;
    post_logout_redirect_uri: string;
    revokeAccessTokenOnSignout: string;
    automaticSilentRenew: boolean;
    silentRequestTimeout: number;
    accessTokenExpiringNotificationTime: number;
    loadUserInfo: boolean;
}
