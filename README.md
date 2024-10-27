# Mefit-client

1. 노드 깔기
https://velog.io/@ljs923/Node.js-%EB%8B%A4%EC%9A%B4%EB%A1%9C%EB%93%9C-%EB%B0%8F-%EC%84%A4%EC%B9%98%ED%95%98%EA%B8%B0
여기서 노드 20.18.0 <- 노드에서 추천해주는 장기지원 버전 설치
2. view프로젝트 만들기
https://rosedaily101.tistory.com/31
이해 필요하면 읽기 !
1) 터미널 열기 (단축키 : ctrl+1)
2. C:\Users\사용자폴더  하위에 npm install -g @vue/cli 입력 하여 뷰 설치하기
3. cmd창에 vue --version 입력해 vue 설치 여부 확인하기
4. 프로젝트 생성하기 ex) 설치하고 싶은 폴더 하위에 vue create mefit-client 입력
5. ? Please pick a preset: (Use arrow keys)
> Default ([Vue 3] babel, eslint)       
  Default ([Vue 2] babel, eslint)       
  Manually select features 
뜨면 3버전을 사용하기 때문에 그대로 엔터 치기
그다음 url 에 써진대로 따라하기
6. 서버 키기 npm run serve
>
> 1. 데이터베이스 생성하기
(채지피티한테 데이터베이스 생성방법 물어보기 mefit_dev로 생성)

2. 연결하기 
데이터베이스 - 연결 들어가서 mysql선택 후
> database: mefit_dev
> username : 기존 mysql 아이디 (root)
> password: 기존 mysql 패스워드 

> Driver properties -> 없는거 받기

