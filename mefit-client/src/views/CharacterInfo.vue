<template>
    <v-container class="main-container" fluid>
        <!-- 데이터가 없을 경우 -->
        <div v-if="!characterInfo.character_name">
            <h2>닉네임을 입력하세요</h2>
            <div class="search-bar">
                <button class="search-icon" @click="searchAndSaveCharacter">
                    🔎
                </button>
                <input
                    type="text"
                    placeholder="검색어를 입력하세요"
                    :value="characterName"
                    @input="updateCharacterName"
                    @keydown.enter.prevent="searchAndSaveCharacter"
                />
            </div>
        </div>

        <!-- 데이터가 있을 경우 -->
        <div v-else>
            <!-- 검색창과 선택박스 영역 -->
            <v-row dense class="search-bar-row">
                <v-col cols="12" md="12">
                    <div class="search-bar-container">
                        <!-- 검색창 -->
                        <input
                            type="text"
                            placeholder="닉네임을 입력하세요"
                            :value="characterName"
                            class="search-input"
                            @input="updateCharacterName"
                            @keydown.enter.prevent="searchAndSaveCharacter"
                        />
                        <button
                            @click="searchAndSaveCharacter"
                            class="search-button"
                        >
                            🔍 검색
                        </button>
                    </div>

                    <div class="motion-select-button-group">
                        <!-- 동작 선택 -->
                        <div class="motion-select-wrapper">
                            <select
                                v-model="selectedAction"
                                class="motion-select"
                                @change="updateCharacterImage"
                            >
                                <!-- 기본 옵션 추가 (빈 값으로 설정) -->
                                <option value>기본 모션</option>
                                <option
                                    v-for="action in actionOptions"
                                    :key="action.code"
                                    :value="action.code"
                                >
                                    {{ action.codeKorean }}
                                </option>
                            </select>
                        </div>

                        <div class="motion-select-wrapper">
                            <select
                                v-model="selectedEmotion"
                                class="motion-select"
                                @change="updateCharacterImage"
                            >
                                <!-- 기본 옵션 추가 (빈 값으로 설정) -->
                                <option value>기본 감정</option>
                                <option
                                    v-for="emotion in emotionOptions"
                                    :key="emotion.code"
                                    :value="emotion.code"
                                >
                                    {{ emotion.codeKorean }}
                                </option>
                            </select>
                        </div>
                        <!-- 무기 선택 -->
                        <div class="motion-select-wrapper">
                            <select
                                v-model="selectedWmotion"
                                class="motion-select"
                                @change="updateCharacterImage"
                            >
                                <!-- 기본 옵션 추가 (빈 값으로 설정) -->
                                <option value>기본 무기</option>
                                <option
                                    v-for="wmotion in wmotionOptions"
                                    :key="wmotion.code"
                                    :value="wmotion.code"
                                >
                                    {{ wmotion.codeKorean }}
                                </option>
                            </select>
                        </div>

                        <!-- 컬러픽 버튼 -->
                        <button
                            class="color-pick-button"
                            @click="navigateToColorPickPage"
                        >
                            컬러픽
                        </button>
                    </div>
                </v-col>
            </v-row>
            <!-- 상위 영역 -->
            <v-row class="upper-side" dense>
                <!-- 1번 기본 정보 영역 -->
                <v-col cols="12" md="3">
                    <div class="character-info-card">
                        <h3 class="font-weight-bold">캐릭터 정보</h3>
                        <table class="character-info-table">
                            <tbody>
                                <!-- 레벨 -->
                                <tr>
                                    <td class="icon-cell">
                                        <v-avatar
                                            class="level-icon"
                                            color="#808080"
                                            size="24"
                                        >
                                            <span class="level-text">Lv</span>
                                        </v-avatar>
                                    </td>
                                    <td class="data-cell">
                                        <span class="badge">
                                            {{
                                                characterInfo.character_level ||
                                                "레벨"
                                            }}
                                        </span>
                                    </td>
                                </tr>
                                <!-- 월드 -->
                                <tr>
                                    <td class="icon-cell">
                                        <img
                                            v-if="characterInfo.world_name"
                                            :src="
                                                getWorldIcon(
                                                    characterInfo.world_name
                                                )
                                            "
                                            alt="world-icon"
                                            class="world-icon"
                                        />
                                    </td>
                                    <td class="data-cell">
                                        <span class="badge">
                                            {{
                                                characterInfo.world_name ||
                                                "월드명"
                                            }}
                                        </span>
                                    </td>
                                </tr>
                                <!-- 성별 -->
                                <tr>
                                    <td class="icon-cell">
                                        <v-avatar
                                            :color="
                                                characterInfo.character_gender ===
                                                '여'
                                                    ? '#FFC0CB'
                                                    : '#87CEEB'
                                            "
                                            size="24"
                                            class="gender-icon"
                                        >
                                            <v-icon small color="white">
                                                {{
                                                    characterInfo.character_gender ===
                                                    "여"
                                                        ? "mdi-gender-female"
                                                        : "mdi-gender-male"
                                                }}
                                            </v-icon>
                                        </v-avatar>
                                    </td>
                                    <td class="data-cell">
                                        <span class="badge">
                                            {{
                                                characterInfo.character_gender ||
                                                "성별"
                                            }}
                                        </span>
                                    </td>
                                </tr>

                                <!-- 길드 -->
                                <tr>
                                    <td class="icon-cell">
                                        <v-avatar
                                            class="guild-icon"
                                            color="#87CEEB"
                                            size="24"
                                        >
                                            <span class="guild-text">G</span>
                                        </v-avatar>
                                    </td>
                                    <td class="data-cell">
                                        <span class="badge">
                                            {{
                                                characterInfo.character_guild_name ||
                                                "길드명"
                                            }}
                                        </span>
                                    </td>
                                </tr>
                                <!-- 직업 -->
                                <tr>
                                    <td class="icon-cell">
                                        <img
                                            :src="
                                                getJobIcon(
                                                    characterInfo.character_class
                                                )
                                            "
                                            alt="job-icon"
                                            class="job-icon"
                                        />
                                    </td>
                                    <td class="data-cell">
                                        <span class="badge">
                                            {{
                                                characterInfo.character_class ||
                                                "직업"
                                            }}
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </v-col>

                <!-- 2번 : 캐릭터 이미지 영역 -->
                <v-col cols="12" md="4">
                    <div class="character-container">
                        <!-- 동작(action)과 감정(emotion) 선택 셀렉트 박스 -->
                        <img
                            :src="
                                characterImage ||
                                'https://via.placeholder.com/150'
                            "
                            alt="Character Image"
                            class="character-image"
                            :style="{
                                transform: `scale(${scale})`,
                                transition: 'transform 0.3s ease-in-out',
                                'margin-bottom': '40px',
                            }"
                        />

                        <!-- 버튼 그룹 -->
                        <div class="button-group">
                            <!-- 확대/축소 버튼 -->
                            <v-btn
                                @click="toggleZoom"
                                class="modern-btn"
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
                            <!-- 다운로드 버튼 -->
                            <v-btn
                                @click="downloadImage"
                                class="modern-btn"
                                elevation="2"
                                style="width: 40px; padding: 0; min-width: 40px"
                            >
                                <v-icon size="20">mdi-download</v-icon>
                            </v-btn>
                        </div>
                    </div>
                </v-col>

                <!-- 3번: 퍼스널 컬러 영역 -->
                <v-col cols="12" md="5">
                    <div class="personal-color-card">
                        <h3 class="font-weight-bold">퍼스널컬러</h3>
                        <!-- 퍼스널 컬러 분석 결과 -->
                        <div
                            :class="[
                                'text-center',
                                'personal-color-result',
                                personalColorGroup,
                            ]"
                            @click="navigateToPersonalColorPage"
                            style="cursor: pointer"
                        >
                            {{ personalColorAnalysis }}
                        </div>

                        <!-- 메인 컬러 표시 -->
                        <v-row class="main-color mb-0 pb-0 align-items-center">
                            <v-col
                                cols="3"
                                class="d-flex align-items-center justify-content-end pr-1"
                            >
                                <h4 class="color-label">메인컬러</h4>
                            </v-col>
                            <v-col
                                cols="9"
                                class="d-flex align-items-center justify-content-start"
                            >
                                <v-avatar
                                    v-for="(
                                        color, index
                                    ) in characterInfo.mainColors || [
                                        '#ccc',
                                        '#ddd',
                                    ]"
                                    :key="'main-color-' + index"
                                    :color="color"
                                    size="33"
                                    class="mr-2"
                                ></v-avatar>
                            </v-col>
                        </v-row>

                        <!-- 서브 컬러 표시 -->
                        <v-row class="sub-color mt-0 pt-0 align-items-center">
                            <v-col
                                cols="3"
                                class="d-flex align-items-center justify-content-end pr-1"
                            >
                                <h4 class="color-label">서브컬러</h4>
                            </v-col>
                            <v-col
                                cols="9"
                                class="d-flex align-items-center justify-content-start"
                            >
                                <v-avatar
                                    v-for="(
                                        color, index
                                    ) in characterInfo.subColors || [
                                        '#eee',
                                        '#fff',
                                    ]"
                                    :key="'sub-color-' + index"
                                    :color="color"
                                    size="33"
                                    class="mr-2"
                                ></v-avatar>
                            </v-col>
                        </v-row>
                    </div>
                </v-col>
            </v-row>
        </div>
        <!-- 4번 : 캐시 장비 정보 영역 -->
        <v-row class="mt-4" dense>
            <v-col
                v-for="item in filteredItems"
                :key="item.type"
                cols="12"
                sm="6"
                md="4"
                class="equipment-item"
            >
                <!-- 중앙 정렬을 위한 flex 컨테이너 -->
                <div class="equipment-content">
                    <!-- 아이콘 -->
                    <div class="equipment-icon-container">
                        <img
                            :src="item.icon"
                            :alt="item.type"
                            class="equipment-icon"
                        />
                    </div>
                    <!-- 캐시 장비 정보 -->
                    <div class="equipment-details">
                        <span class="equipment-name">{{ item.name }}</span>
                        <br />
                        <span class="equipment-type">{{ item.type }}</span>
                        <p class="equipment-subdetails" v-if="item.colorRange">
                            계열: {{ item.colorRange }}
                            <br />
                            색: {{ item.colorHue }} 채:
                            {{ item.colorSaturation }} 명: {{ item.colorValue }}
                        </p>
                        <p
                            class="equipment-subdetails"
                            v-else-if="item.mixColor"
                        >
                            {{ item.baseColor }} : {{ item.baseColorRate }}
                            <br />
                            {{ item.mixColor }} : {{ item.mixColorRate }}
                        </p>
                        <p
                            class="equipment-subdetails"
                            v-else-if="item.colorStyle"
                        >
                            계열: {{ item.colorStyle }}
                            <br />
                            색: {{ item.skinHue }} 채:
                            {{ item.skinSaturation }} 명:
                            {{ item.skinBrightness }}
                        </p>
                    </div>
                </div>
            </v-col>
        </v-row>
        <!-- 공통 알림 팝업 추가 -->
        <CustomAlert
            v-if="showAlert"
            :visible="showAlert"
            title="알림"
            message="존재하지 않는 캐릭터입니다."
            @close="showAlert = false"
        />
    </v-container>
