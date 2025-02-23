<template>
    <v-container class="personal-color-container">
        <!-- 상단 네비 -->
        <v-row class="upper-navi">
            <v-col>
                <!-- 퍼스널컬러 화면으로 돌아가기 -->
                <v-icon color="grey darken-1" size="18"
                    >mdi-chevron-right</v-icon
                >
                <span
                    class="hover-personal-color"
                    @click="navigateToPersonalColorPage"
                    >퍼스널컬러</span
                >

                <!-- 메인시즌 표시 -->
                <v-icon color="grey darken-1" size="18"
                    >mdi-chevron-right</v-icon
                >
                <span class="hover-main-season" @click="navigateToMainSeason">{{
                    mainSeason
                }}</span>
            </v-col>
        </v-row>

        <!-- 제목 및 설명 -->
        <v-row justify="center" align="center" class="title-container">
            <v-col cols="auto" class="text-center">
                <h2 :class="['page-title', seasonTitleClass]">
                    {{ colorName }}
                </h2>
            </v-col>
            <v-col cols="auto" class="text-right">
                <v-btn
                    class="refresh-button"
                    icon
                    small
                    color="primary"
                    v-tooltip.bottom="'새로고침'"
                    @click="fetchToneData"
                >
                    <v-icon size="15">mdi-refresh</v-icon>
                </v-btn>
            </v-col>
        </v-row>
        <!-- 색상 팔레트 -->
        <div class="palette-section" v-if="palette.length">
            <v-row justify="center" align="center">
                <h3 class="palette-text">🎨 색상 팔레트</h3>
            </v-row>
            <div class="palette-row">
                <v-carousel
                    hide-delimiters
                    class="custom-carousel"
                    height="160px"
                >
                    <v-carousel-item
                        v-for="(group, groupIndex) in colorGroups"
                        :key="groupIndex"
                    >
                        <div class="palette-row">
                            <div
                                v-for="(color, index) in group"
                                :key="index"
                                class="color-box-wrapper"
                            >
                                <div
                                    class="color-box"
                                    :style="{ backgroundColor: color.hex }"
                                ></div>
                                <div class="color-label">{{ color.name }}</div>
                            </div>
                        </div>
                    </v-carousel-item>
                </v-carousel>
            </div>
        </div>
        <div class="divider-line"></div>
                <v-row justify="center" class="showcase-container">
            <h4>🌟 Character Showcase 🌟</h4>
            <!-- 도움말 아이콘 버튼 -->
            <v-btn
                icon
                color="grey darken-2"
                class="help-btn ml-2"
                style="width: 20px; height: 20px"
            >
                <v-tooltip bottom>
                    <template #activator="{ props }">
                        <v-icon v-bind="props" class="help-icon">
                            mdi-help-circle-outline
                        </v-icon>
                    </template>
                    <span>
                        퍼스널컬러 분석은 캐릭터 색상을
                        <br />
                        기반으로 제공됩니다.
                        <br />
                        기술적 처리 방식과 이미지의 특성상
                        <br />
                        일부 색상 정보가 왜곡될 수 있으며,
                        <br />
                        화면 환경에 따라 차이가 발생할 수 있습니다.
                        <br />
                        분석 결과는 참고용으로 활용해 주세요.
                    </span>
                </v-tooltip>
            </v-btn>
        </v-row>
        <!-- 캐릭터 아바타 그리드 -->
        <v-row justify="center" class="avatar-grid">
            <v-col
                v-for="(avatar, index) in avatars"
                :key="index"
                cols="3"
                class="text-center avatar-container"
            >
                <!-- 캐릭터 이미지 -->
                <img
                    :src="avatar.characterImage"
                    alt="Character Avatar"
                    class="avatar-img"
                    @click="openPopup(avatar.characterImage)"
                />
                <!-- 하트 버튼 -->
                <div class="vote-container">
                    <v-icon
                        class="heart-icon"
                        :style="{
                            color: votedCharacters.has(avatar.characterImage)
                                ? '#FF0000'
                                : '#FFB6C1',
                        }"
                        @click="voteForAvatar($event, avatar)"
                        >{{
                            votedCharacters.has(avatar.characterImage)
                                ? "mdi-heart"
                                : "mdi-heart-outline"
                        }}</v-icon
                    >
                </div>
            </v-col>
        </v-row>

        <!-- CharacterInfoPopup 컴포넌트 -->
        <CharacterInfoPopup
            v-if="selectedCharacter"
            :model-value="popupVisible"
            @update:model-value="popupVisible = $event"
            :character="selectedCharacter"
        />
        <CustomAlert
            v-if="showAlert"
            :visible="showAlert"
            title="알림"
            :message="alertMessage"
            @close="showAlert = false"
            @confirm="onPopupConfirm"
        />
    </v-container>
