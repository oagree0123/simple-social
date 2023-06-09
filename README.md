# simple-social
nodejs express 기반 소셜로그인

## install

```sh
npm install simple-social
```

### 1.0v 사용가능 서비스
kakao, naver, google

## 사용법
1. 각 서비스에서 애플리케이션 등록
2. 서비스에 맞게 redirect uri 설정 
> - {server주소}/oauth/{service}/callback
3. simple-social 사용

```javascript
// 기본 설정
const kakaoLogin = new SimpleSocial(
  {
    // api_key, redirect_uri 설정
    clientId: process.env.API_KEY,
    redirectUri: process.env.REDIRECT_SERVER + "/oauth/kakao/callback",
  },
  async (accessToken, refreshToken, data, req) => {
  	// 받아온 데이터 활용하는 구간
  }
);

// get 요청시 호출
const socialLogin = async (req: Request, res: Response) => {
  try {
    const { userData } = req.body;

    res.cookie("userNo", userData.id);
    res.cookie("email", userData.email);
    res.redirect(process.env.REDIRECT_CLIENT);
  } catch (error) {
    console.log(error);
  }
};

// middleware 및 get 요청
app.use(kakaoLogin.init("kakao"));
app.get("/oauth/kakao/callback", kakaoLogin.getProfile, socialLogin);
```
