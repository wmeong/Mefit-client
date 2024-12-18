
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
            {{ character.character_name || '캐릭터 이름' }}
          </v-card-title>
          <v-card-subtitle class="text-center">
            <p><strong>월드:</strong> {{ character.world_name || '월드명' }}</p>
            <p><strong>성별:</strong> {{ character.character_gender || '성별' }}</p>
            <p><strong>직업:</strong> {{ character.character_class || '직업' }}</p>
            <p><strong>레벨:</strong> {{ character.character_level || '레벨' }}</p>
            <p><strong>길드:</strong> {{ character.character_guild_name || '길드명' }}</p>
          </v-card-subtitle>
          <v-card-text class="d-flex justify-center">
            <!-- 메인 컬러 표시 -->
            <v-col cols="3">
              <h3 class="text-center">메인컬러</h3>
              <v-row>
                <v-col
                  v-for="(color, index) in character.main_colors || ['#ccc', '#ddd']"
                  :key="'main-color-' + index"
                  class="d-flex justify-center mb-2"
                >
                  <v-avatar :color="color" size="36"></v-avatar>
                </v-col>
              </v-row>
            </v-col>

            <!-- 캐릭터 이미지 -->
            <v-img
              :src="character.character_image || 'https://via.placeholder.com/150'"
              alt="Character Image"
              contain
              max-height="200"
            ></v-img>

            <!-- 서브 컬러 표시 -->
            <v-col cols="3">
              <h3 class="text-center">서브컬러</h3>
              <v-row>
                <v-col
                  v-for="(color, index) in character.sub_colors || ['#eee', '#fff']"
                  :key="'sub-color-' + index"
                  class="d-flex justify-center mb-2"
                >
                  <v-avatar :color="color" size="36"></v-avatar>
                </v-col>
              </v-row>
            </v-col>
          </v-card-text>
        </v-card>

        <!-- 장비 리스트 추가 -->
        <v-card class="pa-4 mb-4 elevation-2 modern-card">
          <v-card-title class="headline text-center">장비 목록</v-card-title>
          <v-row>
            <v-col cols="4" class="d-flex flex-column align-center mb-4 equipment-item">
              <v-img
                src="https://via.placeholder.com/50"
                alt="모자"
                contain
                max-height="50"
                max-width="50"
              ></v-img>
              <span class="text-center mt-2">모자</span>
            </v-col>
            <v-col cols="4" class="d-flex flex-column align-center mb-4 equipment-item">
              <img
                src="https://open.api.nexon.com/static/maplestory/item/icon/KEPCNEGG"
                alt="헤어"
                contain
                max-height="50"
                max-width="50"
              />              
              <span class="text-center mt-2">헤어</span>
            </v-col>
            <v-col cols="4" class="d-flex flex-column align-center mb-4 equipment-item">
              <img
                src="https://via.placeholder.com/50"
                alt="성형"
                contain
                max-height="50"
                max-width="50"
              />
              <span class="text-center mt-2">성형</span>
            </v-col>
            <v-col cols="4" class="d-flex flex-column align-center mb-4 equipment-item">
              <v-img
                src="https://via.placeholder.com/50"
                alt="얼장"
                contain
                max-height="50"
                max-width="50"
              ></v-img>
              <span class="text-center mt-2">얼장</span>
            </v-col>
            <v-col cols="4" class="d-flex flex-column align-center mb-4 equipment-item">
              <v-img
                src="https://via.placeholder.com/50"
                alt="눈장"
                contain
                max-height="50"
                max-width="50"
              ></v-img>
              <span class="text-center mt-2">눈장</span>
            </v-col>
            <v-col cols="4" class="d-flex flex-column align-center mb-4 equipment-item">
              <v-img
                src="https://via.placeholder.com/50"
                alt="귀걸"
                contain
                max-height="50"
                max-width="50"
              ></v-img>
              <span class="text-center mt-2">귀걸</span>
            </v-col>
            <v-col cols="4" class="d-flex flex-column align-center mb-4 equipment-item">
              <v-img
                src="https://via.placeholder.com/50"
                alt="상의"
                contain
                max-height="50"
                max-width="50"
              ></v-img>
              <span class="text-center mt-2">상의</span>
            </v-col>
            <v-col cols="4" class="d-flex flex-column align-center mb-4 equipment-item">
              <v-img
                src="https://via.placeholder.com/50"
                alt="신발"
                contain
                max-height="50"
                max-width="50"
              ></v-img>
              <span class="text-center mt-2">신발</span>
            </v-col>
            <v-col cols="4" class="d-flex flex-column align-center mb-4 equipment-item">
              <v-img
                src="https://via.placeholder.com/50"
                alt="망토"
                contain
                max-height="50"
                max-width="50"
              ></v-img>
              <span class="text-center mt-2">망토</span>
            </v-col>
            <v-col cols="4" class="d-flex flex-column align-center mb-4 equipment-item">
              <v-img
                src="https://via.placeholder.com/50"
                alt="무기"
                contain
                max-height="50"
                max-width="50"
              ></v-img>
              <span class="text-center mt-2">무기</span>
            </v-col>
            <v-col cols="4" class="d-flex flex-column align-center mb-4 equipment-item">
              <v-img
                src="https://via.placeholder.com/50"
                alt="피부"
                contain
                max-height="50"
                max-width="50"
              ></v-img>
              <span class="text-center mt-2">피부</span>
            </v-col>
          </v-row>
        </v-card>

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
      characterName: "",
      character: {},
      message: "",
    };
  },
  methods: {
    async searchAndSaveCharacter() {
      if (!this.characterName) return; // 캐릭터 이름이 없으면 중단
      try {
        const ocidResponse = await axios.get(
          `http://localhost:8081/api/characters/ocid`,
          { params: { name: this.characterName } }
        );
        this.character = ocidResponse.data;
        this.message = "";
      } catch (error) {
        console.error("캐릭터 정보를 불러오는 중 오류가 발생했습니다:", error);
        this.message = "캐릭터 정보를 불러오는 중 오류가 발생했습니다.";
      }
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
}
</style>
