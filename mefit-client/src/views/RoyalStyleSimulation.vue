<template>
  <v-container class="pa-4">
    <!-- CustomAlert 컴포넌트 -->
   <CustomAlert
  v-if="showAlert"
  :message="alertMessage"
  :visible="showAlert"
  @close="closeCustomAlert"
/>
    <!-- 첫 번째 줄: 1번, 3번, 4번 -->
    <v-row class="px-2">
      <!-- 1번: 로얄스타일 결산 영역 -->
      <v-col cols="4" class="royal-style-result">
        <v-card outlined class="pl-8 pr-8 pt-4" style="min-height: 250px;">
          <h3 class="font-weight-bold">로얄스타일 결산</h3>
          <v-row>
            <v-col cols="6" class="mt-10 result-item">
              <v-icon color="yellow" class="mr-2">mdi-trophy</v-icon>
              <v-list-item-content>쿠폰 사용 횟수</v-list-item-content>
            </v-col>
            <v-col cols="6" class="text-right mt-10">
              <v-list-item-content>{{ couponCount }}개</v-list-item-content>
            </v-col>
            <v-col cols="6" class="result-item">
              <v-icon color="grey" class="mr-2">mdi-trophy-variant</v-icon>
              <v-list-item-content>스페셜 라벨</v-list-item-content>
            </v-col>
            <v-col cols="6" class="text-right">
              <v-list-item-content>{{ specialLabelCount }}개</v-list-item-content>
            </v-col>
            <v-col cols="6" class="result-item">
              <v-icon color="grey" class="mr-2">mdi-trophy-variant</v-icon>
              <v-list-item-content>사용 캐시</v-list-item-content>
            </v-col>
            <v-col cols="6" class="text-right">
              <v-list-item-content>{{ formattedUsedCash }} 캐시</v-list-item-content>
            </v-col>
          </v-row>
        </v-card>
      </v-col>

      <!-- 3번: 로얄스타일 뽑기 영역 -->
      <v-col cols="5" class="royal-style-pick">
        <v-card
          outlined
          class="pa-4 d-flex flex-column"
          style="min-height: 250px; position: relative;"
        >
          <!-- 새로고침 버튼 -->
          <v-btn
            icon
            small
            color="primary"
            @click="resetSimulation"
            style="position: absolute; top: 10px; right: 10px;"
          >
            <v-icon>mdi-refresh</v-icon>
          </v-btn>

          <!-- 기존 로얄스타일 뽑기 내용 -->
          <h3 class="font-weight-bold text-center">로얄스타일 뽑기</h3>
          <v-img
            :src="characterImage || require('@/assets/royalstyle/royalicon.png')"
            contain
            width="110"
            height="110"
            class="mb-4 mx-auto"
          ></v-img>
          <v-row class="align-center justify-center">
            <div class="royal-input-wrapper mr-4">
              <input
                v-model="characterName"
                type="text"
                placeholder="닉네임 입력"
                class="royal-input"
                @keyup.enter="searchCharacter"
              />
              <span class="search-icon" @click="searchCharacter">&#128269;</span>
            </div>
            <v-btn size="small" class="custom-btn mr-2" color="pink" @click="startSimulation">뽑기</v-btn>
            <v-btn size="small" class="custom-btn" color="purple" outlined @click="saveRanking">저장</v-btn>
          </v-row>
        </v-card>
      </v-col>

      <!-- 4번: 운세 영역 -->
      <v-col cols="3" class="royal-fortune">
        <v-card
          outlined
          class="pa-4 d-flex flex-column justify-start align-center"
          style="min-height: 250px;"
        >
          <h3 class="text-h10 font-weight-bold text-center">로얄깡 운세</h3>
          <p class="text-center mt-10">{{ fortuneMessage }}</p>
        </v-card>
      </v-col>
    </v-row>

    <!-- 두 번째 줄: 2번, 5번 -->
    <v-row class="mt-4 px-2">
      <!-- 2번: 실시간 랭킹 영역 -->
      <v-col cols="4" class="ranking-section">
        <v-card outlined class="pa-4" style="min-height: 350px; height: 550px;">
          <h3 class="font-weight-bold">실시간 랭킹 10</h3>
          <v-list dense>
            <v-list-item v-for="(user, index) in ranking" :key="index" class="ranking-item">
              <div class="ranking-row">
                <div class="ranking-user-info">
                  <!-- 순위 -->
                  <span class="ranking-user-rank">{{ index + 1 }}</span>
                  <!-- 회색 동그라미 컨테이너 -->
                  <div class="ranking-avatar-container">
                    <img :src="user.avatarUrl" alt="Avatar" class="ranking-avatar" />
                  </div>
                  <!-- 닉네임 -->
                  <span class="ranking-user-name">{{ user.nickname }}</span>
                </div>
                <!-- 유저 퍼센티지 -->
                <div class="ranking-user-percentage">{{ user.percentage }}%</div>
              </div>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>

      <!-- 5번: 뽑기 결과 저장 영역 -->
      <v-col cols="8" class="pick-result">
        <v-card outlined class="pa-4" style="min-height: 350px; height: 550px; overflow-y: auto;">
          <h3 class="font-weight-bold">로얄스타일 결과</h3>
          <v-row class="d-flex flex-wrap justify-start">
            <v-col
              v-for="(result, index) in recentResults"
              :key="index"
              cols="auto"
              class="d-flex flex-column align-center"
              style="flex: 0 0 calc(20%); max-width: calc(20%); position: relative;"
            >
              <!-- Special Label 표시 -->
              <img
                v-if="result.isSpecial"
                :src="require('@/assets/special.png')"
                alt="Special Label"
                class="special-label"
              />
              <!-- 이미지 컨테이너 -->
              <div class="result-image-container">
                <v-img
                  v-for="(image, imgIndex) in result.images"
                  :key="imgIndex"
                  :src="image"
                  contain
                  width="50"
                  height="50"
                  class="result-image"
                ></v-img>
              </div>
              <!-- 이름 및 확률 -->
              <div class="result-text font-size:7px">
                <p class="text-center">{{ result.name }}</p>
                <p class="text-center">{{ result.probability }}</p>
              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <!-- 슈피겔만 애니메이션 -->
    <transition name="shupi-animation">
      <div v-if="showShupi" class="shupi-container" style="position: absolute; z-index: 20;">
        <img :src="shupiImage" alt="shupi" class="shupi-image" />
      </div>
    </transition>

    <!-- 초기화(리셋) 팝업 -->
    <div v-if="showResetPopup" class="popup-reset">
      <div class="popup-reset-content reset-popup">
        <h3 class="popup-reset-title">초기화 확인</h3>
        <p class="popup-reset-message">
          쿠폰 100개를 소모했습니다.
          <br />초기화하시겠습니까?
        </p>
        <div class="popup-reset-buttons">
          <v-btn @click="resetSimulation" color="pink" class="popup-reset-button">예</v-btn>
          <v-btn @click="cancelReset" outlined color="purple" class="popup-reset-button">아니오</v-btn>
        </div>
      </div>
    </div>

    <!-- 로얄스타일 뽑기 결과 팝업 -->
    <div
      v-if="showPopup"
      class="popup-result"
      @click="closePopup"
      style="position: absolute; z-index: 10;"
    >
      <transition name="popup-animation">
        <div class="popup-result-content">
          <!-- 폭죽 효과 -->
          <div v-if="isSpecialLabel" class="firework-container">
            <div class="firework"></div>
            <div class="firework"></div>
            <div class="firework"></div>
          </div>

          <!-- 여러 개의 이미지 렌더링 -->
          <div class="popup-image-container">
            <div v-for="(image, index) in getPopupImages()" :key="index">
              <img :src="image" alt="Item Image" class="popup-image" />
              <!-- Special Label 이미지 표시 -->
              <img v-if="isSpecialLabel" :src="require('@/assets/special.png')" alt="Special Label" />
            </div>
          </div>

          <!-- 아이템 이름 표시 -->
          <p class="item-name pt-4">{{ formattedItemNames }}</p>
          <p class="item-probability">{{ simulationResult.probability }}</p>
        </div>
      </transition>
    </div>
  </v-container>