</template>

<script>
import axios from "axios";
import CustomAlert from "@/components/CustomAlert.vue"; // 공통 알림 컴포넌트

export default {
    name: "CharacterInfo",
    components: { CustomAlert },
    data() {
        return {
            scale: 0.7, // 초기 확대 배율
            characterName: "", // 검색어
            characterInfo: {}, // 캐릭터 정보 데이터
            characterImage: "",
            showAlert: false, // 알림 팝업 상태 추가
            message: "", // 오류 메시지
            characterCashItem: [],
            characterCashFace: [],
            personalColorAnalysis: "",
            exceptWeapon: false,
            REQUIRED_ITEM_TYPES: [
                { type: "헤어", icon: require("@/assets/hair.png"), name: "" },
                { type: "성형", icon: require("@/assets/face.png"), name: "" },
                { type: "피부", icon: require("@/assets/skin.png"), name: "" },
                { type: "모자", icon: "", name: "" },
                { type: "얼장", icon: "", name: "" },
                { type: "눈장", icon: "", name: "" },
                { type: "귀걸", icon: "", name: "" },
                { type: "상의", icon: "", name: "" },
                { type: "하의", icon: "", name: "" },
                { type: "신발", icon: "", name: "" },
                { type: "장갑", icon: "", name: "" },
                { type: "망토", icon: "", name: "" },
                { type: "무기", icon: "", name: "" },
            ],
            actionOptions: [], // 초기 빈 배열
            emotionOptions: [], // 초기 빈 배열
            wmotionOptions: [],
            selectedAction: "", // 초기값을 빈 문자열로 설정
            selectedEmotion: "",
            selectedWmotion: "",
            mainColorsForSave: [],
            subColorsForSave: [],
        };
    },
    methods: {
        resetValues() {
            this.characterName = ""; // 검색어 초기화
            this.characterInfo = {}; // 캐릭터 정보 초기화
            this.characterImage = ""; // 캐릭터 이미지 초기화
            this.selectedAction = ""; // 동작 선택 초기화
            this.selectedEmotion = ""; // 감정 선택 초기화
            this.selectedWeaponMotion = ""; // 무기 제외 초기화
            this.actionOptions = []; // 동작 옵션 초기화
            this.emotionOptions = []; // 감정 옵션 초기화
            this.wmotionOptions = [];
        },
        // 월드명 매핑 객체
        getWorldIcon(worldName) {
            const worldNameMap = {
                아케인: "arcane",
                오로라: "aurora",
                베라: "bera",
                크로아: "croa",
                엘리시움: "elysium",
                이노시스: "enosis",
                에오스: "eos",
                헬리오스: "helios",
                루나: "luna",
                노바: "nova",
                레드: "red",
                스카니아: "scania",
                유니온: "union",
                제니스: "zenith",
            };
            const fileName = worldNameMap[worldName] || "default";
            return require(`@/assets/world/${fileName}.png`);
        },
        /**
         * 캐릭터 이미지를 확대/축소하는 메서드
         */
        /**
         * 확대/축소 토글
         */
        toggleZoom() {
            this.scale = this.scale === 1.0 ? 0.7 : 1.0;
        },
        async downloadImage() {
            try {
                const response = await fetch(this.characterImage);
                const blob = await response.blob();
                const link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                link.download = "character_image.png"; // 다운로드 파일 이름
                link.click();
                URL.revokeObjectURL(link.href); // 메모리 해제
            } catch (error) {
                console.error("이미지 다운로드 중 오류가 발생했습니다:", error);
            }
        },
        updateCharacterName(event) {
            this.characterName = event.target.value; // 입력값 명시적 동기화
        },
        /**
         * 캐릭터 정보를 API에서 검색 및 저장
         */
        async searchAndSaveCharacter() {
            if (!this.characterName) return; // 캐릭터 이름이 없으면 중단
            this.selectedAction = "";
            this.selectedEmotion = "";
            this.selectedWmotion = "";

            try {
                const ocidResponse = await axios.get(
                    `http://localhost:8081/api/characters/ocid`,
                    {
                        params: {
                            name: this.characterName,
                            personalColor: this.personalColorAnalysis,
                        },
                    }
                );
                this.characterInfo = ocidResponse.data.characterInfoDTO;
                this.characterImage = this.characterInfo.character_image;
                console.log("캐릭 원본이미지" + this.characterImage);
                this.message = "";

                this.characterCashItem = ocidResponse.data.searchedCashItemDTOS;
                this.characterCashFace = ocidResponse.data.searchedCashFaceDTOS;

                this.loadMotionData(); // 페이지 로드 시 동작/감정 데이터 가져오기
                // 이미지가 로드된 후 extractColors 실행
                const img = new Image();
                img.crossOrigin = "Anonymous"; // 크로스 도메인 이미지 처리
                img.src = this.characterImage;

                img.onload = async () => {
                    const sortedColors = await this.extractColors(img);

                    // 메인/서브 컬러와 퍼스널컬러를 각각 분석
                    this.analyzeMainAndSubColors(sortedColors);
                    this.analyzePersonalColor(sortedColors);

                    this.saveColors(); // 퍼스널컬러 저장
                };

                this.message = "";
            } catch (error) {
                console.error(
                    "캐릭터 정보를 불러오는 중 오류가 발생했습니다:",
                    error
                );
                this.showAlert = true; // 오류 발생 시 알림 팝업 표시
                this.message = "캐릭터 정보를 불러오는 중 오류가 발생했습니다.";
            }
        },
        /**
         * 캐릭터 이미지 URL을 업데이트하는 메서드
         */
        updateCharacterImage() {
            const baseImageUrl = this.characterImage.split("?")[0];
            const params = new URLSearchParams();

            // 선택된 action, emotion 있을 경우
            if (this.selectedAction)
                params.append("action", this.selectedAction);
            if (this.selectedEmotion)
                params.append("emotion", this.selectedEmotion);
            // 무기제외(wmotion) 파라미터
            if (this.selectedWmotion)
                params.append("wmotion", this.selectedWmotion);

            // 파라미터가 없는 경우 기본 이미지를 유지
            this.characterImage = params.toString()
                ? `${baseImageUrl}?${params.toString()}`
                : baseImageUrl;
        },

        /**
         * 동작 및 감정 표현
         */
        async loadMotionData() {
            try {
                const response = await axios.get(
                    `http://localhost:8081/api/characters/motions`
                );
                const motions = response.data;

                // 동작과 감정 옵션을 분리하여 필터링
                this.actionOptions = motions.filter(
                    (m) => m.category === "action"
                );
                this.emotionOptions = motions.filter(
                    (m) => m.category === "emotion"
                );
                this.wmotionOptions = motions.filter(
                    (m) => m.category === "wmotion"
                );
            } catch (error) {
                console.error(
                    "동작 및 감정 데이터를 불러오는 중 오류 발생:",
                    error
                );
            }
        },
        async saveColors() {
            try {
                const mainColorString = this.mainColorsForSave.join(",");
                const subColorString = this.subColorsForSave.join(",");

                await axios.post(
                    `http://localhost:8081/api/characters/colors`,
                    new URLSearchParams({
                        characterImage: this.characterInfo.character_image,
                        personalColor: this.personalColorAnalysis,
                        mainColor: mainColorString,
                        subColor: subColorString,
                    }),
                    {
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                        },
                    }
                );
            } catch (error) {
                console.error("퍼스널컬러 전송 중 오류가 발생했습니다:", error);
            }
        },

        getJobIcon(jobName) {
            try {
                return require(`@/assets/job/${jobName}.png`);
            } catch (e) {
                return null;
            }
        },

        //퍼스널칼라 분석 부분
        async extractColors(img) {
            return new Promise((resolve) => {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);

                const imageData = ctx.getImageData(
                    0,
                    0,
                    img.width,
                    img.height
                ).data;
                const colorCounts = {};

                for (let i = 0; i < imageData.length; i += 4) {
                    const r = imageData[i];
                    const g = imageData[i + 1];
                    const b = imageData[i + 2];

                    // 완전 흰색과 완전 검은색 제외
                    if (
                        (r === 255 && g === 255 && b === 255) ||
                        (r === 0 && g === 0 && b === 0)
                    ) {
                        continue;
                    }

                    const hsv = this.rgbToHsv(r, g, b);
                    const roundedH = Math.round(hsv.h / 5) * 5;
                    const roundedS = Math.round(hsv.s / 5) * 5;
                    const roundedV = Math.round(hsv.v / 5) * 5;
                    const key = `${roundedH},${roundedS},${roundedV}`;

                    colorCounts[key] = (colorCounts[key] || 0) + 1;
                }

                const sortedColors = Object.entries(colorCounts)
                    .sort((a, b) => b[1] - a[1])
                    .map(([color]) => color)
                    .slice(0, 30);

                resolve(sortedColors);
            });
        },
        // 퍼스널컬러 분석 메서드
        analyzePersonalColor(sortedColors) {
            let hSum = 0,
                sSum = 0,
                vSum = 0,
                totalWeight = 0;
            const weights = sortedColors.map((_, index) =>
                index < 20 ? 0.1 : 0.02
            );

            sortedColors.forEach((key, index) => {
                const [h, s, v] = key.split(",").map(Number);
                const weight = weights[index];
                hSum += h * weight;
                sSum += s * weight;
                vSum += v * weight;
                totalWeight += weight;
            });

            const avgH = hSum / totalWeight;
            const avgS = sSum / totalWeight;
            const avgV = vSum / totalWeight;

            this.personalColorAnalysis = this.findClosestPersonalColor(
                avgH,
                avgS,
                avgV
            );
        },
        // 메인, 서브컬러 분석 메서드
        // 메인, 서브컬러 분석 메서드
        analyzeMainAndSubColors(sortedColors) {
            const groupColorsByRange = (colors) => {
                const groupedColors = {};

                colors.forEach((colorKey) => {
                    const [h, s, v] = colorKey.split(",").map(Number);

                    // HSV 값들을 10 단위로 반올림하여 통합
                    const roundedH = Math.round(h / 10) * 10;
                    const roundedS = Math.round(s / 10) * 10;
                    const roundedV = Math.round(v / 10) * 10;

                    const groupedKey = `${roundedH},${roundedS},${roundedV}`;
                    groupedColors[groupedKey] =
                        (groupedColors[groupedKey] || 0) + 1;
                });

                return Object.entries(groupedColors)
                    .sort((a, b) => b[1] - a[1])
                    .map(([key]) => key);
            };

            let groupedSortedColors = groupColorsByRange(sortedColors);

            // HEX 변환 후 완전 흰색(#ffffff)과 검은색(#000000) 필터링
            groupedSortedColors = groupedSortedColors.filter((colorKey) => {
                const [h, s, v] = colorKey.split(",").map(Number);
                const hexColor = this.hsvToHex(h, s, v);
                return (
                    hexColor.toLowerCase() !== "#ffffff" &&
                    hexColor.toLowerCase() !== "#000000"
                );
            });

            groupedSortedColors = groupedSortedColors.slice(0, 8);

            // 메인 컬러: 상위 4개 (HEX로 변환 후 저장)
            this.mainColorsForSave = groupedSortedColors
                .slice(0, 4)
                .map((colorKey) => {
                    const [h, s, v] = colorKey.split(",").map(Number);
                    return this.hsvToHex(h, s, v); // HEX 변환 후 저장
                });

            // 서브 컬러: 다음 4개 (HEX로 변환 후 저장)
            this.subColorsForSave = groupedSortedColors
                .slice(4, 8)
                .map((colorKey) => {
                    const [h, s, v] = colorKey.split(",").map(Number);
                    return this.hsvToHex(h, s, v); // HEX 변환 후 저장
                });

            // 콘솔 로그 추가 (확인용)
            console.log("Final Main Colors:", this.mainColorsForSave);
            console.log("Final Sub Colors:", this.subColorsForSave);

            // 화면 표시용
            this.characterInfo.mainColors = this.mainColorsForSave;
            this.characterInfo.subColors = this.subColorsForSave;
        },
        //퍼스널컬러 분석을 위한 rgb -> hsv 메서드
        rgbToHsv(r, g, b) {
            (r /= 255), (g /= 255), (b /= 255);
            let max = Math.max(r, g, b),
                min = Math.min(r, g, b);
            let h,
                s,
                v = max,
                d = max - min;
            s = max === 0 ? 0 : d / max;
            if (max === min) h = 0;
            else
                h =
                    max === r
                        ? (g - b) / d + (g < b ? 6 : 0)
                        : max === g
                        ? (b - r) / d + 2
                        : (r - g) / d + 4;
            h /= 6;

            return { h: h * 360, s: s * 100, v: v * 100 };
        },

        // 메인/서브 컬러 분석을 위한 hsv -> hex 메서드
        hsvToHex(h, s, v) {
            s /= 100;
            v /= 100;

            const c = v * s;
            const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
            const m = v - c;

            let r = 0,
                g = 0,
                b = 0;
            if (h >= 0 && h < 60) {
                r = c;
                g = x;
                b = 0;
            } else if (h >= 60 && h < 120) {
                r = x;
                g = c;
                b = 0;
            } else if (h >= 120 && h < 180) {
                r = 0;
                g = c;
                b = x;
            } else if (h >= 180 && h < 240) {
                r = 0;
                g = x;
                b = c;
            } else if (h >= 240 && h < 300) {
                r = x;
                g = 0;
                b = c;
            } else {
                r = c;
                g = 0;
                b = x;
            }

            r = Math.round((r + m) * 255);
            g = Math.round((g + m) * 255);
            b = Math.round((b + m) * 255);

            // HEX 값으로 반환
            return `#${((1 << 24) + (r << 16) + (g << 8) + b)
                .toString(16)
                .slice(1)}`;
        },

        findClosestPersonalColor(h, s, v) {
            const personalColors = [
                { tone: "봄웜 브라이트", h: [0, 30], s: 60, v: 55 }, // 채도(S) 기준 상향
                { tone: "봄웜 트루", h: [30, 50], s: 50, v: 50 },
                { tone: "봄웜 라이트", h: [50, 80], s: 40, v: 50 },

                { tone: "여름쿨 라이트", h: [110, 140], s: 30, v: 45 },
                { tone: "여름쿨 브라이트", h: [140, 170], s: 35, v: 45 },
                { tone: "여름쿨 뮤트", h: [170, 220], s: 25, v: 40 },

                { tone: "가을웜 뮤트", h: [40, 120], s: 20, v: 30 }, // Hue 범위 확장
                { tone: "가을웜 스트롱", h: [80, 170], s: 30, v: 35 },
                { tone: "가을웜 딥", h: [50, 200], s: 15, v: 20 }, // Hue 최대 범위 확장

                { tone: "겨울쿨 브라이트", h: [200, 270], s: 45, v: 55 },
                { tone: "겨울쿨 스트롱", h: [180, 280], s: 30, v: 35 },
                { tone: "겨울쿨 다크", h: [270, 360], s: 50, v: 40 },
            ];

            return personalColors.reduce(
                (closest, color) => {
                    const midH = (color.h[0] + color.h[1]) / 2;
                    const diff =
                        Math.abs(midH - h) +
                        Math.abs(color.s - s) +
                        Math.abs(color.v - v);
                    return diff < closest.diff
                        ? { tone: color.tone, diff: diff }
                        : closest;
                },
                { tone: "겨울쿨 다크", diff: Infinity }
            ).tone;
        },
        //퍼스널컬러 페이지로 이동
        navigateToPersonalColorPage() {
            const color = this.personalColorAnalysis;
            const encodedColor = encodeURIComponent(color); // URL 인코딩
            this.$router.push(`/personal-color-twelve/${encodedColor}`);
        },
        //컬러픽 페이지로 이동
        navigateToColorPickPage() {
            // 각 변수에 데이터를 저장
            const characterImage = this.characterImage;
            const personalColor = this.personalColorAnalysis;
            const mainColors = this.mainColorsForSave.join(","); // 메인컬러 4개
            const subColors = this.subColorsForSave.join(","); // 서브컬러 4개

            // URL 인코딩 후 라우터 푸시로 페이지 이동
            this.$router.push({
                path: "/color-pick",
                query: {
                    characterImage: encodeURIComponent(characterImage),
                    personalColor: encodeURIComponent(personalColor),
                    mainColors: encodeURIComponent(mainColors),
                    subColors: encodeURIComponent(subColors),
                },
            });
        },
    },
    created() {
        this.resetValues(); // 재검색 시 값 초기화
        // 라우터의 쿼리에서 캐릭터 이름 가져오기
        this.characterName = this.$route.query.q || "";
        if (this.characterName) {
            // 캐릭터 이름이 있을 경우 API 호출
            this.searchAndSaveCharacter();
        }
    },
    computed: {
        filteredItems() {
            return this.REQUIRED_ITEM_TYPES.map((requiredItemType) => {
                const cashItemData = this.characterCashItem.find(
                    (itemData) => itemData.item_type === requiredItemType.type
                );

                const cashFaceData = this.characterCashFace.find(
                    (itemData) => itemData.item_type === requiredItemType.type
                );

                // 아이템 데이터가 있으면 세부 정보를 추가
                if (cashItemData && cashItemData.item_name) {
                    return {
                        type: requiredItemType.type,
                        icon:
                            cashItemData.item_icon ||
                            "https://via.placeholder.com/50",
                        name: cashItemData.item_name,
                        colorRange: cashItemData.color_range || null, // null로 유지
                        colorHue: cashItemData.color_hue || 0,
                        colorSaturation: cashItemData.color_saturation || 0,
                        colorValue: cashItemData.color_value || 0,
                    };
                }

                if (cashFaceData && cashFaceData.item_name) {
                    return {
                        type: requiredItemType.type,
                        icon: requiredItemType.icon,
                        name: cashFaceData.item_name,
                        baseColor: cashFaceData.base_color,
                        baseColorRate: 100 - cashFaceData.mix_rate + "%",
                        mixColor: cashFaceData.mix_color,
                        mixColorRate: cashFaceData.mix_rate + "%",
                        colorStyle: cashFaceData.color_style || null, // null로 유지
                        skinHue: cashFaceData.skin_hue || 0,
                        skinSaturation: cashFaceData.skin_saturation || 0,
                        skinBrightness: cashFaceData.skin_brightness || 0,
                    };
                }

                // 기본값 반환
                if (requiredItemType.name) {
                    return {
                        type: requiredItemType.type,
                        icon:
                            requiredItemType.icon ||
                            "https://via.placeholder.com/50",
                        name: requiredItemType.name,
                    };
                }

                return null; // 아이템이 없으면 null
            }).filter((item) => item !== null);
        },
        //퍼스널컬러 배경색 지정
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

            return colorMap[this.personalColorAnalysis] || "default";
        },
    },
};
</script>

