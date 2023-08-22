# [TransferToken_React_Project-](https://transfer-token-react-project-r2cz.vercel.app/) <br />

주소 : https://transfer-token-react-project-r2cz.vercel.app/ <br />
➡️ AWS에 S3버킷에 프로젝트를 업로드하고, Route53에서 도메인 구입 후 https까지 인증하여 실제 사용가능하도록 서비스를 배포하였습니다. <br />

## TransferToken_Project를 만들게 된 계기
카카오톡 Klip을 이용하여 다른 지갑으로 코인을 보내는데, 특정토큰들(BORA, WEMIX, KLEVA, KCAKE 등)이 없어서 보내는데 불편함을 느꼈다. <br />
안전성으로 토큰목록에 안넣은거같지만, 디파이를 이용자들은 이런 토큰들도 조회할 수 있고 보내는 기능을 만들면 대중들이 모두 사용하는 카카오톡 서비스중 하나인만큼 내가 느낀 불편함이 도움되지않을까 싶어 서비스를 만들게 되었다.
<hr />

## 폴더구조
```
📦src
 ┣ 📂CSS
 ┃ ┣ 📜Klip.css
 ┃ ┣ 📜Modal.css
 ┃ ┣ 📜SendKLAY.css
 ┃ ┗ 📜Token.css
 ┣ 📂components
 ┃ ┣ 📜.DS_Store
 ┃ ┣ 📜Klip.js
 ┃ ┣ 📜MediaQuery.js
 ┃ ┣ 📜Modal.js
 ┃ ┣ 📜SendKLAY.js
 ┃ ┗ 📜Token.js
 ┣ 📂constants
 ┃ ┣ 📜ERC20ABI.json
 ┃ ┗ 📜TOKENS_ADDRESS.js
 ┣ 📂img
 ┃ ┣ 📜KLAY.png
 ┃ ┗ 📜klip.svg
 ┣ 📜.DS_Store
 ┣ 📜App.css
 ┣ 📜App.js
 ┗ 📜index.js
 ```

<hr />

## 작동 화면
### 로그인 전 
<img width="1242" alt="image" src="https://user-images.githubusercontent.com/95120267/176878281-8fb2939d-2f00-4e2a-babd-3c0fb4bb5a33.png">
<img width="1245" alt="image" src="https://user-images.githubusercontent.com/95120267/176878434-32516e15-cb33-4c4a-84cb-eec04bef0179.png">

### 로그인 후
<img width="1241" alt="image" src="https://user-images.githubusercontent.com/95120267/176878590-93e3ff64-6d05-4389-a161-f473444768df.png">
<img width="1246" alt="image" src="https://user-images.githubusercontent.com/95120267/176878640-dedd4355-5fb0-4d50-9278-f5fef8e268f6.png">
<img width="1246" alt="image" src="https://user-images.githubusercontent.com/95120267/176878788-14d45818-6ee4-414d-98df-b2c57ae8af87.png">
<img width="1243" alt="image" src="https://user-images.githubusercontent.com/95120267/176878821-edca8aee-8169-44b0-9e7f-731cb2844c1b.png">

### QR을 스캔하여 전송을 허용하면, Scope확인하는 모달이 뜬다.
<br />