</template>

<script>
import axios from "axios";
import confetti from "canvas-confetti";
import CustomAlert from "@/components/CustomAlert.vue";

export default {
  components: {
    CustomAlert // 컴포넌트 등록
  },
  data() {
    return {
      characterName: "", // 입력된 캐릭터 이름
      characterImage: null, // 가져온 캐릭터 이미지 URL
      simulationResult: {},
      showPopup: false,
      showShupi: false,
      recentResults: [],
      isSpecialLabel: false,
      specialLabelCount: 0, // 스페셜 라벨 카운트 추가
      couponCount: 0, // 쿠폰 사용 횟수
      showResetPopup: false, // 초기화 팝업 표시 여부
      isSimulationDisabled: false, // 시뮬레이션 사용 불가 여부
      fortuneMessage: "",
      formattedRatio: "",
      ranking: [],
      showAlert: false, // 알림 팝업 표시 여부
      alertMessage: "" // 알림 팝업 메시지
    };
  },
  computed: {
    royalIcon() {
      return require("@/assets/royalstyle/royalicon.png");
    },
    shupiImage() {
      return require("@/assets/shupi.png");
    },
    usedCash() {
      return this.couponCount * 2200;
    },
    formattedItemNames() {
      if (
        this.simulationResult.processedItemNames &&
        this.simulationResult.processedItemNames.includes(",")
      ) {
        return this.simulationResult.processedItemNames
          .split(",")
          .map(name => name.trim())
          .map((name, index) => (index === 0 ? `${name}(남)` : `${name}(여)`))
          .join(", ");
      } else {
        return this.simulationResult.processedItemNames;
      }
    },
    formattedUsedCash() {
      return this.usedCash.toLocaleString(); // 숫자를 1,000 단위로 쉼표 추가
    }
  },

  methods: {
    async searchCharacter() {
      if (!this.characterName) {
        alert("닉네임을 입력해주세요.");
        return;
      }
      try {
        const response = await axios.get(
          "http://localhost:8081/api/characters/ocid",
          {
            params: { name: this.characterName }
          }
        );
        this.characterImage = response.data.characterInfoDTO.character_image;
      } catch (error) {
        console.error("캐릭터 정보 조회 실패:", error);
      }
    },

    async saveRanking() {
      if (!this.characterName || !this.characterImage) {
        this.alertMessage = "닉네임을 검색한 후 저장하세요.";
        this.showAlert = true; // 팝업 표시
        console.log(this.showAlert, this.alertMessage); // 값 확인
        return;
      }

      try {
        const percentage = Number(this.formattedRatio);
        if (isNaN(percentage)) {
          throw new Error("Invalid formattedRatio value");
        }

        const params = new URLSearchParams();
        params.append("nickname", this.characterName);
        params.append("percentage", percentage.toFixed(1));
        params.append("avatarUrl", this.characterImage);

        await axios.post(
          "http://localhost:8081/api/royal-style/save-ranking",
          params
        );
        this.alertMessage = "랭킹이 저장되었습니다."; // 팝업 메시지 설정
        this.showAlert = true; // 팝업 표시
        this.fetchRanking(); // 최신 랭킹 데이터 갱신
        this.resetSimulation();
      } catch (error) {
        this.alertMessage = "랭킹 저장 실패. 다시 시도해주세요."; // 실패 메시지
        this.showAlert = true;
        console.error("랭킹 저장 실패:", error);
      }
    },

    async fetchRanking() {
      try {
        const response = await axios.get(
          "http://localhost:8081/api/royal-style/ranking"
        );
        this.ranking = response.data; // 랭킹 데이터를 갱신
      } catch (error) {
        console.error("랭킹 조회 실패:", error);
      }
    },
    async startSimulation() {
      if (this.isAnimating || this.showResetPopup) return; // 중복 실행 방지

      // 시뮬레이션이 중단된 상태라면 초기화 팝업을 다시 띄움
      if (this.isSimulationDisabled) {
        this.showResetPopup = true;
        return;
      }

      // 중복 실행 방지 및 초기화 팝업 표시 시 시뮬레이션 중단
      //if (this.isAnimating || this.isSimulationDisabled || this.showResetPopup) return;

      this.isAnimating = true;
      this.showShupi = true;
      this.showPopup = false; // 팝업 표시

      // 슈피겔만 애니메이션 후 팝업 표시
      this.timer = setTimeout(async () => {
        this.showShupi = false; // 슈피겔만 애니메이션 종료
        this.showPopup = true; // 팝업 표시
        await this.showPopupResult(); // 팝업 결과 표시
      }, 400);

      // 애니메이션 스킵 이벤트
      //window.addEventListener("keydown", this.skipAnimation);
    },

    async showPopupResult() {
      try {
        if (this.isSimulationDisabled) return; // 집계 중단 조건 추가

        const response = await axios.get(
          "http://localhost:8081/api/royal-style/random"
        );
        this.simulationResult = response.data;

        // 쿠폰 사용 횟수 증가
        this.couponCount++;

        // 초기화 조건 체크
        if (this.couponCount >= 100) {
          this.showResetPopup = true;
          return;
        }

        // 스페셜 라벨 체크
        this.isSpecialLabel = this.simulationResult.originalItemName.includes(
          "[스페셜 라벨]"
        );

        if (this.isSpecialLabel) {
          this.fireConfetti(); // 폭죽 효과 실행
          this.specialLabelCount++; // 스페셜 라벨 카운트 증가
        }

        this.showShupi = false;
        this.showPopup = true;

        this.calculateFortune();

        // 모든 이미지 저장
        const popupImages = this.getPopupImages();

        // 결과 저장 (최대 100개 유지)
        this.recentResults.unshift({
          images: popupImages, // ✅ 여러 이미지 저장
          //image: this.getPopupImages()[0],
          name: this.formattedItemNames,
          probability: this.simulationResult.probability,
          isSpecial: this.isSpecialLabel
        });
        if (this.recentResults.length > 100) {
          this.recentResults.pop();
        }
      } catch (error) {
        console.error("Error starting simulation:", error);
      } finally {
        this.isAnimating = false;
      }
    },
    resetSimulation() {
      this.couponCount = 0;
      this.specialLabelCount = 0;
      this.recentResults = [];
      this.showResetPopup = false;
      this.isSimulationDisabled = false; // 초기화 시 플래그 리셋
      this.fortuneMessage = "";
      this.showShupi = false;
    },
    cancelReset() {
      this.isSimulationDisabled = true;
      this.showResetPopup = false;
      this.showShupi = false;
    },
    skipAnimation(event) {
      if (this.showResetPopup) return; // 초기화 팝업이 열려 있으면 동작 중지

      if (event.key === "Enter") {
        // 폭죽 애니메이션 중지
        if (this.confettiInterval) {
          clearInterval(this.confettiInterval);
          this.confettiInterval = null;
        }

        if (this.showShupi) {
          clearTimeout(this.timer);
          this.showPopupResult();
        } else if (this.showPopup) {
          this.closePopup();
        } else {
          this.startSimulation();
        }
      }
    },
    closePopup() {
      this.showPopup = false;
    },
    handleKeydown(event) {
      if (event.key === "Escape" && this.showPopup) {
        this.closePopup(); // Esc 키로 팝업 닫기
      }
    },
    fireConfetti() {
      const duration = 2 * 1000;
      const animationEnd = Date.now() + duration;
      const colors = ["#ff0a54", "#ff477e", "#ff85a1", "#fbb1bd", "#f9bec7"];

      this.confettiInterval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) {
          return clearInterval(this.confettiInterval);
        }

        confetti({
          particleCount: 40,
          startVelocity: 30,
          spread: 360,
          origin: {
            x: Math.random(),
            y: Math.random() - 0.2
          },
          colors
        });
      }, 250);
    },
    getPopupImages() {
      try {
        const imageNames = this.simulationResult.processedItemNames
          .split(",")
          .map(name => name.trim());
        return imageNames.map(imageName => {
          try {
            // 이미지가 있으면 해당 이미지를 로드
            return require(`@/assets/royalstyle/${imageName}.png`);
          } catch (error) {
            // 이미지가 없으면 디폴트 이미지를 로드
            return require("@/assets/royalstyle/bomb.png");
          }
        });
      } catch (error) {
        console.warn("Some images not found:", error);
        return [];
      }
    },
    calculateFortune() {
      // 쿠폰이 10개 단위일 때만 계산
      if (this.couponCount % 10 !== 0) return;
      const ratio = (this.specialLabelCount / this.couponCount) * 100;

      // 소수점이 0으로 끝나면 정수로 표시, 아니면 소수점 첫째 자리까지 표시
      this.formattedRatio =
        ratio % 1 === 0 ? ratio.toFixed(0) : ratio.toFixed(1);

      if (ratio <= 10) {
        this.fortuneMessage = `${this.formattedRatio}%\n오늘은 쉬어가는 날~ 
    조용히 게임만 즐기세요! 🎮`;
      } else if (ratio > 10 && ratio <= 20) {
        this.fortuneMessage = `${this.formattedRatio}%\n조금씩 운이 올라오고 있어요! 
    다음엔 더 기대해봐요! 😊`;
      } else if (ratio > 20 && ratio <= 30) {
        this.fortuneMessage = `${this.formattedRatio}%\n운이 점점 상승 중! 
    오늘은 기회가 보이네요! 🍀`;
      } else if (ratio > 30 && ratio <= 40) {
        this.fortuneMessage = `${this.formattedRatio}%\n운빨 대폭발 직전! 
    이제 한 방이 남았습니다! 🎉`;
      } else {
        this.fortuneMessage = `${this.formattedRatio}%\n지금이 기회! 
    오늘의 주인공은 당신입니다! 
    로또 사세요! 💎`;
      }
    },
      closeCustomAlert() {
    this.showAlert = false; // 팝업을 닫습니다.
  },
  },
  mounted() {
    this.fetchRanking(); // 기존 랭킹 데이터 불러오기
    window.addEventListener("keydown", this.handleKeydown); // 전역 키 이벤트 등록
  },
  unmounted() {
    window.removeEventListener("keydown", this.handleKeydown); // 이벤트 리스너 제거
  }
};
</script>

