<template>
    <v-dialog v-model="visible" max-width="750px" @click:outside="closeDialog">
        <v-card :class="[personalColorGroup, 'popup-card']">
            <v-card>
                <v-card-title class="close-button">
                    <v-col cols="12" class="text-center">
                        <h3 class="center-title">🌟 Character Info 🌟</h3>
                    </v-col>
                    <v-spacer></v-spacer>
                    <v-btn icon @click="closeDialog">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-card-title>

                <v-card-text>
                    <v-container class="character-popup">
                        <v-row>
                            <!-- 캐릭터 이미지 왼쪽 배치 (중앙 정렬 유지) -->
                            <v-col
                                cols="4"
                                class="text-center d-flex justify-center align-center"
                            >
                                <img
                                    v-if="characterInfo.image"
                                    :src="characterInfo.image"
                                    alt="Character"
                                    class="character-img"
                                />
                            </v-col>
                            <v-col cols="2" class="text-center"> </v-col>

                            <!-- 퍼스널컬러, 메인컬러, 서브컬러 오른쪽 배치 -->
                            <v-col
                                cols="5"
                                class="color-container d-flex flex-column justify-center"
                            >
                                <!-- 퍼스널컬러 표시 -->
                                <div
                                    :class="[
                                        'personal-color-result',
                                        personalColorGroup,
                                    ]"
                                    class=""
                                >
                                    {{ characterInfo.personalColor }}
                                </div>

                                <!-- 컬러 박스 (메인, 서브컬러 통합) -->
                                <v-row
                                    :class="['color-box', personalColorGroup]"
                                    class="align-items-center justify-center"
                                >
                                    <v-col cols="12" class="text-center">
                                        <h4 class="color-label">메인컬러</h4>
                                        <div class="d-flex justify-center">
                                            <v-avatar
                                                v-for="(
                                                    color, index
                                                ) in characterInfo.mainColors"
                                                :key="'main-color-' + index"
                                                :color="color"
                                                size="33"
                                                class="mr-2"
                                            ></v-avatar>
                                        </div>
                                    </v-col>
                                    <v-col cols="12" class="text-center">
                                        <h4 class="color-label">서브컬러</h4>
                                        <div class="d-flex justify-center">
                                            <v-avatar
                                                v-for="(
                                                    color, index
                                                ) in characterInfo.subColors"
                                                :key="'sub-color-' + index"
                                                :color="color"
                                                size="33"
                                                class="mr-2"
                                            ></v-avatar>
                                        </div>
                                    </v-col>
                                </v-row>
                            </v-col>
                        </v-row>

                        <v-row dense>
                            <v-col
                                v-for="(item, index) in characterInfo.items"
                                :key="index"
                                cols="4"
                            >
                                <v-card class="item-card">
                                    <v-card-text class="item-content">
                                        <!-- ✅ 아이템 아이콘 -->
                                        <img
                                            v-if="item.item_icon"
                                            :src="item.item_icon"
                                            alt="Item Icon"
                                            class="item-icon"
                                        />
                                        <div class="item-info">
                                            <div class="item-name">
                                                {{ item.item_name }}
                                            </div>
                                            <div class="item-type">
                                                {{ item.item_type }}
                                            </div>

                                            <!-- ✅ 색상 정보 (색, 채, 명) - 헤어, 성형, 피부는 제외 -->
                                            <div
                                                v-if="
                                                    item.color_hue !== null &&
                                                    ![
                                                        '헤어',
                                                        '성형',
                                                        '피부',
                                                    ].includes(item.item_type)
                                                "
                                                class="color-info"
                                            >
                                                <span
                                                    class="color-label"
                                                ></span>
                                                계열: {{ item.color_range }}
                                                <br />
                                                색: {{ item.color_hue }}, 채:
                                                {{ item.color_saturation }}, 명:
                                                {{ item.color_value }}
                                            </div>

                                            <!-- ✅ 믹스 컬러 정보 -->
                                            <div
                                                v-if="item.mix_color"
                                                class="mix-color-info"
                                            >
                                                {{ item.base_color }}
                                                {{ 100 - item.mix_rate }}%
                                                {{ item.mix_color }}
                                                {{ item.mix_rate }}%
                                            </div>
                                        </div>
                                    </v-card-text>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-container>

                    <!-- 로딩 상태 표시 -->
                    <v-progress-circular
                        v-if="loading"
                        indeterminate
                        color="primary"
                    ></v-progress-circular>
                </v-card-text>
            </v-card>
        </v-card>
    </v-dialog>
