<template>
    <v-container class="personal-detail-container" fluid>
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
            </v-col>
        </v-row>
        <v-row justify="center" align="center" class="title-container">
            <v-col cols="auto" class="text-center">
                <h3 :class="['page-title', titleClass]">{{ seasonTitle }}</h3>
            </v-col>
            <v-col cols="auto" class="text-right">
                <v-btn
                    class="refresh-button"
                    icon
                    small
                    color="primary"
                    v-tooltip.bottom="'새로고침'"
                    @click="fetchSeasonData"
                >
                    <v-icon size="15">mdi-refresh</v-icon>
                </v-btn>
            </v-col>
        </v-row>

        <!-- 하위 색상 표시 -->
        <v-row justify="center" class="sub-tone-row">
            <v-col
                v-for="type in subTones"
                :key="type.name"
                cols="3"
                class="text-center sub-tone-item"
                @click="navigateToTwelvePage(type.name)"
            >
                <div
                    class="tone-circle"
                    :style="{ backgroundColor: type.color }"
                ></div>
                <p class="tone-label">{{ type.name }}</p>
            </v-col>
        </v-row>
        <v-row justify="center">
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
                    >
                        {{
                            votedCharacters.has(avatar.characterImage)
                                ? "mdi-heart"
                                : "mdi-heart-outline"
                        }}
                    </v-icon>
                </div>
            </v-col>
        </v-row>

        <!-- CharacterInfoPopup 컴포넌트 -->
        <CharacterInfoPopup
            v-if="popupVisible"
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

    <!-- ✅ 공통 알림 팝업 추가 (v-container 밖에서 전체 화면 적용) -->
</template>

<script>
import axios from "axios";
import CharacterInfoPopup from "./CharacterInfoPopup.vue";
import CustomAlert from "@/components/CustomAlert.vue";

