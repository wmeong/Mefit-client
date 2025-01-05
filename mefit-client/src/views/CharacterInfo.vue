최신 코드
<template>
    <v-container>
        <v-row class="align-center justify-center">
            <v-col cols="12" md="8" lg="6">
                <h1 class="text-center modern-title mb-5">검색</h1>

                <v-text-field
                    v-model="characterName"
                    label="캐릭터 이름 입력"
                    outlined
                    hide-details
                    class="mb-4"
                    @keyup.enter="searchAndSaveCharacter"
                ></v-text-field>

                <v-btn
                    style="
                        background-color: #ffebf5;
                        box-shadow: 0px 4px 10px rgba(255, 182, 193, 0.3);
                    "
                    dark
                    @click="searchAndSaveCharacter"
                    class="mb-4 rounded-button"
                    block
                >
                    검색 및 저장
                </v-btn>

                <!-- 캐릭터 정보 카드 -->
                <v-card class="mb-4 pa-4 elevation-2 modern-card">
                    <v-card-title class="headline text-center">
                        {{ characterInfo.character_name || "캐릭터 이름" }}
                    </v-card-title>
                    <v-card-subtitle class="text-center">
                        <p>
                            <strong>월드:</strong>
                            {{ characterInfo.world_name || "월드명" }}
                        </p>
                        <p>
                            <strong>성별:</strong>
                            {{ characterInfo.character_gender || "성별" }}
                        </p>
                        <p>
                            <strong>직업:</strong>
                            {{ characterInfo.character_class || "직업" }}
                        </p>
                        <p>
                            <strong>레벨:</strong>
                            {{ characterInfo.character_level || "레벨" }}
                        </p>
                        <p>
                            <strong>길드:</strong>
                            {{ characterInfo.character_guild_name || "길드명" }}
                        </p>
                    </v-card-subtitle>
                    <v-card-text class="d-flex justify-center">
                        <!-- 메인 컬러 표시 -->
                        <v-col cols="3">
                            <h3 class="text-center">메인컬러</h3>
                            <v-row>
                                <v-col
                                    v-for="(
                                        color, index
                                    ) in characterInfo.main_colors || [
                                        '#ccc',
                                        '#ddd',
                                    ]"
                                    :key="'main-color-' + index"
                                    class="d-flex justify-center mb-2"
                                >
                                    <v-avatar
                                        :color="color"
                                        size="36"
                                    ></v-avatar>
                                </v-col>
                            </v-row>
                        </v-col>

                        <!-- 캐릭터 이미지 -->
                        <v-img
                            :src="
                                characterInfo.character_image ||
                                'https://via.placeholder.com/150'
                            "
                            alt="Character Image"
                            contain
                            max-height="200"
                        ></v-img>

                        <!-- 서브 컬러 표시 -->
                        <v-col cols="3">
                            <h3 class="text-center">서브컬러</h3>
                            <v-row>
                                <v-col
                                    v-for="(
                                        color, index
                                    ) in characterInfo.sub_colors || [
                                        '#eee',
                                        '#fff',
                                    ]"
                                    :key="'sub-color-' + index"
                                    class="d-flex justify-center mb-2"
                                >
                                    <v-avatar
                                        :color="color"
                                        size="36"
                                    ></v-avatar>
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-card-text>
                </v-card>

   <v-row>
    <v-col
        v-for="item in filteredItems"
        :key="item.type"
        cols="4"
        class="equipment-item"
    >
        <div class="d-flex align-start">
            <!-- 아이콘 -->
            <div>
                <img
                    :src="item.icon"
                    :alt="item.type"
                    class="equipment-icon"
                />
            </div>

            <!-- 캐시 장비 정보 -->
            <div class="equipment-details">
                <span class="equipment-name">{{ item.name }}</span>

                <p class="equipment-subdetails" v-if="item.colorRange">
                    계열: {{ item.colorRange }}<br />
                    색: {{ item.colorHue }} 채: {{ item.colorSaturation }} 명: {{ item.colorValue }}
                </p>
                <p class="equipment-subdetails" v-else-if="item.mixColor">
                    {{ item.baseColor }} : {{ item.baseColorRate }} <br/>
                    {{ item.mixColor}} :  {{ item.mixColorRate}}
                </p>
                <p class="equipment-subdetails" v-else-if="item.colorStyle">
                    계열: {{ item.colorStyle }}<br />
                    색: {{ item.skinHue }} 채: {{ item.skinSaturation }} 명: {{ item.skinBrightness }}
                </p>
            </div>
        </div>
    </v-col>