</template>

<script>
import CharacterInfoPopup from "./CharacterInfoPopup.vue";
import axios from "axios";
import CustomAlert from "@/components/CustomAlert.vue";
import { ColorMockData } from "@/data/ColorMockData.js";
export default {
    components: { CharacterInfoPopup, CustomAlert },
    props: ["color"],
    data() {
        return {
            avatars: [],
            popupVisible: false,
            selectedCharacter: null,
            votedCharacters: new Set(), // ✅ 투표한 캐릭터 저장
            showAlert: false, // ✅ 공통 팝업 표시 여부
            alertMessage: "", // ✅ 공통 팝업 메시지
        };
    },
    computed: {
        colorName() {
            return decodeURIComponent(this.color);
        },
        palette() {
            return ColorMockData[this.colorName] || [];
        },
        colorGroups() {
            // palette를 6개씩 나누어 그룹화
            return this.palette.reduce((groups, color, index) => {
                const groupIndex = Math.floor(index / 6);
                if (!groups[groupIndex]) {
                    groups[groupIndex] = [];
                }
                groups[groupIndex].push(color);
                return groups;
            }, []);
        },
        mainSeason() {
            const seasonMapping = {
                "봄웜 라이트": "봄",
                "봄웜 브라이트": "봄",
                "봄웜 트루": "봄",
                "여름쿨 라이트": "여름",
                "여름쿨 브라이트": "여름",
                "여름쿨 뮤트": "여름",
                "가을웜 뮤트": "가을",
                "가을웜 스트롱": "가을",
                "가을웜 딥": "가을",
                "겨울쿨 브라이트": "겨울",
                "겨울쿨 스트롱": "겨울",
                "겨울쿨 다크": "겨울",
            };
            return seasonMapping[this.colorName] || "";
        },
        seasonTitleClass() {
            if (this.colorName.includes("봄")) {
                return "spring-title";
            } else if (this.colorName.includes("여름")) {
                return "summer-title";
            } else if (this.colorName.includes("가을")) {
                return "fall-title";
            } else if (this.colorName.includes("겨울")) {
                return "winter-title";
            }
            return "";
        },
    },
    methods: {
        async fetchToneData() {
            try {
                const response = await axios.get(
                    `${process.env.VUE_APP_API_BASE_URL}/api/personal/tone`,
                    {
                        params: { tone: this.color },
                    }
                );
                this.avatars = response.data;
            } catch (error) {
                console.error("데이터 로드 중 오류 발생:", error);
            }
        },
        async voteForAvatar(event, avatar) {
            event.stopPropagation();

            if (this.votedCharacters.has(avatar.characterImage)) {
                this.alertMessage = "이 캐릭터의 투표를 취소하시겠습니까?";
                this.showAlert = true;

                this.onPopupConfirm = async () => {
                    try {
                        await axios.delete(
                            `${process.env.VUE_APP_API_BASE_URL}/api/personal/vote`,
                            {
                                params: {
                                    characterImage: avatar.characterImage,
                                },
                            }
                        );
                        this.votedCharacters.delete(avatar.characterImage);
                        this.saveHeartState();
                    } catch (error) {
                        console.error("투표 취소 중 오류 발생:", error);
                    } finally {
                        this.showAlert = false;
                    }
                };

                return;
            }

            if (!avatar || !avatar.characterImage || !avatar.personalColor) {
                console.error("❌ 유효하지 않은 캐릭터 데이터:", avatar);
                return;
            }

            try {
                await axios.post(
                    `${process.env.VUE_APP_API_BASE_URL}/api/personal/vote`,
                    null,
                    {
                        params: {
                            characterImage: avatar.characterImage,
                            personalColor: avatar.personalColor,
                        },
                    }
                );
                this.votedCharacters.add(avatar.characterImage);
                this.saveHeartState();
            } catch (error) {
                console.error("투표 중 오류 발생:", error);
            }
        },
        openPopup(characterImage) {
            this.selectedCharacter = { image: characterImage };
            this.popupVisible = true;
        },
        navigateToPersonalColorPage() {
            this.$router.push({
                name: "PersonalColorSelect",
            });
        },
        navigateToMainSeason() {
            const seasonRoutes = {
                봄: "spring",
                여름: "summer",
                가을: "fall",
                겨울: "winter",
            };

            const season = seasonRoutes[this.mainSeason];
            if (season) {
                this.$router.push({
                    name: "PersonalColorDetail",
                    query: { season },
                });
            }
        },
        saveHeartState() {
            const state = {
                votedCharacters: Array.from(this.votedCharacters),
                timestamp: Date.now(),
            };
            localStorage.setItem("heartState", JSON.stringify(state));
        },
        loadHeartState() {
            const state = JSON.parse(localStorage.getItem("heartState"));
            if (state && !this.isExpired(state.timestamp)) {
                this.votedCharacters = new Set(state.votedCharacters);
            } else {
                localStorage.removeItem("heartState");
            }
        },
        isExpired(timestamp) {
            const thirtyMinutes = 30 * 60 * 1000; // 30분 (밀리초 단위)
            return Date.now() - timestamp > thirtyMinutes;
        },
    },
    mounted() {
        this.fetchToneData();
        this.loadHeartState();
    },
};
</script>

