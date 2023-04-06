"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var superagent_1 = __importDefault(require("superagent"));
var KAKAO_HOST = 'https://kauth.kakao.com/oauth/authorize';
var KAKAO_TOKEN = 'https://kauth.kakao.com/oauth/token';
var KAKAO_PROFILE = 'https://kapi.kakao.com/v2/user/me';
var NAVER_HOST = 'https://nid.naver.com/oauth2.0/authorize';
var NAVER_TOKEN = 'https://nid.naver.com/oauth2.0/token';
var NAVER_PROFILE = 'https://openapi.naver.com/v1/nid/me';
var GOOGLE_HOST = 'https://accounts.google.com/o/oauth2/v2/auth';
var GOOGLE_TOKEN = 'https://oauth2.googleapis.com/token';
var GOOGLE_PROFILE = 'https://www.googleapis.com/oauth2/v2/userinfo';
var SimpleSocial = /** @class */ (function () {
    function SimpleSocial(option, callback) {
        var _this = this;
        this.init = function (service) { return function (req, res, next) {
            var initParams = new URLSearchParams({
                response_type: "code",
                client_id: _this.clientId,
                redirect_uri: _this.redirectUri,
            }).toString();
            if (service === 'kakao') {
                _this.callbackUrl = KAKAO_HOST + '?' + initParams;
                _this.tokenUrl = KAKAO_TOKEN;
                _this.profileUrl = KAKAO_PROFILE;
            }
            else if (service === 'naver') {
                _this.callbackUrl = NAVER_HOST + '?' + initParams;
                _this.tokenUrl = NAVER_TOKEN;
                _this.profileUrl = NAVER_PROFILE;
            }
            else if (service === 'google') {
                _this.callbackUrl = GOOGLE_HOST + '?' + initParams;
                _this.tokenUrl = GOOGLE_TOKEN;
                _this.profileUrl = GOOGLE_PROFILE;
            }
            _this.service = service;
            next();
        }; };
        this.getProfile = function (req, res, next) {
            var code = req.query.code;
            var params = new URLSearchParams({
                grant_type: "authorization_code",
                code: code,
                client_id: _this.clientId,
                redirect_uri: _this.redirectUri,
                client_secret: _this.clientSecret,
            });
            superagent_1.default.post("".concat(_this.tokenUrl, "?").concat(params))
                .then(function (data) {
                var accessToken = data.body.access_token;
                var refreshToken = data.body.refresh_token;
                (0, superagent_1.default)("".concat(_this.profileUrl, "?access_token=").concat(accessToken))
                    .set('Authorization', "Bearer ".concat(accessToken))
                    .then(function (data) {

                    if (_this.callback) {
                        _this.callback(accessToken, refreshToken, data.body, req).then(function () {
                            next();
                        });
                    }
                });
            });
        };
        this.clientId = option.clientId;
        this.redirectUri = option.redirectUri;
        this.clientSecret = option.clientSecret || undefined;
        this.callback = callback;
    }
    return SimpleSocial;
}());
exports.default = SimpleSocial;