<style scoped>
body {
  color: rgb(83, 80, 80); /* 모든 페이지의 기본 글씨 색상을 회색으로 설정 */
}

h1,
h2,
h3,
h4,
h5,
h6,
p,
span,
v-list-item-content,
input {
  color: rgb(
    83,
    80,
    80
  ) !important; /* 모든 제목, 텍스트 요소도 회색으로 설정 */
}

/* 1번: 로얄스타일 결과 */
.royal-style-result {
}
.result-item {
  display: flex;
  align-items: center;
}

/* 2번: 실시간 랭킹 */
.ranking-section {
}

.ranking-item {
  padding: 4px 0;
}

/* 전체 행: 닉네임과 퍼센트를 구분 */
.ranking-row {
  display: flex;
  justify-content: space-between; /* 닉네임 왼쪽, 퍼센트 오른쪽 */
  align-items: center; /* 수직 정렬 */
  width: 100%; /* 각 행을 꽉 채움 */
}

/* 닉네임 및 아이콘 */
.ranking-user-info {
  display: flex;
  align-items: center; /* 닉네임과 아이콘 수직 정렬 */
}

/* 순위 숫자 */
.ranking-user-rank {
  margin-right: 30px; /* 닉네임과 간격 조정 */
}
/* 닉네임 */
.ranking-user-name {
  margin-left: 8px; /* 아이콘과 닉네임 간 여백 */
}