<style scoped>
.main-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 16px;
}

/* 2번 영역*/
.character-container {
    position: relative;
    height: 230px;
    margin: 0 auto;
    border-radius: 8px;
    background-color: #fff;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
}

.character-image {
    height: 200px;
    /* 이미지 최대 높이 */
    width: auto;
    display: block;
    margin: 0 auto;
}
.motion-select-button-group {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: 8px;
}

.motion-select-wrapper {
    position: relative;
    display: inline-block;
    width: 100px;
}

.motion-select {
    width: 100%;
    height: 28px;
    font-size: 10.5px;
    font-weight: bold;
    padding: 4px;
    padding-right: 24px; /* 화살표 공간 확보 */
    border: 1px solid #ccc;
    border-radius: 4px;
    appearance: none;
    background: white;
    position: relative;
    z-index: 1;
}

/* 커스텀 화살표 */
.motion-select-wrapper::after {
    content: "▼";
    position: absolute;
    top: 50%;
    right: 8px;
    transform: translateY(-50%);
    font-size: 10px;
    color: #333;
    pointer-events: none;
    z-index: 2;
}

/*컬러픽 버튼 */
.color-pick-button {
    height: 28px;
    font-size: 10px;
    padding: 0 12px;
    border-radius: 4px;
    background-color: #67a9f0;
    color: white;
    cursor: pointer;
    right: 10px;
}

