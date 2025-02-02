<template>
    <v-container class="py-10 powder-room-container">
        <!-- 0번: 제목 -->
        <v-row justify="center" class="mb-10">
            <div class="color-pick-banner">
                <div class="color-pick-background">
                    <h1 class="color-picks-title">Color Pick</h1>
                </div>
            </div>
        </v-row>

        <!-- 메인 레이아웃: 1, 2번 왼쪽, 3, 4번 오른쪽 -->
        <v-row>
            <!-- 왼쪽 열: 1번, 2번 -->
            <v-col cols="12" md="6" class="d-flex flex-column">
                <!-- 1번: 캐릭터 이미지 영역 -->
                <v-card class="character-card mb-4 shimmer" elevation="6">
                    <v-img
                        src="@/assets/slime.png"
                        alt="Character Image"
                        class="character-image"
                        :style="{
                            transform: `scale(${scale})`,
                            transition: 'transform 0.3s ease-in-out',
                        }"
                    ></v-img>
                    <div class="button-group mt-3">
                        <v-btn
                            @click="toggleZoom"
                            class="modern-btn"
                            elevation="2"
                        >
                            <v-icon size="20">
                                {{
                                    scale === 0.7
                                        ? "mdi-magnify-plus-outline"
                                        : "mdi-magnify-minus-outline"
                                }}
                            </v-icon>
                        </v-btn>
                        <v-btn
                            @click="downloadImage"
                            class="modern-btn"
                            elevation="2"
                        >
                            <v-icon size="20">mdi-download</v-icon>
                        </v-btn>
                    </div>
                </v-card>

                <!-- 2번: 퍼스널컬러 영역 -->
                <v-card class="modern-card" elevation="6">
                    <h3 class="font-weight-bold">퍼스널컬러</h3>
                    <div
                        class="personal-color-result animated fadeIn"
                        @click="navigateToPersonalColorPage"
                    >
                        {{ personalColorAnalysis }}
                    </div>
                    <v-row class="main-color">
                        <v-col cols="3" class="text-left">
                            <h4 class="color-label">메인컬러</h4>
                        </v-col>
                        <v-col cols="9" class="d-flex">
                            <v-avatar
                                v-for="(
                                    color, index
                                ) in characterInfo.main_colors || ['#ccc']"
                                :key="'main-color-' + index"
                                :color="color"
                                size="33"
                                class="mr-2"
                            ></v-avatar>
                        </v-col>
                    </v-row>
                    <v-row class="sub-color">
                        <v-col cols="3" class="text-left">
                            <h4 class="color-label">서브컬러</h4>
                        </v-col>
                        <v-col cols="9" class="d-flex">
                            <v-avatar
                                v-for="(
                                    color, index
                                ) in characterInfo.sub_colors || ['#eee']"
                                :key="'sub-color-' + index"
                                :color="color"
                                size="33"
                                class="mr-2"
                            ></v-avatar>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>

            <!-- 오른쪽 열: 3번, 4번 -->
            <v-col cols="12" md="6" class="d-flex flex-column">
                <!-- 3번: 컬러피커 영역 -->
                <v-card class="picker-card mb-4 animated fadeIn" elevation="12">
                    <v-color-picker
                        v-model="selectedColor"
                        flat
                    ></v-color-picker>
                </v-card>

                <!-- 4번: 컬러 저장 영역 -->
                <v-card
                    class="saved-colors-box animated popIn"
                    elevation="6"
                    :style="{ height: '360px' }"
                >
                    <v-btn
                        block
                        color="pink lighten-2"
                        class="add-color-btn mt-5"
                        @click="addColor"
                        :disabled="!selectedColor"
                    >
                        💖 색상 추가 💖
                    </v-btn>
                    <v-row
                        dense
                        justify="center"
                        class="mt-4"
                        style="max-height: 240px; overflow-y: auto"
                    >
                        <v-col
                            v-for="(color, index) in savedColors"
                            :key="index"
                            cols="6"
                            md="3"
                            class="pa-2"
                        >
                            <v-card
                                :style="{ backgroundColor: color }"
                                class="color-box powder-box"
                                outlined
                            >
                                <div class="color-info">{{ color }}</div>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    data() {
        return {
            characterInfo: {
                main_colors: [],
                sub_colors: [],
            },
            selectedColor: "#ffffff",
            savedColors: [],
        };
    },
    methods: {
        addColor() {
            if (
                this.savedColors.length < 24 &&
                this.selectedColor &&
                !this.savedColors.includes(this.selectedColor)
            ) {
                this.savedColors.push(this.selectedColor);
            }
        },
        toggleZoom() {
            this.scale = this.scale === 1 ? 0.7 : 1;
        },
        downloadImage() {
            // Implement image download logic
        },
    },
};
</script>

<style scoped>
.color-pick-banner {
    text-align: center;
    margin-bottom: 20px;
}
.color-picks-title {
    font-size: 1.5rem;
    font-weight: bold;
    color: #ffffff;
    letter-spacing: 5px;
    text-shadow: 0 0 20px rgba(193, 101, 255, 0.8),
        0 0 40px rgba(255, 223, 0, 0.6), 0 0 60px rgba(255, 223, 0, 0.4);
}
.color-pick-background {
    position: relative;
    background: #ffc0cb;
    overflow: hidden;
    padding: 15px;
    border-radius: 20px;
    animation: shimmer 2s infinite;
}
.color-pick-background::before {
    content: "";
    position: absolute;
    top: 0;
    left: -150%;
    width: 150%;
    height: 100%;
    background: linear-gradient(
        120deg,
        transparent,
        rgba(255, 255, 255, 0.3),
        transparent
    );
    transform: skewX(-25deg);
}

.character-card {
    background-color: #fff;
    padding: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}
.character-image {
    height: 200px;
}
.button-group {
    display: flex;
    gap: 8px;
}
.modern-card {
    padding: 24px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}
.picker-card {
    padding: 24px;
    border-radius: 30px;
}
.saved-colors-box {
    padding: 24px;
}
.color-box {
    height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
    font-size: 1.2rem;
    border-radius: 20px;
    border: 2px solid white;
    transition: transform 0.4s ease, box-shadow 0.4s ease;
    box-shadow: 0 4px 10px rgba(255, 182, 193, 0.5);
}
.color-box:hover {
    transform: scale(1.1) rotate(-2deg);
    box-shadow: 0 6px 15px rgba(255, 105, 180, 0.8);
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes popIn {
    from {
        transform: scale(0.8);
        opacity: 0;
    }
    to {
        transform: scale(1);
        opacity: 1;
    }
}
</style>
