import request from 'superagent';

const KAKAO_HOST = 'https://kauth.kakao.com/oauth/authorize'
const KAKAO_TOKEN = 'https://kauth.kakao.com/oauth/token'
const KAKAO_PROFILE = 'https://kapi.kakao.com/v2/user/me'
const NAVER_HOST = 'https://nid.naver.com/oauth2.0/authorize'
const NAVER_TOKEN = 'https://nid.naver.com/oauth2.0/token'
const NAVER_PROFILE = 'https://openapi.naver.com/v1/nid/me'
const GOOGLE_HOST = 'https://accounts.google.com/o/oauth2/v2/auth'
const GOOGLE_TOKEN = 'https://oauth2.googleapis.com/token'
const GOOGLE_PROFILE = 'https://www.googleapis.com/oauth2/v2/userinfo'

export default class SimpleSocial {
  clientId: string
  redirectUri: string
  clientSecret: string
  callback: Function
  callbackUrl: string
  tokenUrl: string
  profileUrl: string
  service: string

  constructor(option, callback) {
    this.clientId = option.clientId;
    this.redirectUri = option.redirectUri;
    this.clientSecret = option.clientSecret || undefined;
    this.callback = callback;
  }

  init = (service: string) => (req, res, next) => {
    const initParams = new URLSearchParams({
      response_type: "code",
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
    }).toString();

    if (service === 'kakao') {
      this.callbackUrl = KAKAO_HOST + '?' + initParams;
      this.tokenUrl = KAKAO_TOKEN;
      this.profileUrl = KAKAO_PROFILE
    }
    else if (service === 'naver') {
      this.callbackUrl = NAVER_HOST + '?' + initParams;
      this.tokenUrl = NAVER_TOKEN;
      this.profileUrl = NAVER_PROFILE
    }
    else if (service === 'google') {
      this.callbackUrl = GOOGLE_HOST + '?' + initParams;
      this.tokenUrl = GOOGLE_TOKEN;
      this.profileUrl = GOOGLE_PROFILE
    }

    this.service = service;
    next();
  }

  getProfile = (req, res, next) => {
    const { code } = req.query;

    const params = new URLSearchParams({
      grant_type: "authorization_code",
      code: code,
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      client_secret: this.clientSecret,
    });

    request.post(`${this.tokenUrl}?${params}`)
    .then((data: any) => {
      const accessToken = data.body.access_token;
      const refreshToken = data.body.refresh_token;

      request(`${this.profileUrl}?access_token=${accessToken}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .then((data: any) => {
        if (this.callback) {
          this.callback(accessToken, refreshToken, data.body, req).then(() => {
            next();
          });
        }
      })
    });
  }
}