.color-pick-button:hover {
    background-color: #0056b3;
}

/** */
.button-group {
    position: absolute;
    bottom: 16px;
    right: 16px;
    display: flex;
    gap: 8px;
    z-index: 10; /* 이미지 위에 위치 */
}

.button-group v-btn {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
}

.button-row {
    margin-top: 16px;
    display: flex;
    justify-content: center;
    gap: 16px;
}

.button-row v-btn {
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
    /* 버튼 그림자 */
}

.zoom-button-container {
    margin-top: 55px;
    text-align: center;
}

/*1,2,3, 일렬로 */
.character-info {
    text-align: left;
    padding-left: 5px;
    margin-top: 20px;
}

.equipment-item {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 12px;
    background-color: #ffffff;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
    min-height: 90px;
    transition: border 0.3s ease, box-shadow 0.3s ease;
}

.equipment-content {
    display: flex;
    align-items: center;
    width: 100%;
}

.equipment-icon-container {
    display: flex;
    align-items: center;
    justify-content: center;
}

.equipment-icon {
    width: 50px;
    height: 50px;
    object-fit: contain;
    border: 2px solid #f0f0f0;
    border-radius: 8px;
    margin-left: 10px;
    padding: 6px;
    background-color: #f9f9f9;
}

.equipment-item:hover {
    border: 1px solid #ff88aa;
    box-shadow: 0px 4px 10px rgba(255, 136, 170, 0.3);
}

