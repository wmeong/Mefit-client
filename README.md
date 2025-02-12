🎨 MeFit Client
📋 프로젝트 개요
MeFit Client는 메이플스토리 캐릭터의 색 조합 시뮬레이션 및 의상 가챠 기능을 직관적으로 경험할 수 있는 웹 애플리케이션입니다.
사용자는 자신의 캐릭터를 검색하고, 컬러 스타일을 실시간으로 조합하며, 로얄 스타일과 같은 의상 가챠 시뮬레이션을 통해 다양한 스타일을 탐색할 수 있습니다.
Vue.js 기반으로 개발되어, 부드러운 UI/UX와 빠른 반응성을 제공합니다.

🛠️ 사용 기술 및 환경
💻 개발 도구 (IDE)
Visual Studio Code
WebStorm (선택 사항)
🌐 프레임워크 & 라이브러리
Vue.js 3 (Composition API 기반)
Vuetify (UI 컴포넌트)
Axios (API 통신)
Pinia (상태 관리)
Vue Router (클라이언트 사이드 라우팅)
🎨 스타일 & 애니메이션
SCSS
Framer Motion (애니메이션)
🚀 번들링 & 패키지 매니저
Vite (빠른 빌드 속도)
npm (패키지 관리)
📦 설치 및 실행 방법
💡 필수 환경 구성
Node.js 설치

Node.js 다운로드 페이지에서 LTS 버전 다운로드 및 설치
설치 후 node -v 및 npm -v 명령어로 정상 설치 확인
Vue CLI 설치 (필요시)

bash
복사
편집
npm install -g @vue/cli
🛠️ 프로젝트 클론 및 실행
bash
복사
편집
# GitHub에서 프로젝트 클론
git clone https://github.com/KhnDev/mefit-client.git
cd mefit-client

# 패키지 설치
npm install

# 개발 서버 실행
npm run dev
👉 기본 실행 주소: http://localhost:5173/

📌 프로젝트 구조
csharp
복사
편집
mefit-client
│── public/           # 정적 파일 (favicon, index.html)
│── src/
│   ├── assets/       # 스타일, 이미지, 글로벌 리소스
│   ├── components/   # 재사용 가능한 Vue 컴포넌트
│   ├── views/        # 페이지 단위 Vue 컴포넌트
│   ├── router/       # Vue Router 설정
│   ├── store/        # Pinia 상태 관리
│   ├── utils/        # 유틸리티 함수
│   ├── main.js       # 진입점 파일
│── package.json      # 프로젝트 정보 및 종속성
│── vite.config.js    # Vite 설정 파일
│── .gitignore        # Git에서 제외할 파일 목록
🎯 커밋 규칙 (Commit Message Convention)
📑 커밋 유형 (타입)
feat: 새로운 기능 추가 (예: feat: 캐릭터 색상 조정 기능 추가)
fix: 버그 수정 (예: fix: 검색 필터 버그 수정)
docs: 문서 수정 (예: docs: README 업데이트)
style: UI 스타일 변경 (예: style: 버튼 테두리 조정)
refactor: 코드 리팩토링 (예: refactor: 캐릭터 데이터 로직 개선)
test: 테스트 코드 추가 또는 수정 (예: test: 캐릭터 검색 기능 테스트 추가)
chore: 빌드 및 패키지 관련 변경 (예: chore: eslint 설정 추가)
📑 커밋 메시지 작성 규칙
첫 글자는 소문자로 작성 (feat:, fix:, docs: 등).
: 뒤에 한 칸 띄고 내용을 작성 (feat: Add new color theme).
필요 시 한 줄 띄우고 상세 설명 추가 가능.
📌 코드 스타일 가이드
✅ Vue 스타일 가이드
Composition API 권장 (setup() 사용)
SCSS 사용 (<style lang="scss" scoped>)
컴포넌트 네이밍 컨벤션
PascalCase 사용 (ColorPicker.vue, GachaSimulator.vue)
폴더별로 index.vue 활용 가능 (/views/Home/index.vue)
✅ CSS 스타일 가이드
BEM 네이밍 규칙 권장 (block__element--modifier)
SCSS 변수를 적극 활용 ($primary-color, $secondary-color)
반응형 디자인 고려 (Vuetify breakpoints 활용)
🔥 주요 기능
🎨 캐릭터 색상 조합 시뮬레이션

사용자가 직접 색상을 조합하여 프리뷰 확인
퍼스널 컬러 분석 기능 제공
🎰 로얄 스타일 가챠 시뮬레이션

실제 메이플스토리 확률 기반 가챠 구현
뽑기 이력 및 확률 표시
🚀 실시간 캐릭터 검색

닉네임 검색으로 캐릭터 데이터 로드
캐릭터 장비 및 스타일 프리뷰
📂 스타일 보관함

코디 조합 저장 및 공유 기능
저장한 코디 불러와 비교 가능
🎭 테마 및 디자인 컨셉
레트로 픽셀 아트 스타일 적용
메이플스토리 UI 느낌 유지
어두운 테마(Dark Mode) 지원 예정
👥 팀원 및 기여 방법
팀원: Hana (KhnDev), 기타 기여자
기여 가이드: CONTRIBUTING.md
📌 배포 (Deployment)
개발 환경: Vite + npm
배포 환경: AWS S3, CloudFront (예정)
CI/CD: GitHub Actions (예정)
📜 라이선스
이 프로젝트는 비공개 프로젝트이며, 무단 사용 및 배포를 금지합니다.

