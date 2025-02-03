<template>
    <v-container class="py-10 powder-room-container">
        <!-- 0번: 컬러픽 타이틀 영역 -->
        <v-row justify="center" class="mb-6">
            <div class="color-pick-banner">
                <div class="color-pick-background">
                    <h1 class="color-picks-title">Color Pick</h1>
                </div>
            </div>
        </v-row>

        <!-- 1번: 퍼스널컬러 정보 영역 -->
        <v-card class="personal-card mb-6" elevation="4">
            <div class="personal-color-result" :class="personalColorGroup">
                {{ characterInfo.personalColor }}
            </div>
            <v-row class="align-center main-sub-color-row">
                <!-- 메인컬러 왼쪽 정렬 -->
                <v-col cols="6" class="main-color-area d-flex align-center">
                    <h4 class="color-label" :style="colorLabelStyle">
                        main color
                    </h4>
                    <div class="color-preview">
                        <v-avatar
                            v-for="(color, index) in characterInfo.mainColors"
                            :key="'main-color-' + index"
                            :color="color"
                            size="40"
                            class="mr-2"
                        ></v-avatar>
                    </div>
                </v-col>

                <!-- 서브컬러 오른쪽 정렬 -->
                <v-col
                    cols="6"
                    class="sub-color-area d-flex align-center justify-end"
                >
                    <h4 class="color-label" :style="colorLabelStyle">
                        sub color
                    </h4>
                    <div class="color-preview">
                        <v-avatar
                            v-for="(color, index) in characterInfo.subColors"
                            :key="'sub-color-' + index"
                            :color="color"
                            size="40"
                            class="ml-2"
                        ></v-avatar>
                    </div>
                </v-col>
            </v-row>
        </v-card>

        <v-row>
            <!-- 2번: 캐릭터 이미지 영역 -->
            <v-col cols="10" md="8" class="d-flex flex-column">
                <v-card class="character-card mb-4" elevation="4">
                    <img
                        v-if="characterInfo.characterImage"
                        :src="characterInfo.characterImage"
                        alt="Character Image"
                        class="character-image"
                    />
                    <v-btn
                        @click="toggleZoom"
                        class="toggle-btn"
                        elevation="2"
                        style="width: 40px; padding: 0; min-width: 40px"
                    >
                        <v-icon size="20">
                            {{
                                scale === 0.7
                                    ? "mdi-magnify-plus-outline"
                                    : "mdi-magnify-minus-outline"
                            }}
                        </v-icon>
                    </v-btn>
                </v-card>
            </v-col>

            <!-- 3번: 컬러피커 영역 -->
            <v-col cols="10" md="4" class="d-flex flex-column">
                <v-card class="picker-card mb-4" elevation="4">
                    <v-color-picker
                        v-model="selectedColor"
                        flat
                        class="custom-picker"
                    ></v-color-picker>
                </v-card>
            </v-col>
        </v-row>

        <!-- 4번 컬러 저장 영역 -->
        <v-btn
            class="fixed-add-btn"
            @click="addColor"
            :disabled="!selectedColor"
        >
            💖 색상 추가 💖
        </v-btn>

        <v-card class="picker-saved-colors-box" elevation="4">
            <v-row dense justify="center" class="mt-4 picker-saved-color-grid">
                <v-col
                    v-for="(color, index) in savedColors"
                    :key="index"
                    cols="1.5"
                    class="pa-1"
                >
                    <v-card
                        :style="{ backgroundColor: color }"
                        class="picker-color-result"
                        outlined
                    >
                        <div class="picker-color-info">{{ color }}</div>
                    </v-card>
                </v-col>
            </v-row>
        </v-card>
    </v-container>
</template>