.equipment-details {
    flex-grow: 1;
    text-align: left;
    line-height: 1.5;
    margin-left: 13px;
}

.equipment-name {
    font-weight: bold;
    font-size: 12px;
    margin-bottom: 5px;
}

.equipment-type {
    font-size: 12px;
    color: #335cc4ad;
}

.equipment-subdetails {
    font-size: 12px;
    color: #666;
    line-height: 1.4;
}

.search-bar {
    display: flex;
    align-items: center;
    border: 2px solid #ffccff;
    border-radius: 20px;
    padding: 8px 12px;
    width: 300px;
    margin: 0 auto;
    box-shadow: 0 0 8px #ffccff;
    transition: box-shadow 0.3s ease;
    background-color: #fff5ff;
}

.search-bar input {
    border: none;
    outline: none;
    font-size: 14px;
    flex: 1;
    background: none;
}

.search-bar input::placeholder {
    color: #ff88aa;
}

.badge {
    display: inline-block;
    padding: 0px 8px;
    border: 1px solid #ccc;
    border-radius: 12px;
    background-color: #f5f5f5;
    font-size: 0.875rem;
    font-weight: 500;
    color: #333;
    margin-right: 8px;
}

.character-info-table {
    margin-top: 10px;
    margin-left: 8px;
    border-spacing: 0 8px;
    border-collapse: separate;
}