</v-row>



                <!-- 오류 메시지 표시 -->
                <v-alert v-if="message" type="error" outlined class="mt-4">
                    {{ message }}
                </v-alert>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import axios from "axios";

export default {
    name: "CharacterInfo",
    data() {
        return {
            characterName: "", // 검색어
            characterInfo: {}, // 캐릭터 정보 데이터
            message: "", // 오류 메시지
            characterCashItem : [], 
            characterCashFace : [],
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
        };
    },
    methods: {
        /**
         * 캐릭터 정보를 API에서 검색 및 저장
         */
        async searchAndSaveCharacter() {
            if (!this.characterName) return; // 캐릭터 이름이 없으면 중단
            try {
                const ocidResponse = await axios.get(
                    `http://localhost:8081/api/characters/ocid`,
                    { params: { name: this.characterName } }
                );
                this.characterInfo = ocidResponse.data.characterInfoDTO;
                this.characterCashItem = ocidResponse.data.searchedCashItemDTOS;
                this.characterCashFace = ocidResponse.data.searchedCashFaceDTOS;
                console.log("item", this.characterCashItem);
                  console.log("face", this.characterCashFace);
                this.message = "";
            } catch (error) {
                console.error(
                    "캐릭터 정보를 불러오는 중 오류가 발생했습니다:",
                    error
                );
                this.message = "캐릭터 정보를 불러오는 중 오류가 발생했습니다.";
            }
        },
    },
    created() {
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
            // 캐릭터의 캐시 아이템 데이터에서 item_type이 requiredItemType.type과 일치하는 데이터를 찾는다.
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
                    icon: cashItemData.item_icon || "https://via.placeholder.com/50",
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
                    baseColorRate: 100-cashFaceData.mix_rate + "%",
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
                    icon: requiredItemType.icon || "https://via.placeholder.com/50",
                    name: requiredItemType.name,
                };
            }

            return null; // 아이템이 없으면 null
        }).filter((item) => item !== null);
    },
},




};
</script>
<style scoped>
/* 기존 제목 스타일 */
.modern-title {
    color: #2c3e50;
    font-weight: bold;
    font-size: 1.5em;
}

/* 기존 카드 스타일 */
.modern-card {
    background-color: #ffffff;
    color: #2c3e50;
    border-radius: 8px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}
/* 아이템 박스 스타일 */
.equipment-item {
    display: flex;
    align-items: center;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 12px;
    background-color: #ffffff;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
    min-height: 100px;
    transition: border 0.3s ease, box-shadow 0.3s ease;
}

/* 호버 효과 */
.equipment-item:hover {
    border: 1px solid #ff88aa; /* hover 시 테두리를 진하게 */
    box-shadow: 0px 4px 10px rgba(255, 136, 170, 0.3); /* hover 시 그림자 */
}

/* 아이콘 이미지 스타일 */
.equipment-icon {
    flex-shrink: 0;
    width: 50px;
    height: 50px;
    margin-right: 12px;
    object-fit: contain;
    border: 2px solid #f0f0f0;
    border-radius: 8px;
    padding: 6px;
    background-color: #f9f9f9;
}

/* 텍스트 부분 스타일 */
.equipment-details {
    flex-grow: 1;
    text-align: left;
    line-height: 1.5;
}

/* 아이템 이름 스타일 */
.equipment-name {
    font-weight: bold;
    font-size: 14px;
    margin-bottom: 5px;
}

/* 세부 정보 텍스트 스타일 */
.equipment-subdetails {
    font-size: 12px;
    color: #666;
    line-height: 1.4;
}


/* 아이템 ID 텍스트 스타일 */
.equipment-id {
    font-size: 10px;
    color: #999;
    margin-top: 5px;
}
</style>