/* 퍼센트 */
.ranking-user-percentage {
  text-align: right; /* 오른쪽 정렬 */
  flex-shrink: 0; /* 줄어들지 않도록 고정 */
  width: 50px; /* 퍼센트 고정 너비 */
}

/* 아바타 컨테이너 */
.ranking-avatar-container {
  width: 30px; /* 컨테이너의 너비 */
  height: 30px; /* 컨테이너의 높이 (너비와 동일) */
  background-color: #d3d3d3; /* 회색 배경색 */
  border-radius: 50%; /* 원형으로 만들기 */
  display: flex; /* 내부 정렬을 위해 flex 사용 */
  align-items: center; /* 세로 중앙 정렬 */
  justify-content: center; /* 가로 중앙 정렬 */
  margin-right: 8px; /* 닉네임과 간격 조정 */
}

/* 아바타 */
.ranking-avatar {
  width: 28px; /* 아바타 크기 */
  height: 28px; /* 아바타 크기 */
  border-radius: 50%; /* 아바타 자체도 원형 */
  object-fit: cover; /* 이미지를 자르지 않고 맞춤 */
}

/* 3번: 로얄스타일 뽑기 */
.royal-style-pick {
}

/*로얄-인풋 박스*/
.royal-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  background-color: #f9f9f9;
  border-radius: 24px; /* 둥글게 */
  padding: 8px 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 그림자 */
  width: 230px; /* 입력창 너비 */
}
/*로얄 인풋 텍스트*/
.royal-input {
  border: none;
  outline: none;
  flex: 1;
  background-color: transparent;
  font-size: 12px;
}
.search-icon {
  cursor: pointer; /* 마우스 커서를 포인터로 변경 */
  transition: background-color 0.3s, box-shadow 0.3s; /* 효과 전환 */
}
.search-icon:active {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 클릭 시 그림자 축소 */
  transform: scale(0.95); /* 클릭 시 살짝 눌리는 효과 */
}
/* 4번: 운세보기 */
.royal-fortune {
  white-space: pre-line; /* 줄바꿈 처리 */
}