<style scoped>
.personal-color-container {
    position: relative;
    padding: 20px;
}

.title-container {
    position: relative;
}

/* 타이틀 공통 스타일 */
.page-title {
    font-size: 2.6rem;
    font-weight: bold;
    text-align: center;
    margin-bottom: 20px;
    letter-spacing: 1px;
    font-family: "Jua", sans-serif;
}

/* 봄웜 스타일 */
.spring-title {
    color: #ffb6b9;
    background: linear-gradient(90deg, #ffe4e4, #ffb6b9);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

/* 여름쿨 스타일 */
.summer-title {
    color: #91c7d6;
    background: linear-gradient(90deg, #d4f1f9, #91c7d6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

/* 가을웜 스타일 */
.fall-title {
    color: #d68d63;
    background: linear-gradient(90deg, #f5ceb1, #d68d63);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

/* 겨울쿨 스타일 */
.winter-title {
    color: #7e57c2;
    background: linear-gradient(90deg, #c5b3e7, #7e57c2);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

/*네비*/
.upper-navi {
    position: absolute;
    top: 20px;
    font-size: 14px;
    color: #333;
    cursor: pointer;
}

.hover-personal-color,
.hover-main-season {
    cursor: pointer;
    color: #424242;
    transition: color 0.2s ease, text-decoration 0.2s ease;
}

.hover-personal-color:hover,
.hover-main-season:hover {
    color: #edc1f1f8;
    text-decoration: underline;
}

.refresh-button {
    position: absolute;
    top: 15px;
    right: 70px;
    background-color: #afacacb8 !important;
    width: 30px !important;
    height: 30px !important;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 !important;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.header-section h2 {
    font-size: 2.5rem;
    margin-bottom: 10px;
}

.description {
    font-size: 1.2rem;
    color: #666;
    margin-bottom: 30px;
}

.recommend-section,
.style-tips {
    margin-top: 40px;
}

.palette-grid,
.recommend-grid {
    display: flex;
    justify-content: center;
    gap: 10px;
    flex-wrap: wrap;
}

.color-box,
.recommend-box {
    width: 100px;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    font-size: 0.9rem;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.style-tips ul {
    list-style-type: disc;
    padding-left: 20px;
    color: #555;
}

.style-tips ul li {
    margin-bottom: 10px;
}
.divider-line {
    justify-content: center;
    height: 1px;
    background-color: #d3d3d3;
    width: 90%;
    margin: 25px auto;
}

/* 아바타 그리드 */
.avatar-grid {
    margin-top: 10px;
    min-height: 500px; /* 데이터가 없을 때도 이 높이를 유지 */
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
}

.avatar-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
.avatar-img {
    width: 130px;
    height: 130px;
    border-radius: 10px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    cursor: pointer;
}

.vote-container {
    display: flex;
    justify-content: center;
    margin-top: 10px;
}

.heart-icon {
    cursor: pointer;
    font-size: 24px;
    transition: transform 0.2s ease;
}
.heart-icon:hover {
    transform: scale(1.2);
}

/*팔레트 */
.custom-carousel {
    position: relative !important;
}
::v-deep(.custom-carousel .v-btn) {
    --v-btn-height: 24px;
    --v-btn-width: 24px;
    --v-icon-size: 16px;
    padding: 0 !important; /* 패딩 제거 */
    margin: 0 !important; /* 마진 제거 */
    min-width: 0 !important; /* 최소 너비 제거 */
    min-height: 0 !important; /* 최소 높이 제거 */
}

.palette-section {
    margin-top: 20px;
    text-align: center;
}

.palette-row {
    display: flex;
    justify-content: center;
    gap: 25px;
    flex-wrap: wrap;
    margin-top: 20px;
}
.color-box {
    width: 110px;
    height: 100px;
    border-radius: 10px 10px 0 0;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.color-box-wrapper {
    width: 110px;
    text-align: center;
}

.color-label {
    background-color: #fff;
    color: #333333bc;
    font-size: 11px;
    font-weight: bold;
    padding: 5px;
    border-radius: 0 0 10px 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/*팔레트 텍스트*/
.palette-text {
    color: #747272;
}

.help-icon {
    font-size: 16px;
    line-height: 1;
    cursor: pointer;
}


@media screen and (max-width: 768px) {
    /* ✅ 네비게이션: 모바일에서는 폰트 크기 조정 및 정렬 */
    .upper-navi {
        font-size: 12px;
        top: 10px;
    }

    /* ✅ 제목 크기 조정 */
    .page-title {
        font-size: 1.8rem;
    }

    /* ✅ 새로고침 버튼 위치 조정 */
    .refresh-button {
        position: absolute;
        top: 10px;
        right: 10px;
        width: 25px !important;
        height: 25px !important;
        font-size: 12px;
    }

    /* ✅ 팔레트 섹션: 모바일에서 여백 줄이기 */
    .palette-section {
        margin-top: 10px;
        max-width: 95%;
    }

    /* ✅ 팔레트 레이아웃: 모바일에서 2열 배치 */
    .palette-row {
        display: flex;
        gap: 8px;
        flex-wrap: nowrap; /* 한 줄 유지 */
        overflow-x: auto; /* 가로 스크롤 활성화 */
        scroll-behavior: smooth; /* 부드러운 스크롤 */
        white-space: nowrap;
        padding-bottom: 10px;
        max-width: 100%; /* 부모 컨테이너 기준으로 크기 제한 */
        justify-content: center;
    }

    .color-box {
        width: 80px;
        height: 80px;
    }

    .color-box-wrapper {
        width: 80px;
    }

    .color-label {
        font-size: 8px;
        width: 80px; /* ✅ 컬러 박스 크기와 동일하게 조정 */
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-align: center;
        display: block;
    }


    /* ✅ 아바타 이미지 크기 조정 */
    .avatar-img {
        width: 90px; 
        height: 90px;
    }


    .vote-container {
        margin-top: 3px;
    }

    /* ✅ 투표 아이콘 크기 조정 */
    .heart-icon {
        font-size: 18px;
    }

    /* ✅ 캐릭터 그리드 2열 배치 */
    .avatar-grid {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
    }

    .avatar-container {
        width: 50%; 
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    /* ✅ 도움말 아이콘 크기 조정 */
    .help-icon {
        font-size: 14px;
    }

    /* ✅ 모바일에서만 스크롤바 스타일 적용 (마지막 부분에 추가) */
    .palette-row::-webkit-scrollbar {
    height: 5px;
    }

    .palette-row::-webkit-scrollbar-thumb {
        background: #ccc;
        border-radius: 10px;
    }

    .palette-row::-webkit-scrollbar-track {
        background: transparent;
    }
}

</style>