.icon-cell {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
}

.data-cell {
    text-align: left;
    vertical-align: middle;
    padding-left: 13px;
}

.gender-icon,
.guild-icon,
.job-icon {
    width: 20px;
    height: 20px;
}

.world-icon {
    width: 27px;
    height: 27px;
}

.level-icon,
.guild-icon,
.job-icon {
    width: 24px;
    height: 24px;
}

.level-text,
.guild-text {
    font-size: 12px;
    font-weight: bold;
    line-height: 1;
    color: white;
}

.gender-icon {
    width: 20px;
    height: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    font-weight: bold;
    line-height: 1;
}

.world-guild {
    margin-top: 8px;
}

.job-image {
    width: 80px;
    /* 직업 이미지 크기 */
    height: 80px;
    border-radius: 8px;
    margin-bottom: 8px;
    /* 직업 이름과 간격 */
}

.job-badge {
    font-size: 1rem;
    font-weight: bold;
    color: #333;
    background-color: #f5f5f5;
    padding: 4px 8px;
    border-radius: 12px;
}

/* 검색창*/
.search-bar-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    padding: 12px 16px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    background-color: #ffffff;
    border-radius: 8px;
    margin-bottom: 16px;
}

.search-input {
    flex: 1;
    /* 검색창 너비를 버튼과 함께 조정 */
    padding: 8px 12px;
    border: 1px solid #ccc;
    border-radius: 8px;
    outline: none;
    margin-right: 8px;
}