export default {
    components: { CharacterInfoPopup, CustomAlert },
    props: ["season"],
    data() {
        return {
            avatars: [], //characterImage 데이터를 저장할 배열
            popupVisible: false, // 팝업 표시 상태
            selectedCharacter: null, // 선택된 캐릭터 데이터
            votedCharacters: new Set(), // ✅ 투표한 캐릭터 저장
            showAlert: false, // ✅ 공통 팝업 표시 여부
            alertMessage: "", // ✅ 공통 팝업 메시지
            processingVote: false, // ✅ 투표 요청 중인지 상태 플래그 (중복 방지)
        };
    },
    computed: {
        // 상단 타이틀 표시
        seasonTitle() {
            const season = this.$route.query.season || this.season; // query 또는 props에서 가져오기
            const titles = {
                spring: "봄웜",
                summer: "여름쿨",
                fall: "가을웜",
                winter: "겨울쿨",
            };
            return titles[season];
        },
        titleClass() {
            const classMapping = {
                봄웜: "spring-title",
                여름쿨: "summer-title",
                가을웜: "fall-title",
                겨울쿨: "winter-title",
            };
            return classMapping[this.seasonTitle] || "";
        },

        // 하위 톤 목록
        subTones() {
            const tones = {
                봄웜톤: [
                    { name: "라이트", color: "#FFEBE8" },
                    { name: "브라이트", color: "#FFC1CC" },
                    { name: "트루", color: "#FFB7A5" },
                ],
                여름쿨톤: [
                    { name: "라이트", color: "#D4F1F9" },
                    { name: "브라이트", color: "#A3D8F4" },
                    { name: "뮤트", color: "#91C7D6" },
                ],
                가을웜톤: [
                    { name: "뮤트", color: "#D7A97B" },
                    { name: "스트롱", color: "#B97543" },
                    { name: "딥", color: "#8A5539" },
                ],
                겨울쿨톤: [
                    { name: "브라이트", color: "#C5B3E7" },
                    { name: "스트롱", color: "#7E57C2" },
                    { name: "다크", color: "#512DA8" },
                ],
            };
            // 현재 seasonTitle에 해당하는 하위 톤 반환
            const baseTones = tones[this.seasonTitle + "톤"] || []; // "봄웜톤" 등으로 찾기
            return baseTones.map((tone) => ({
                name: `${this.seasonTitle} ${tone.name}`, // 시즌 타이틀과 톤 이름 이어 붙임
                color: tone.color,
            }));
        },
    },
    methods: {
        async fetchSeasonData() {
            try {
                const response = await axios.get(
                    "http://localhost:8081/api/personal/season",
                    {
                        params: { season: this.seasonTitle.trim() }, // ✅ 불필요한 공백 제거
                    }
                );
                this.avatars = response.data;
            } catch (error) {
                console.error("데이터 로드 중 오류 발생:", error);
            }
        },
        async voteForAvatar(event, avatar) {
            event.stopPropagation();

            // 동일한 캐릭터에 대한 중복 요청 방지 플래그
            if (this.processingVote) return;
            this.processingVote = true;

            if (this.votedCharacters.has(avatar.characterImage)) {
                // ✅ 좋아요 취소 시 팝업을 띄우고, 확인을 누르면 취소 처리
                this.alertMessage = "좋아요를 취소하시겠습니까?"; // ✅ 취소 메시지 설정
                this.showAlert = true; // ✅ 팝업 표시

                // ✅ 확인 버튼 로직 (중복 방지)
                this.onPopupConfirm = async () => {
                    try {
                        await axios.delete(
                            "http://localhost:8081/api/personal/vote",
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
                        this.showAlert = false; // ✅ 팝업 닫기
                        this.processingVote = false; // ✅ 처리 완료 후 플래그 해제
                    }
                };

                return;
            }

            // ✅ 새로운 투표 처리 (팝업 없이 즉시 처리)
            if (!avatar || !avatar.characterImage || !avatar.personalColor) {
                console.error("❌ 유효하지 않은 캐릭터 데이터:", avatar);
                this.processingVote = false;
                return;
            }

            try {
                // ✅ 팝업 없이 바로 axios 요청으로 투표 진행
                await axios.post(
                    "http://localhost:8081/api/personal/vote",
                    null,
                    {
                        params: {
                            characterImage: avatar.characterImage,
                            personalColor: avatar.personalColor,
                        },
                    }
                );

                // ✅ 새로운 투표 상태 저장
                this.votedCharacters.add(avatar.characterImage);
                this.saveHeartState();
            } catch (error) {
                console.error("투표 중 오류 발생:", error);
            } finally {
                this.processingVote = false;
            }
        },

        //로컬스토리지 이용해 하트 상태 저장
        saveHeartState() {
            const state = {
                votedCharacters: Array.from(this.votedCharacters),
                timestamp: Date.now(), // 현재 시간 저장
            };
            localStorage.setItem("heartState", JSON.stringify(state));
        },
        //하트 상태 로드
        loadHeartState() {
            const state = JSON.parse(localStorage.getItem("heartState"));
            if (state && !this.isExpired(state.timestamp)) {
                this.votedCharacters = new Set(state.votedCharacters);
            } else {
                localStorage.removeItem("heartState"); // 만료된 경우 초기화
            }
        },
        //하트 만료 시간 체크(10분)
        isExpired(timestamp) {
            const thirtyMinutes = 30 * 60 * 1000; // 30분 (밀리초 단위)
            return Date.now() - timestamp > thirtyMinutes;
        },
        //하위 상세12 페이지로 이동
        navigateToTwelvePage(toneName) {
            this.$router.push({
                path: `/personal-color-twelve/${encodeURIComponent(toneName)}`,
            });
        },
        //상위 퍼스널컬러 선택 페이지로 이동
        navigateToPersonalColorPage() {
            this.$router.push({
                name: "PersonalColorSelect",
            });
        },
        openPopup(characterImage) {
            this.selectedCharacter = { image: characterImage };
            this.popupVisible = true;
        },
    },
    mounted() {
        // 컴포넌트가 마운트될 때 데이터 가져오기
        this.fetchSeasonData();
        this.loadHeartState();
    },
};
</script>

<style scoped>
.personal-detail-container {
    position: relative;
    padding: 20px;
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

.title-container {
    position: relative;
}

.page-title {
    font-size: 2.6rem;
    font-weight: 600;
    text-align: center;
    margin-bottom: 20px;
    letter-spacing: 1px;
    font-family: "Baloo 2", sans-serif;
    color: #4c4c4c;
}

/* 각 시즌별 색상 */
.spring-title {
    color: #ffb6b9;
}

.summer-title {
    color: #91c7d6;
}

.fall-title {
    color: #d68d63;
}

.winter-title {
    color: #7e57c2;
}
@import url("https://fonts.googleapis.com/css2?family=Jua&display=swap");

/* 페이지 타이틀 */
.page-title {
    font-size: 2.2rem;
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

.refresh-button {
    position: absolute;
    top: 15px;
    right: 80px;
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
.refresh-button v-icon {
    font-size: 9px !important; /* 아이콘 크기 줄이기 */
}

/* 하위 색상 그리드 */
.sub-tone-row {
    margin-bottom: 10px;
    padding: 10px;
    border-bottom: 1px solid #d3d3d381;
    width: 90%;
    margin: 0 auto 10px auto;
}

.sub-tone-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
.tone-circle {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    margin-bottom: 10px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    cursor: pointer;
}

.tone-circle:hover {
    transform: scale(1.1);
    box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.2);
}
/* 클릭 효과 */
.tone-circle:active {
    transform: scale(0.95);
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.1);
}
.tone-label {
    font-size: 1.2rem;
    font-weight: bold;
    color: #4c4c4c;
}

/* 아바타 그리드 */
.avatar-grid {
    margin-top: 30px;
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

/* 투표 컨테이너 */
.vote-container {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 10px;
}
.heart-icon {
    cursor: pointer;
    font-size: 25px;
    transition: transform 0.2s ease;
}
.heart-icon:hover {
    transform: scale(1.2);
}
.help-icon {
    font-size: 16px;
    line-height: 1;
    cursor: pointer;
}
</style>
