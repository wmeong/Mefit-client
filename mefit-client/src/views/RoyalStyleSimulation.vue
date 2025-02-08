<template>
    <v-container class="pa-4">
        <!-- CustomAlert 컴포넌트 -->
        <CustomAlert
            v-if="showAlert"
            :message="alertMessage"
            :visible="showAlert"
            @close="closeCustomAlert"
        />
        <v-row justify="center" class="mb-4">
            <div class="royal-style-banner">
                <div class="royal-style-background">
                    <h1 class="royal-style-title">Royal Style</h1>
                </div>
            </div>
        </v-row>
        <!-- 첫 번째 줄: 1번, 3번, 4번 -->
        <v-row class="px-2">
            <!-- 1번: 로얄스타일 결산 영역 -->
            <v-col cols="4" class="royal-style-result">
                <v-card
                    outlined
                    class="pl-8 pr-8 pt-4"
                    style="min-height: 250px"
                >
                    <h3 class="font-weight-bold">로얄스타일 결산</h3>
                    <v-row>
                        <v-col cols="6" class="mt-10 result-item">
                            <v-icon color="yellow" class="mr-2"
                                >mdi-trophy</v-icon
                            >
                            <v-list-item-content
                                >쿠폰 사용 횟수</v-list-item-content
                            >
                        </v-col>
                        <v-col cols="6" class="text-right mt-10">
                            <v-list-item-content
                                >{{ couponCount }}개</v-list-item-content
                            >
                        </v-col>
                        <v-col cols="6" class="result-item">
                            <v-icon color="grey" class="mr-2"
                                >mdi-trophy-variant</v-icon
                            >
                            <v-list-item-content
                                >스페셜 라벨</v-list-item-content
                            >
                        </v-col>
                        <v-col cols="6" class="text-right">
                            <v-list-item-content
                                >{{ specialLabelCount }}개</v-list-item-content
                            >
                        </v-col>
                        <v-col cols="6" class="result-item">
                            <v-icon color="grey" class="mr-2"
                                >mdi-trophy-variant</v-icon
                            >
                            <v-list-item-content>사용 캐시</v-list-item-content>
                        </v-col>
                        <v-col cols="6" class="text-right">
                            <v-list-item-content>
                                {{ formattedUsedCash }}
                                캐시
                            </v-list-item-content>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>

            <!-- 3번: 로얄스타일 뽑기 영역 -->
            <v-col cols="5" class="royal-style-pick">
                <v-card
                    outlined
                    class="pa-4 d-flex flex-column"
                    style="min-height: 250px; position: relative"
                >
                    <!-- 새로고침 버튼 -->
                    <v-btn
                        class="refresh-button"
                        icon
                        small
                        color="primary"
                        v-tooltip.bottom="'새로고침'"
                        @click="resetSimulation"
                        style="position: absolute; top: 10px; right: 10px"
                    >
                        <v-icon>mdi-refresh</v-icon>
                    </v-btn>

                    <h3 class="font-weight-bold text-center">
                        로얄스타일 뽑기
                    </h3>
                    <!-- characterImage가 있을 때 -->
                    <v-img
                        v-if="characterImage"
                        :src="characterImage"
                        contain
                        width="100"
                        height="100"
                        class="mb-4 mx-auto character-image"
                    ></v-img>

                    <!-- characterImage가 없을 때 (blare 이미지) -->
                    <v-img
                        v-else
                        :src="require('@/assets/royalstyle/blare.png')"
                        contain
                        width="70"
                        height="70"
                        class="mb-4 mx-auto character-image"
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
                            <span
                                class="search-icon"
                                v-tooltip.bottom="'검색'"
                                @click="searchCharacter"
                                >&#128269;</span
                            >
                        </div>
                        <v-btn
                            size="small"
                            class="custom-btn mr-2"
                            color="pink"
                            @click="startSimulation"
                            >뽑기</v-btn
                        >
                        <v-btn
                            size="small"
                            class="custom-btn"
                            color="purple"
                            outlined
                            @click="saveRanking"
                            >저장</v-btn
                        >
                    </v-row>
                </v-card>
            </v-col>

            <!-- 4번: 운세 영역 -->
            <v-col cols="3" class="royal-fortune">
                <v-card
                    outlined
                    class="pa-4 d-flex flex-column justify-start align-center"
                    style="min-height: 250px; position: relative"
                >
                    <div class="royal-fortune-header">
                        <h3>로얄깡 운세</h3>
                    </div>

                    <!-- 운세 메시지가 없을 때 -->
                    <div v-if="!fortuneMessage" class="fortune-container">
                        <img
                            src="@/assets/fortune.png"
                            alt="fortune"
                            class="fortune-image"
                        />
                    </div>

                    <!-- 운세 퍼센트 -->
                    <p v-if="fortuneMessage" class="fortune-percentage">
                        {{ formattedRatio }}%
                    </p>

                    <!-- 운세 상태 메시지 (이모티콘 포함) -->
                    <div v-if="fortuneMessage" class="fortune-status-box">
                        <p class="fortune-status">{{ fortuneTitle }}</p>
                        <p class="fortune-icon">{{ fortuneIcon }}</p>
                    </div>

                    <!-- 운세 설명 메시지 -->
                    <div v-if="fortuneMessage" class="fortune-message-box">
                        <p class="text-center">{{ fortuneMessage }}</p>
                    </div>
                </v-card>
            </v-col>
        </v-row>

        <!-- 두 번째 줄: 2번, 5번 -->
        <v-row class="mt-4 px-2">
            <!-- 2번: 실시간 랭킹 영역 -->
            <v-col cols="4" class="ranking-section">
                <v-card
                    outlined
                    class="pa-4"
                    style="min-height: 350px; height: 550px"
                >
                    <h3 class="font-weight-bold">실시간 랭킹 10</h3>
                    <v-list dense>
                        <v-list-item
                            v-for="(user, index) in ranking"
                            :key="index"
                            class="ranking-item"
                            :class="{ 'tenth-place': index === 9 }"
                        >
                            <div class="ranking-row">
                                <div class="ranking-user-info">
                                    <!-- 순위 -->
                                    <span class="ranking-user-rank">
                                        {{ index + 1 }}
                                    </span>
                                    <!-- 회색 동그라미 컨테이너 -->
                                    <div class="ranking-avatar-container">
                                        <img
                                            :src="user.avatarUrl"
                                            alt="Avatar"
                                            class="ranking-avatar"
                                        />
                                    </div>
                                    <!-- 닉네임 -->
                                    <span class="ranking-user-name">
                                        {{ user.nickname }}
                                    </span>
                                </div>
                                <!-- 유저 퍼센티지 -->
                                <div class="ranking-user-percentage">
                                    {{ user.percentage }}%
                                </div>
                            </div>
                        </v-list-item>
                    </v-list>
                </v-card>
            </v-col>

            <!-- 5번: 뽑기 결과 저장 영역 -->
            <v-col cols="8" class="pick-result">
                <v-card
                    outlined
                    class="pa-4"
                    style="min-height: 350px; height: 550px; overflow-y: auto"
                >
                    <h3 class="font-weight-bold">로얄스타일 결과</h3>

                    <!-- 데이터가 없는 경우 -->
                    <div
                        v-if="recentResults.length === 0"
                        class="no-results-container"
                    >
                        <img
                            src="@/assets/style.png"
                            alt="No Results"
                            class="no-results-image"
                        />
                    </div>

                    <!-- 데이터 있는 경우   -->
                    <v-row class="d-flex flex-wrap justify-start mt-4">
                        <v-col
                            v-for="(result, index) in recentResults"
                            :key="index"
                            cols="auto"
                            class="d-flex flex-column align-center"
                            style="
                                flex: 0 0 calc(20%);
                                max-width: calc(20%);
                                position: relative;
                            "
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
                                <p
                                    class="text-center"
                                    v-html="
                                        result.name
                                            .replace(/,/g, '<br>')
                                            .replace(
                                                /(.*)(교환권)$/,
                                                '$1<br>$2'
                                            )
                                    "
                                ></p>
                                <p class="text-center">
                                    {{ result.probability }}
                                </p>
                            </div>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>

        <!-- 슈피겔만 애니메이션 -->
        <transition name="shupi-animation">
            <div
                v-if="showShupi"
                class="shupi-container"
                style="position: absolute; z-index: 20"
            >
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
                    <v-btn
                        @click="resetSimulation"
                        color="pink"
                        class="popup-reset-button"
                        >예</v-btn
                    >
                    <v-btn
                        @click="cancelReset"
                        outlined
                        color="purple"
                        class="popup-reset-button"
                        >아니오</v-btn
                    >
                </div>
            </div>
        </div>

        <!-- 로얄스타일 뽑기 결과 팝업 -->
        <div
            v-if="showPopup"
            class="popup-result"
            @click="closePopup"
            style="position: absolute; z-index: 10"
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
                        <div
                            v-for="(image, index) in getPopupImages()"
                            :key="index"
                        >
                            <img
                                :src="image"
                                alt="Item Image"
                                class="popup-image"
                            />
                            <!-- Special Label 이미지 표시 -->
                            <img
                                v-if="isSpecialLabel"
                                :src="require('@/assets/special.png')"
                                alt="Special Label"
                            />
                        </div>
                    </div>

                    <!-- 아이템 이름 표시 -->
                    <p class="item-name pt-4">{{ formattedItemNames }}</p>
                    <p class="item-probability">
                        {{ simulationResult.probability }}
                    </p>
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
        CustomAlert, // 컴포넌트 등록
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
            alertMessage: "", // 알림 팝업 메시지
        };
    },
    computed: {
        royalIcon() {
            return require("@/assets/royalstyle/blare.png");
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
                    .map((name) => name.trim())
                    .map((name, index) =>
                        index === 0 ? `${name}(남)` : `${name}(여)`
                    )
                    .join(", ");
            } else {
                return this.simulationResult.processedItemNames;
            }
        },
        formattedUsedCash() {
            return this.usedCash.toLocaleString(); // 숫자를 1,000 단위로 쉼표 추가
        },
    },
    methods: {
        async searchCharacter() {
            if (!this.characterName) {
                alert("닉네임을 입력해주세요.");
                return;
            }
            try {
                const response = await axios.get(
                    "http://api.mefit.co.kr/api/characters/info",
                    {
                        params: { name: this.characterName },
                    }
                );
                this.characterImage =
                    response.data.characterInfoDTO.character_image;
            } catch (error) {
                this.alertMessage = "존재하지 않는 캐릭터입니다";
                this.showAlert = true;
                console.error("캐릭터 정보 조회 실패:", error);
            }
        },
        async saveRanking() {
            if (!this.characterName || !this.characterImage) {
                this.alertMessage = "닉네임을 검색한 후 저장하세요.";
                this.showAlert = true; // 팝업 표시
                return;
            }
            if (this.couponCount < 10) {
                this.alertMessage =
                    "쿠폰을 10개 이상 소모해야 저장할 수 있습니다.";
                this.showAlert = true; // CustomAlert 표시
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
                    "http://api.mefit.co.kr/api/royal-style/save-ranking",
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
                    "http://api.mefit.co.kr/api/royal-style/ranking"
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
                    "http://api.mefit.co.kr/api/royal-style/random"
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
                this.isSpecialLabel =
                    this.simulationResult.originalItemName.includes(
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
                    isSpecial: this.isSpecialLabel,
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
            const colors = [
                "#ff0a54",
                "#ff477e",
                "#ff85a1",
                "#fbb1bd",
                "#f9bec7",
            ];

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
                        y: Math.random() - 0.2,
                    },
                    colors,
                });
            }, 250);
        },
        getPopupImages() {
            try {
                const imageNames = this.simulationResult.processedItemNames
                    .split(",")
                    .map((name) => name.trim());
                return imageNames.map((imageName) => {
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
            const ratio = (this.specialLabelCount / this.couponCount) * 100;
            this.formattedRatio =
                ratio % 1 === 0 ? ratio.toFixed(0) : ratio.toFixed(1);

            if (ratio <= 10) {
                this.fortuneTitle = "운이 없음";
                this.fortuneIcon = "😭";
                this.fortuneMessage =
                    "오늘은 쉬어가는 날~\n조용히 게임만 즐기세요!";
            } else if (ratio > 10 && ratio <= 30) {
                this.fortuneTitle = "운이 조금?";
                this.fortuneIcon = "🤔";
                this.fortuneMessage =
                    "조금씩 운이 올라오고 있어요!\n다음엔 더 기대해봐요!";
            } else if (ratio > 30 && ratio <= 40) {
                this.fortuneTitle = "운이 꽤 좋음!";
                this.fortuneIcon = "🍀";
                this.fortuneMessage =
                    "운이 점점 상승 중!\n오늘은 기회가 보이네요!";
            } else if (ratio > 40 && ratio <= 50) {
                this.fortuneTitle = "대박 직전!";
                this.fortuneIcon = "🎉";
                this.fortuneMessage =
                    "운빨 대폭발 직전!\n이제 한 방이 남았습니다!";
            } else {
                this.fortuneTitle = "초대박!!";
                this.fortuneIcon = "💎";
                this.fortuneMessage =
                    "지금이 기회!\n오늘의 주인공은 당신입니다!\n로또 사세요!";
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
    },
};
</script>

<style scoped>
body {
    color: rgb(83, 80, 80); /* 모든 페이지 폰트 : 회색 */
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
    color: rgb(83, 80, 80) !important; /* 모든 페이지 제목 : 회색*/
}

.royal-style-banner {
    margin-top: 20px;
    position: relative;
    background: #ffc0cb;
    overflow: hidden;
    padding: 4px 10px;
    border-radius: 20px;
    box-shadow: none;
}

.royal-style-background {
    background: #ffc0cb;
    padding: 15px;
    border-radius: 20px;
}

.royal-style-title {
    font-size: 1.5rem;
    font-weight: bold;
    color: #ffffff !important;
    text-transform: uppercase;
    text-shadow: 0 0 20px rgba(193, 101, 255, 0.8),
        0 0 40px rgba(255, 223, 0, 0.6), 0 0 60px rgba(255, 223, 0, 0.4);
    letter-spacing: 5px;
}

/* shimmer 효과 */
.royal-style-background::before {
    content: "";
    position: absolute;
    top: 0;
    left: -150%;
    width: 150%;
    height: 100%;
    /* 빛나는 효과 */
    background: linear-gradient(
        120deg,
        transparent,
        rgba(255, 255, 255, 0.3),
        transparent
    );
    transform: skewX(-25deg);
    animation: shimmer 2s infinite;
}

@keyframes shimmer {
    0% {
        left: -150%;
    }
    100% {
        left: 150%;
    }
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
    justify-content: space-between;
    align-items: center;
    width: 100%;
}

/* 닉네임 및 아이콘 */
.ranking-user-info {
    display: flex;
    align-items: center;
}

/* 순위 숫자 */
.ranking-user-rank {
    margin-right: 30px;
}
/* 10위만 조정하는 스타일 */
.tenth-place .ranking-user-rank {
    margin-right: 26px;
}

/* 순위와 닉네임, 아이콘 위치 조정 */
.tenth-place .ranking-user-info {
    margin-left: -3px;
}
/* 닉네임 */
.ranking-user-name {
    margin-left: 8px;
}

/* 퍼센트 */
.ranking-user-percentage {
    text-align: right;
    flex-shrink: 0; /* 줄어들지 않도록 고정 */
    width: 50px;
}

/* 아바타 컨테이너 */
.ranking-avatar-container {
    width: 30px;
    height: 30px;
    background-color: #d3d3d3;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 8px;
}

/* 아바타 */
.ranking-avatar {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    object-fit: cover;
}

/* 3번: 로얄스타일 뽑기 */
.royal-style-pick {
}
.character-image {
    position: relative;
    top: 10px;
}

/*로얄-인풋 박스*/
.royal-input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    background-color: #f9f9f9;
    border-radius: 24px;
    padding: 8px 16px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    width: 230px;
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
    cursor: pointer;
    transition: background-color 0.3s, box-shadow 0.3s;
}
.search-icon:active {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transform: scale(0.95);
}

.refresh-button {
    background-color: #afacacb8 !important;
    width: 30px !important;
    height: 30px !important;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 !important;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    min-width: 30px !important;
}

.refresh-button:hover {
    background-color: #d6d6d6;
}

.refresh-button .v-icon {
    font-size: 16px !important;
}

/* 4번: 운세보기 */
.royal-fortune {
    white-space: pre-line;
}
.fortune-container {
    position: absolute;
    top: 58%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.fortune-image {
    width: 100px;
    animation: bounce 1.5s infinite ease-in-out;
}

.royal-fortune-header {
    text-align: center;
    padding-bottom: 10px;
    border-bottom: 1px solid #e4e2e2;
    margin-bottom: 15px;
    width: 100%;
}

/*운세 공간*/
.royal-fortune {
    text-align: center;
}

/* 퍼센트 표시 */
.fortune-percentage {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 5px;
}
/* 퍼센트 글씨 스타일 */
.fortune-percentage {
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 5px;
    color: #658dd6 !important;
}

/* 운세 상태 (이모티콘 포함) */
.fortune-status {
    font-size: 12px;
    font-weight: bold;
    margin-bottom: 10px;
    color: #2a32427d !important;
}

.fortune-icon {
    font-size: 40px;
    margin-bottom: 10px;
}

/* 운세 메시지 박스 */
.fortune-message-box {
    background-color: #658dd6;
    border-radius: 4px;
    padding: 5px;
    width: 100%;
    text-align: center;
    font-size: 11px;
}

.fortune-message-box p {
    color: white !important;
}

/* 5번: 뽑기 결과 저장 */
.pick-result {
    background-color: #fff;
    overflow-y: auto;
}

.result-image-container {
    display: flex;
    justify-content: center;
}
.result-text {
    font-size: 9.5px;
}
.special-label {
    position: absolute;
    top: 6px;
    left: 8px;
    width: 40px;
    height: 40px;
    z-index: 1;
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

/* 데이터 없는 경우 css */
.no-results-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
}

.no-results-image {
    width: 400px;
    height: auto;
    margin-bottom: 100px;
}

/*초기화(리셋) 팝업 */
.popup-reset {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
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
    width: 52px;
    height: 48px;
}

.popup-image-container img[alt="Special Label"] {
    position: absolute;
    top: 20px;
    left: 53px;
    width: 50px;
    height: 50px;
    z-index: 1;
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
