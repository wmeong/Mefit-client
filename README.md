# 🎨 MeFit Client
## 📋 프로젝트 개요
MeFit Client는 메이플스토리 캐릭터의 색 조합 시뮬레이션 및 의상 가챠 기능을 직관적으로 경험할 수 있는 웹 애플리케이션입니다.
사용자는 자신의 캐릭터를 검색하고, 컬러 스타일을 실시간으로 조합하며, 로얄 스타일과 같은 의상 가챠 시뮬레이션을 통해 다양한 스타일을 탐색할 수 있습니다.
Vue.js 기반으로 개발되어, 부드러운 UI/UX와 빠른 반응성을 제공합니다.

## 🛠️ 사용 기술 및 환경

### 💻 개발 도구 (IDE)
- **Visual Studio Code
### 🌐 프레임워크 & 라이브러리
- **Vue.js 3 (Composition API 기반)
- **Vuetify (UI 컴포넌트)
- **Axios (API 통신)
  
### 🎨 스타일 & 애니메이션
- SCSS


## 📦 설치 및 실행 방법

### 💡 필수 환경 구성
1. Node.js 다운로드 페이지에서 LTS 버전 다운로드 및 설치
2. 설치 후 node -v 및 npm -v 명령어로 정상 설치 확인
3. Vue CLI 설치 (필요시) - npm install -g @vue/cli
4. 패키지 설치 : npm install
   
### 🛠️ 프로젝트 클론 및 실행
# GitHub에서 프로젝트 클론
- git clone https://github.com/KhnDev/mefit-client.git

# 개발 서버 실행
npm run dev
👉 기본 실행 주소: http://localhost:8080/


## 🎯 커밋 규칙 (Commit Message Convention)

### 📑 커밋 유형 (타입)
1. feat: 새로운 기능 추가.
2. fix: 버그 수정.
3. docs: 문서 수정 (예: README 업데이트).
4. style: 코드 포맷 변경 및 UI 변경 (세미콜론 추가/제거 등 기능에 영향 없는 수정).
5. refactor: 코드 리팩토링 (기능 변경 없이 구조 개선).
6. test: 테스트 코드 추가 또는 수정 (프로덕션 코드 변경 없음).
7. chore: 빌드 설정 또는 패키지 설정 변경 (프로덕션 코드와 무관).

### 📑 커밋 메시지 작성 규칙 
1. 첫 글자는 소문자로 작성합니다.
   (예: feat:  fix:  style:  test: ).    
2. : 이후에 한 칸 띄우고 내용을 작성합니다.
   (예: feat: Add login functionality).
3. 필요 시 한 줄 띄우고 상세 설명을 추가합니다.


## 🎯 주요 기능
1. 캐릭터 정보 검색 및 조회
- 메이플스토리 공식 API를 활용하여 캐릭터 정보를 검색
- 캐릭터의 외형, 모션, 감정 표현, 장비 정보 조회 가능
- 검색한 캐릭터의 코디 정보를 기반으로 색상 분석
2. 퍼스널컬러 분석 기능
- 캐릭터의 메인컬러 및 서브컬러 분석
- 12가지 퍼스널컬러 유형(봄/여름/가을/겨울)으로 자동 분류
- HSV(Hue, Saturation, Value) 값을 기반으로 색상 매칭
3. 로얄 스타일 가챠 시뮬레이션
- 메이플 한달마다 바뀌는 로얄스타일 공지화면 크롤링을 통해 실제 게임과 동일한 확률로 가챠 실행
- 최신 가챠 아이템 리스트를 자동으로 DB에 저장 및 갱신
- 최대 100회 연속 가챠 시뮬레이션 가능
4. 실시간 인기 캐릭터 랭킹 시스템
- Redis Cloud 기반의 실시간 인기 캐릭터 랭킹 제공
- 유저가 검색한 캐릭터 데이터 분석 후 인기 순위 반영
- 가장 운이 좋은 캐릭터의 (스페셜라벨 당첨 성공률 기반) 실시간 노출
5. 컬러피커(Color Picker) 기능
- 캐릭터 이미지에서 사용자가 직접 원하는 색상을 추출 가능
- 추출된 색상 데이터를 저장하고 다른 코디와 비교 가능
6. 투표 및 선호도 기반 랭킹 기능
- 사용자들이 가장 어울리는 계절 타입(봄/여름/가을/겨울) 투표 가능
- Local Storage를 활용하여 30분 내 중복 투표 방지 기능 제공
7. 데이터 자동 삭제 기능
- 데이터 테이블이 일정 초과 시 자동 삭제 기능 구현 (1000개, 10000개 단위)

## 📌 프로젝트 폴더 구조
mefit-client
mefit-client/
- src/
  - assets/                    # 스타일, 이미지, 글로벌 리소스
  - components/                 # 재사용 가능한 Vue 컴포넌트
    - CustomAlert.vue           # 공통 알림창 컴포넌트
  - layouts/                    # 레이아웃 관련 컴포넌트
    - AppContent.vue            # 메인 콘텐츠 레이아웃
    - AppFooter.vue             # 푸터 레이아웃
    - AppHeader.vue             # 헤더 레이아웃
  - mixins/                     # 재사용 가능한 Vue Mixin
    - colorAnalysisMixin.js     # 컬러 분석 기능 Mixin
  - plugins/                    # 플러그인 설정
    - vuetify.js                # Vuetify 설정 파일
    - index.js                  # 플러그인 초기화
  - router/                     # Vue Router 설정
    - index.js                  # 라우터 설정 파일
  - views/                      # 페이지 단위 Vue 컴포넌트
    - AvatarDressing.vue        # 캐릭터 코디 뷰
    - CharacterInfo.vue         # 캐릭터 정보 조회 페이지
    - CharacterInfoPopup.vue    # 캐릭터 정보 팝업
    - ColorAwards.vue           # 컬러 관련 어워즈 기능
    - ColorPick.vue             # 컬러 피커 화면
    - Home.vue                  # 홈 화면
    - PersonalColorDetail.vue   # 개인 컬러 상세 분석
    - PersonalColorSelect.vue   # 개인 컬러 선택 페이지
    - PersonalColorTwelve.vue   # 12가지 퍼스널 컬러 분석
    - RoyalStyleSimulation.vue  # 로얄스타일 가챠 시뮬레이션
  - App.vue                     # Vue 앱의 루트 컴포넌트
  - main.js                     # Vue 앱 초기화 및 마운트



## 📜 라이선스
이 프로젝트의, 무단 사용 및 배포를 금지합니다.