/* 5번: 뽑기 결과 저장 */
.pick-result {
  background-color: #fff;
  overflow-y: auto;
}

.result-image-container {
  display: flex; /* 이미지 정렬을 위한 플렉스 박스 */
  justify-content: center; /* 좌우 정렬 */
}
.result-text {
  font-size: 9.5px;
}
.special-label {
  position: absolute;
  top: 6px; /* 상단 간격 */
  left: 8px; /* 우측 간격 */
  width: 40px; /* 이미지 너비 */
  height: 40px; /* 이미지 높이 */
  z-index: 1; /* 다른 요소 위에 표시 */
}

/* 폭죽 */

.firework-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.firework {
  position: absolute;
  width: 20px;
  height: 20px;
  background-color: transparent;
  border-radius: 50%;
  animation: explode 0.8s ease-out forwards;
}

@keyframes explode {
  0% {
    transform: scale(0.5);
    opacity: 1;
  }
  100% {
    transform: scale(3);
    opacity: 0;
  }
}

/*초기화(리셋) 팝업 */
/* 초기화(리셋) 팝업 */
.popup-reset {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* 반투명 배경 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* 팝업이 항상 위에 표시되도록 */
}

.popup-reset-content {
  background-color: #fff;
  width: 360px;
  padding: 20px 30px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: fadeIn 0.3s ease-in-out;
}

