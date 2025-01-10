<template>
    <div class="royal-style-page">
        <!-- 상단 버튼 -->
        <div class="header">
            <img
                :src="royalIcon"
                alt="Royal Style Button"
                class="royal-button"
                @click="startSimulation"
            />
            <!-- 전광판 -->
            <div class="label-counter">
                <p>
                    쿠폰 사용 횟수: <span>{{ couponCount }}</span> 개
                </p>
                <p>
                    스페셜 라벨: <span>{{ specialLabelCount }}</span> 개
                </p>
                <p>
                    사용 캐시: <span>{{ usedCash }}</span> 캐시
                </p>
            </div>
        </div>
        <!-- 보물상자 애니메이션 -->
        <transition name="chest-animation">
            <div v-if="showChest" class="chest-container">
                <img :src="chestImage" alt="Chest" class="chest-image" />
            </div>
        </transition>

        <!-- 초기화 팝업 -->
        <div v-if="showResetPopup" class="popup-overlay">
            <div class="popup-content reset-popup">
                <p>쿠폰 100개를 소모했습니다.<br />초기화하시겠습니까?</p>
                <div class="popup-buttons">
                    <button @click="resetSimulation">예</button>
                    <button @click="cancelReset">아니오</button>
                </div>
            </div>
        </div>

        <!-- 팝업 -->
        <div v-if="showPopup" class="popup-overlay" @click="closePopup">
            <transition name="popup-animation">
                <div class="popup-content">
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
                        </div>
                    </div>

                    <!-- 아이템 이름 표시 -->
                    <p class="item-name">{{ formattedItemNames }}</p>
                    <p class="item-probability">
                        {{ simulationResult.probability }}
                    </p>
                </div>
            </transition>
        </div>

        <!-- 뽑기 결과 저장 영역 -->
        <div class="result-table">
            <div
                v-for="(result, index) in recentResults"
                :key="index"
                class="result-row"
            >
                <img
                    :src="result.image"
                    alt="Item Image"
                    class="result-image"
                />
                <div class="result-details">
                    <p class="result-name">{{ result.name }}</p>
                    <p class="result-probability">
                        확률: {{ result.probability }}
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import confetti from "canvas-confetti";

export default {
    data() {
        return {
            simulationResult: {},
            showPopup: false,
            showChest: false,
            recentResults: [],
            isSpecialLabel: false,
            specialLabelCount: 0, // 스페셜 라벨 카운트 추가
            couponCount: 0, // 쿠폰 사용 횟수
            showResetPopup: false, // 초기화 팝업 표시 여부
            isSimulationDisabled: false, // 시뮬레이션 사용 불가 여부
        };
    },
    computed: {
        royalIcon() {
            return require("@/assets/royalstyle/royalicon.png");
        },
        chestImage() {
            return require("@/assets/royalstyle/royalicon.png");
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
    },
    methods: {
        async startSimulation() {
            if (this.isAnimating) return; // 중복 실행 방지

            // 시뮬레이션이 중단된 상태라면 초기화 팝업을 다시 띄움
            if (this.isSimulationDisabled) {
                this.showResetPopup = true;
                return;
            }

            // 중복 실행 방지 및 초기화 팝업 표시 시 시뮬레이션 중단
            //if (this.isAnimating || this.isSimulationDisabled || this.showResetPopup) return;

            this.isAnimating = true;
            this.showChest = true;

            // 보물상자 애니메이션 실행
            this.timer = setTimeout(async () => {
                await this.showPopupResult();
            }, 400);

            // 엔터 키 이벤트 등록
            window.addEventListener("keydown", this.skipAnimation);
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
                this.isSpecialLabel =
                    this.simulationResult.originalItemName.includes(
                        "[스페셜 라벨]"
                    );

                if (this.isSpecialLabel) {
                    this.fireConfetti(); // 폭죽 효과 실행
                    this.specialLabelCount++; // 스페셜 라벨 카운트 증가
                }

                this.showChest = false;
                this.showPopup = true;

                // 결과 저장 (최대 40개 유지)
                this.recentResults.unshift({
                    image: this.getPopupImages()[0],
                    name: this.formattedItemNames,
                    probability: this.simulationResult.probability,
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
        },
        cancelReset() {
            this.isSimulationDisabled = true;
            this.showResetPopup = false;
        },
        skipAnimation(event) {
            if (this.showResetPopup) return; // 초기화 팝업이 열려 있으면 동작 중지

            if (event.key === "Enter") {
                // 폭죽 애니메이션 중지
                if (this.confettiInterval) {
                    clearInterval(this.confettiInterval);
                    this.confettiInterval = null;
                }

                if (this.showChest) {
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
                return imageNames.map((imageName) =>
                    require(`@/assets/royalstyle/${imageName}.png`)
                );
            } catch (error) {
                console.warn("Some images not found:", error);
                return [];
            }
        },
    },
};
</script>

<style scoped>
.royal-style-page {
    padding: 20px;
    text-align: center;
    position: relative;
}
.header {
    margin-bottom: 20px;
}
.royal-button {
    cursor: pointer;
    width: 150px;
    animation: pulse 1.5s infinite;
}

.chest-container {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
.chest-image {
    width: 200px;
    animation: shake 0.3s;
}

.popup-overlay {
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
.popup-content {
    background-color: #fff;
    padding: 20px;
    border-radius: 10px;
    text-align: center;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transform: scale(1);
    display: flex;
    flex-direction: column;
    align-items: center;
}

.popup-image-container {
    display: flex;
    gap: 10px;
    justify-content: center;
}

.popup-image {
    width: 150px;
    height: 150px;
}
.result-table {
    display: grid;
    grid-template-columns: repeat(10, 1fr);
    gap: 10px;
    margin-top: 40px;
}

/* 태블릿 크기 조정 */
@media (max-width: 1024px) {
    .result-table {
        grid-template-columns: repeat(5, 1fr);
    }
}

/* 모바일 크기 조정 */
@media (max-width: 768px) {
    .result-table {
        grid-template-columns: repeat(2, 1fr);
    }
}

.result-image {
    width: 80px;
    height: 80px;
}

/* 모바일 이미지 크기 줄이기 */
@media (max-width: 768px) {
    .result-image {
        width: 60px;
        height: 60px;
    }
}

.result-name {
    font-size: 14px;
    font-weight: bold;
}

.result-probability {
    font-size: 12px;
    color: #666;
}

/* 모바일 텍스트 크기 조정 */
@media (max-width: 768px) {
    .result-name {
        font-size: 12px;
    }
    .result-probability {
        font-size: 10px;
    }
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

/* 전광판 스타일 */
.button-panel {
    display: flex;
    align-items: center;
    gap: 20px;
}

.label-counter {
    font-size: 24px;
    font-weight: bold;
    color: #ff477e;
    background-color: #fff;
    padding: 10px 20px;
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    animation: numberChange 0.3s ease-in-out;
}

/* 숫자 변경 시 애니메이션 */
@keyframes numberChange {
    0% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.2);
    }
    100% {
        transform: scale(1);
    }
}
</style>