</template>

<script>
import hairIcon from "@/assets/hair.png";
import faceIcon from "@/assets/face.png";
import skinIcon from "@/assets/skin.png";
import axios from "axios";

export default {
    props: {
        modelValue: {
            type: Boolean,
            required: true,
        },
        character: {
            type: Object,
            required: true,
        },
    },
    emits: ["update:modelValue"],
    data() {
        return {
            characterInfo: {
                image: "",
                name: "",
                items: [],
                personalColor: "",
                mainColor: "",
                subColor: "",
            },
            loading: false,
        };
    },
    computed: {
        visible: {
            get() {
                return this.modelValue;
            },
            set(value) {
                this.$emit("update:modelValue", value);
            },
        },
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
    },
    watch: {
        visible(newVal) {
            if (newVal) {
                this.loadcharacterInfo();
            }
        },
        character: {
            handler(newCharacter) {
                if (newCharacter.image) {
                    this.characterInfo.image = newCharacter.image;
                    this.loadcharacterInfo();
                }
            },
            deep: true,
            immediate: true,
        },
    },
    methods: {
        async loadcharacterInfo() {
            if (!this.characterInfo.image) {
                console.warn("❗ 캐릭터 이미지가 없습니다.");
                return;
            }

            this.loading = true;
            try {
                const response = await axios.get(
                    `http://localhost:8081/api/personal/popupInfo`,
                    {
                        params: { imageUrl: this.characterInfo.image },
                    }
                );

                const itemData = response.data || {};

                // ✅ 첫 번째 아이템 가져오기
                const firstAvailableItem =
                    itemData.searchedCashItemDTOS?.[0] ||
                    itemData.searchedCashFaceDTOS?.[0] ||
                    {};

                // ✅ main_color와 sub_color를 배열로 변환
                this.characterInfo.personalColor =
                    firstAvailableItem.personal_color
                        ? firstAvailableItem.personal_color
                        : [];
                this.characterInfo.mainColors = firstAvailableItem.main_color
                    ? firstAvailableItem.main_color.split(",")
                    : [];
                this.characterInfo.subColors = firstAvailableItem.sub_color
                    ? firstAvailableItem.sub_color.split(",")
                    : [];

                // ✅ 아이템 배열 처리
                const searchedCashItemDTOS =
                    itemData.searchedCashItemDTOS || [];
                const searchedCashFaceDTOS =
                    itemData.searchedCashFaceDTOS || [];
                let items = [...searchedCashItemDTOS, ...searchedCashFaceDTOS];

                // ✅ 아이템 기본 아이콘 설정
                items = items.map((item) => {
                    let icon =
                        item.item_icon || "https://via.placeholder.com/50";
                    if (item.item_type === "헤어") icon = hairIcon;
                    if (item.item_type === "성형") icon = faceIcon;
                    if (item.item_type === "피부") icon = skinIcon;

                    return { ...item, item_icon: icon };
                });

                // ✅ 정렬 후 저장
                const priorityTypes = ["헤어", "성형", "피부"];
                const priorityItems = items.filter((item) =>
                    priorityTypes.includes(item.item_type)
                );
                const otherItems = items.filter(
                    (item) => !priorityTypes.includes(item.item_type)
                );
                this.characterInfo.items = [...priorityItems, ...otherItems];
            } catch (error) {
                console.error(
                    "❌ 캐릭터 데이터를 불러오는 중 오류 발생:",
                    error
                );
            } finally {
                this.loading = false;
            }
        },

        closeDialog() {
            this.$emit("update:modelValue", false);
        },
    },
};
</script>