.search-button {
    background-color: #d96dcb;
    color: white;
    border: none;
    border-radius: 8px;
    padding: 8px 16px;

    cursor: pointer;
    transition: background-color 0.3s ease;
}

.search-button:hover {
    background-color: #e58cda;
}

/*캐릭터 정보 영역*/
.character-info-card {
    height: 230px;
    background-color: #ffffff;
    color: #2c3e50;
    border-radius: 8px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    align-items: center;
}

/*퍼스널컬러*/
.personal-color-card {
    height: 230px;
    background-color: #ffffff;
    color: #2c3e50;
    border-radius: 8px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    align-items: center;
}
/*퍼스널컬러 결과 */
.personal-color-result {
    width: 100%;
    font-size: 16px;
    font-weight: bold;
    text-transform: uppercase;
    padding: 4px 8px;
    text-align: center;
    margin-top: 8px;
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

.main-color {
    margin-top: 10px;
    margin-bottom: 0 !important;
    padding-bottom: 0 !important;
}

.sub-color {
    margin-top: 0 !important;
    padding-top: 0 !important;
}

.color-label {
    margin: 0;
    padding-top: 8px;
    font-size: 11px;
    color: #636364;
    white-space: nowrap; /* 개행 방지 */
}

.no-gutters {
    margin: 0 !important;
    padding: 0 !important;
}
</style>
