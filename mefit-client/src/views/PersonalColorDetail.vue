<template>
    <v-container class="pa-5" fluid>
        <v-row justify="center" align="center" class="title-container">
            <v-col cols="auto" class="text-center">
                <h3 class="page-title">{{ seasonTitle }}</h3>
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
                @click="navigateToPersonalColorPage(type.name)"
            >
                <div
                    class="tone-circle"
                    :style="{ backgroundColor: type.color }"
                ></div>
                <p class="tone-label">{{ type.name }}</p>
            </v-col>
        </v-row>
        <h4>🌟 Character Showcase 🌟</h4>

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
                console.log("아바타들" + JSON.stringify(this.avatars, null, 2));
            } catch (error) {
                console.error("데이터 로드 중 오류 발생:", error);
            }
        },
        async voteForAvatar(event, avatar) {
            event.stopPropagation();

            if (this.votedCharacters.has(avatar.characterImage)) {
                // ✅ 팝업 메시지 및 상태 설정
                this.alertMessage = "이 캐릭터의 투표를 취소하시겠습니까?";
                this.showAlert = true;

                // ✅ 팝업 확인 버튼을 눌렀을 때 실행할 로직
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

                        // ✅ 투표 취소 처리 및 상태 저장
                        this.votedCharacters.delete(avatar.characterImage);
                        this.saveHeartState(); // 상태 저장
                        console.log(
                            "✅ 투표 취소 성공:",
                            avatar.characterImage
                        );
                    } catch (error) {
                        console.error("투표 취소 중 오류 발생:", error);
                    } finally {
                        this.showAlert = false; // 팝업 닫기
                    }
                };

                return;
            }

            // 새로운 투표 처리
            if (!avatar || !avatar.characterImage || !avatar.personalColor) {
                console.error("❌ 유효하지 않은 캐릭터 데이터:", avatar);
                return;
            }

            try {
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
                this.saveHeartState(); // 상태 저장
                console.log("✅ 투표 성공:", avatar.characterImage);
            } catch (error) {
                console.error("투표 중 오류 발생:", error);
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
            const tenMinutes = 10 * 60 * 1000; // 10분(밀리초)
            return Date.now() - timestamp > tenMinutes;
        },
        navigateToPersonalColorPage(toneName) {
            // 클릭한 하위 톤으로 이동
            this.$router.push({
                path: `/personal-color-twelve/${encodeURIComponent(toneName)}`,
            });
        },
        openPopup(characterImage) {
            console.log("🔍 클릭한 캐릭터 이미지 URL:", characterImage); // << 클릭한 이미지 확인

            this.selectedCharacter = { image: characterImage };
            this.popupVisible = true;
        },
    },
    mounted() {
        // 컴포넌트가 마운트될 때 데이터 가져오기
        this.fetchSeasonData();
        this.loadHeartState();
        this.fetchSeasonData(); // 기존 데이터 로드
    },
};
</script>

<style scoped>
.title-container {
    position: relative; /* 상대 위치 */
}
/* 페이지 타이틀 */
.page-title {
    font-size: 2rem;
    font-weight: bold;
    color: #4c4c4c;
}
.refresh-button {
    position: absolute;
    top: 15px;
    right: 30px; /* 화면 우측과의 거리 */
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
    border-bottom: 1px solid #d3d3d381; /* 연한 회색 구분선 */
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
    transition: transform 0.2s ease, box-shadow 0.2s ease; /* 하버 효과와 클릭 효과를 위한 트랜지션 */
    cursor: pointer;
}
/* 하버 효과 */
.tone-circle:hover {
    transform: scale(1.1); /* 약간 확대 */
    box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.2); /* 그림자 강조 */
}
/* 클릭 효과 */
.tone-circle:active {
    transform: scale(0.95); /* 약간 축소 */
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.1); /* 그림자 약화 */
}
.tone-label {
    font-size: 1.2rem;
    font-weight: bold;
    color: #4c4c4c;
}

/* 아바타 그리드 */
.avatar-grid {
    margin-top: 30px;
}
.avatar-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
.avatar-img {
    width: 100px;
    height: 100px;
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
    font-size: 25px; /* 아이콘 크기 */
    transition: transform 0.2s ease;
}
.heart-icon:hover {
    transform: scale(1.2); /* 호버 시 확대 효과 */
}
</style>