<style scoped>
.v-dialog .v-card-text {
    padding: 0 !important;
}
.popup-card {
    padding: 16px;
    border-radius: 12px;
    transition: background-color 0.3s ease;
}

/* 계절별 팝업 테두리 배경색 */
.popup-card.Spring {
    background-color: #ffe5fb; /* 연한 봄웜 */
}

.popup-card.Summer {
    background-color: #f0f9ff; /* 연한 여름쿨 */
}

.popup-card.Autumn {
    background-color: #fff5e0; /* 연한 가을웜 */
}

.popup-card.Winter {
    background-color: #e6e6e6; /* 연한 겨울쿨 */
}

.center-title {
    margin-left: 110px;
    font-size: 1.1rem;
    font-weight: bold;
}
/* 캐릭터 이미지 스타일 */
.character-img-container {
    display: flex;
    justify-content: center;
    align-items: center;
}

.character-popup {
    display: flex;
    flex-direction: column;
    align-items: center;
}

/* 퍼스널컬러 영역 */
.color-container {
    padding: 10px;
}

/* 기존 퍼스널컬러 스타일 */
.personal-color-result {
    font-size: 13px;
    font-weight: bold;
    text-align: center;
    padding: 8px;
    margin-bottom: 8px;
    width: 249px;
    margin-left: 0.02cm;
}

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

/* 메인, 서브컬러 영역 */
.color-box {
    width: 249px;
    margin-left: 1px;
    margin-bottom: 8px;
    background-color: #f9f9f9; /* 기본 연한 배경 */
}

.color-box.Spring {
    background-color: #fdf3e9; /* 연한 봄웜 */
}

.color-box.Summer {
    background-color: #f3fbff; /* 연한 여름쿨 */
}

.color-box.Autumn {
    background-color: #fff3e5; /* 연한 가을웜 */
}

.color-box.Winter {
    background-color: #faf5fa; /* 연한 겨울쿨 */
}

/* 컬러 라벨 스타일 */
.color-label {
    font-size: 11px;
    font-weight: bold;
    color: #636364;
    margin-bottom: 6px;
}

/* 제목 텍스트 스타일 */
.color-label {
    font-size: 11px;
    font-weight: bold;
    color: #636364;
    padding-top: 8px;
}

.color-label {
    font-size: 11px;
    font-weight: bold;
    color: #636364;
    padding-top: 8px;
}

/* 캐릭터 이미지 */
.character-img {
    max-width: 160px;
    height: 160px;
    border-radius: 8px;
    margin-bottom: 15px;
}

/* 아이템 제목 */
.item-title {
    text-align: center;
    font-weight: bold;
    margin-bottom: 10px;
}

/* 개별 아이템 카드 */
.item-card {
    padding-left: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
    text-align: left;
    height: 80px;
}

/* 카드 내부 정렬 */
.item-content {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    justify-content: flex-start;
}

/* 아이템 아이콘 */
.item-icon {
    width: 35px;
    height: 35px;
    flex-shrink: 0;
    background-color: #f0f0f0;
    border-radius: 8px;
    padding: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
}

/* 아이템 정보 */
.item-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
}

/* 아이템 이름 */
.item-name {
    font-size: 11px;
    font-weight: bold;
    white-space: nowrap;

    text-overflow: ellipsis;
    max-width: 120px;
}

/* 아이템 타입 */
.item-type {
    font-size: 0.75rem;
    color: gray;
    white-space: nowrap;
}

/* 색상 정보 */
.color-info {
    font-size: 0.7rem;
    color: #4c4c4c;
    margin-top: 2px;
    white-space: nowrap;
}

/* 믹스 컬러 정보 */
.mix-color-info {
    font-size: 0.7rem;
    color: #4c4c4c;
    margin-top: 2px;
    white-space: nowrap;
}

/* 닫기 버튼 */
.close-button {
    display: flex;
    justify-content: flex-end;
    padding-top: 10px;
}
</style>