<script>
export default {
    data() {
        return {
            characterInfo: {
                characterImage: "",
                personalColor: "",
                mainColors: [],
                subColors: [],
            },
            selectedColor: "#ffffff",
            savedColors: [],
            scale: 0.7,
        };
    },
    created() {
        const query = this.$route.query;
        this.characterInfo.characterImage = decodeURIComponent(
            query.characterImage || ""
        );

        this.characterInfo.personalColor = decodeURIComponent(
            query.personalColor || ""
        );
        const mainColorsRaw = decodeURIComponent(query.mainColors || "");
        const subColorsRaw = decodeURIComponent(query.subColors || "");

        this.characterInfo.mainColors = mainColorsRaw
            ? mainColorsRaw.split(",")
            : [];
        this.characterInfo.subColors = subColorsRaw
            ? subColorsRaw.split(",")
            : [];
    },
    methods: {
        addColor() {
            if (
                this.savedColors.length < 30 && // 최대 저장 개수
                this.selectedColor &&
                !this.savedColors.includes(this.selectedColor)
            ) {
                this.savedColors.push(this.selectedColor);
            }
        },
        toggleZoom() {
            this.scale = this.scale === 1 ? 0.7 : 1;
        },
    },
    computed: {
        personalColorGroup() {
            const colorMap = {
                "봄웜 브라이트": "Spring",
                "봄웜 트루": "Spring",
                "봄웜 라이트": "Spring",

                "여름쿨 라이트": "Summer",
                "여름쿨 브라이트": "Summer",
                "여름쿨 뮤트": "Summer",

                "가을웜 뮤트": "Autumn",
                "가을웜 스트롱": "Autumn",
                "가을웜 딥": "Autumn",

                "겨울쿨 브라이트": "Winter",
                "겨울쿨 스트롱": "Winter",
                "겨울쿨 다크": "Winter",
            };

            return colorMap[this.characterInfo.personalColor] || "default";
        },
        colorLabelStyle() {
            const textColorMap = {
                Spring: "#8d5524",
                Summer: "#007acc",
                Autumn: "#a64b2a",
                Winter: "#3a4e80",
                default: "#f6b4d2",
            };
            return {
                color:
                    textColorMap[this.personalColorGroup] ||
                    textColorMap.default,
            };
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
    text-shadow: 0 0 20px rgba(193, 101, 255, 0.8);
}

.color-pick-background {
    background: #ffc0cb;
    padding: 15px;
    border-radius: 20px;
}
/* 1번 퍼스널컬러 영역 */
.personal-card {
    padding: 24px;
    border-radius: 12px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    background-color: #fff;
    border: 1px solid #dcdcdc; /* 회색 테두리 추가 */
}

.personal-color-result {
    font-size: 16px;
    font-weight: bold;
    text-align: center;
    padding: 8px;
    margin-bottom: 16px;
    border-radius: 8px;
}

/* 계절별 퍼스널컬러 스타일 */
.personal-color-result.Spring {
    background-color: #fbe7c6;
    color: #8d5524;
}

.personal-color-result.Summer {
    background-color: #e6f7ff;
    color: #007acc;
}

.personal-color-result.Autumn {
    background-color: #fdecc8;
    color: #a64b2a;
}

.personal-color-result.Winter {
    background-color: #f0f4f7;
    color: #3a4e80;
}

.main-sub-color-row {
    align-items: center; /* 라벨과 컬러가 수직 가운데 정렬 */
    padding: 8px 0;
}

.color-label {
    margin-left: 10px;
    font-size: 15px;
    margin-right: 10px;
}

.color-preview {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-right: 10px;
}

/* 메인컬러 영역 */
.main-color-area {
    justify-content: flex-start;
}

/* 서브컬러 영역 */
.sub-color-area {
    justify-content: flex-end;
}

/* 2번 캐릭터이미지 영역 */
.character-card {
    padding: 16px;
    display: flex;
    height: 400px;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.character-image {
    height: 200px;
    border-radius: 12px;
}
.toggle-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 40px;
    height: 40px;
    padding: 0;
    min-width: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: background-color 0.3s;
}
/* 3번 피커영역 */
.custom-picker {
    max-width: 100% !important; /* 최대 너비를 100%로 */
    width: 100% !important; /* 고정 너비를 100%로 */
    height: 367px;
    box-sizing: border-box; /* 테두리와 패딩 포함 */
}

.picker-card {
    padding: 16px;
}

/* 4번 컬러 저장 영역 */
.fixed-add-btn {
    background-color: #ffc0cb; /* 원하는 배경색 */
    color: white; /* 텍스트 색 */
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    padding: 9px;
    margin-bottom: 20px;
    width: 100%;
    font-weight: bold;
    text-align: center;
    transition: background-color 0.3s ease;
}

.fixed-add-btn:hover {
    background-color: #ff85c0; /* 호버 시 배경색 */
}

.picker-saved-colors-box {
    padding: 24px;
    height: 420px;
    overflow-y: auto; /* 필요 시 스크롤*/
}

/*  */
.picker-color-result {
    height: 110px;
    width: 110px;
    gap: 20px;
    padding: 12px; /* 안쪽 여백 조정 */
    margin: 20px;
    font-size: 0.8rem; /* 글씨 크기 조정 */
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
    border-radius: 10px;
    transition: transform 0.4s ease, box-shadow 0.4s ease;
    box-shadow: 0 4px 10px rgba(255, 182, 193, 0.5);
}

.picker-color-result:hover {
    transform: scale(1.1) rotate(-2deg);
    box-shadow: 0 6px 15px rgba(255, 105, 180, 0.8);
}
</style>
