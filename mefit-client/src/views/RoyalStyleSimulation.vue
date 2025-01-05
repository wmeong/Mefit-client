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
        </div>
        <!-- 보물상자 애니메이션 -->
        <transition name="chest-animation">
            <div v-if="showChest" class="chest-container">
                <img :src="chestImage" alt="Chest" class="chest-image" />
            </div>
        </transition>

        <!-- 팝업 -->
        <div v-if="showPopup" class="popup-overlay" @click="closePopup">
            <transition name="popup-animation">
                <div class="popup-content">
                    <img
                        v-if="getPopupImage()"
                        :src="getPopupImage()"
                        alt="Item Image"
                        class="popup-image"
                    />
                    <p class="item-name">
                        {{ simulationResult.processedItemNames }}
                    </p>
                    <p class="item-probability">
                        {{ simulationResult.probability }}
                    </p>
                </div>
            </transition>
        </div>
    </div>
</template>

<script>
import axios from "axios";

export default {
    data() {
        return {
            simulationResult: {},
            showPopup: false,
            showChest: false,
        };
    },
    computed: {
        royalIcon() {
            return require("@/assets/royalstyle/royalicon.png");
        },
        chestImage() {
            return require("@/assets/royalstyle/royalicon.png");
        },
    },
    methods: {
        async startSimulation() {
            this.showChest = true;
            setTimeout(async () => {
                try {
                    const response = await axios.get(
                        "http://localhost:8081/api/royal-style/random"
                    );
                    this.simulationResult = response.data;
                    this.showChest = false;
                    this.showPopup = true;
                } catch (error) {
                    console.error("Error starting simulation:", error);
                }
            }, 2000);
        },
        closePopup() {
            this.showPopup = false;
        },
        getPopupImage() {
            try {
                const imageName =
                    this.simulationResult.processedItemNames[0] + ".png";
                return require(`/src/assets/royalstyle/${imageName}`);
            } catch (error) {
                console.warn("Image not found");
                return "";
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
    animation: shake 0.8s infinite;
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
    transform: scale(1); /* 수정 */
}
.popup-image {
    width: 150px;
    height: 150px;
    margin-bottom: 10px;
}
.item-name {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 5px;
}
.item-probability {
    font-size: 16px;
    color: #666;
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
