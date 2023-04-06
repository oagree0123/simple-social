import express, { Express } from 'express'
import SimpleSocial from "simple-social"; 

const kakaoLogin = new SimpleSocial(
  {
    clientId: process.env.CLIENT_ID,
    redirectUri: process.env.REDIRECT_SERVER + '/oauth/kakao/callback'
  },
  async (accessToken, refreshToken, data, req) => {
    const userData = {
      id: data.id,
      email: data.kakao_account.email
    }

    const userProfile = await socialUser("kakao", userData);

    if (userProfile) req.body.userProfile = userProfile;
  }

const app: Express = express();

app.use(kakaoLogin.init('kakao'));

app.get('/kakao/callback', kakaoLogin.getProfile, () => {
  const { userProfile } = req.body;
});

app.listen(process.env.PORT || 4000, async () => {
  console.log('server start!')
});