.popup-reset-title {
  font-size: 15px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
}

.popup-reset-message {
  font-size: 13px;
  margin-bottom: 20px;
  color: #555;
  line-height: 1.4;
}

.popup-reset-buttons {
  display: flex;
  gap: 10px;
  width: 100%;
  justify-content: center;
}

.popup-reset-button {
  font-size: 12px;
  font-weight: bold;
  padding: 10px 20px;
  border-radius: 8px;
  transition: background-color 0.3s, color 0.3s;
}

/* 애니메이션 효과 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/*결과 팝업*/
.popup-result {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.popup-result-content {
  background-color: #fff;
  width: 320px;
  height: 170px;
  padding: 20px;
  font-size: 11px;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transform: scale(1);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.popup-image-container {
  display: flex;
  gap: 20px;
  justify-content: center;
  padding-top: 30px;
}

.popup-image {
  width: 52px; /* 이미지의 너비 */
  height: 48px; /* 이미지의 높이 */
}

.popup-image-container img[alt="Special Label"] {
  position: absolute;
  top: 20px; /* 상단 위치 */
  left: 53px; /* 왼쪽 위치 */
  width: 50px; /* 너비 */
  height: 50px; /* 높이 */
  z-index: 1; /* 다른 요소 위에 표시 */
}

/*슈피겔만 이미지 css */
.shupi-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.shupi-image {
  width: 200px;
  animation: shake 0.3s;
}

/* 애니메이션 효과 */
@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  20%,
  60% {
    transform: translateX(-10px);
  }
  40%,
  80% {
    transform: translateX(10px);
  }
}

.popup-animation-enter-active {
  animation: scaleUp 0.5s ease-out forwards;
}

@keyframes scaleUp {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
</style>
