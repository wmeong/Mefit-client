<template>
    <v-container>
        <v-row class="align-center justify-center">
            <v-col cols="12" md="8" lg="6">
                <h1 class="text-center modern-title mb-5">캐릭터 검색</h1>

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

                <!-- 장비 리스트 추가 -->
                <v-row>
                    <v-col
                        v-for="item in filteredItems"
                        :key="item.type"
                        cols="4"
                        class="d-flex flex-column align-center mb-4 equipment-item"
                    >
                        <img
                            :src="item.icon"
                            :alt="item.type"
                            contain
                            max-height="50"
                            max-width="50"
                        />
                        <span class="text-center mt-2">{{ item.name }}</span>
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
            characterCasyItem : [],
            REQUIRED_ITEM_TYPES: [
                { type: "헤어", icon: "https://via.placeholder.com/50", name: "헤어" },
                { type: "성형", icon: "https://via.placeholder.com/50", name: "성형" },
                { type: "피부", icon: "https://via.placeholder.com/50", name: "피부" },
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
                this.characterCasyItem = ocidResponse.data.searchedCashItemDTOS;
                console.log(this.characterCasyItem);
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
            // 캐시 아이템 데이터와 순서 고정을 위해 필터링
            return this.REQUIRED_ITEM_TYPES.map((itemType) => {
                // 데이터에서 해당 item_type을 찾기
                const itemData = this.characterCasyItem.find(
                    (data) => data.item_type === itemType.type
                );

                // 데이터가 존재하고 item_name이 있으면 사용
                if (itemData && itemData.item_name) {
                    return {
                        type: itemType.type,
                        icon: itemData.item_icon || "https://via.placeholder.com/50", // 기본값 처리
                        name: itemData.item_name,
                    };
                }

                // 헤어, 성형, 피부와 같은 기본값 제공
                if (itemType.name) {
                    return {
                        type: itemType.type,
                        icon: itemType.icon || "https://via.placeholder.com/50", // 기본값 처리
                        name: itemType.name,
                    };
                }

                // 나머지 경우 null 반환
                return null;
            }).filter((item) => item !== null); // null 제거
        },
    },

};
</script>

<style scoped>
.modern-title {
    color: #2c3e50;
    font-weight: bold;
    font-size: 1.5em;
}
.modern-card {
    background-color: #ffffff;
    color: #2c3e50;
    border-radius: 8px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}
.equipment-item {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 8px;
    background-color: #f9f9f9;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
    transition: border 0.3s ease; /* 부드러운 효과 */
}

.equipment-item:hover {
    border: 1px solid #ff88aa; /* hover 시 테두리를 진하게 */
    box-shadow: 0px 4px 10px rgba(255, 136, 170, 0.3); /* 부드러운 그림자 효과 추가 */
}
</style>
