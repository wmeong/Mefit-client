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
          color="primary"
          dark
          @click="searchAndSaveCharacter"
          class="mb-4"
          block
        >
          검색 및 저장
        </v-btn>

        <!-- 캐릭터 정보 카드 -->
        <v-card v-if="character" class="mb-4 pa-4 elevation-2 modern-card">
          <v-card-title class="headline text-center">
            {{ character.character_name }}
          </v-card-title>
          <v-card-subtitle class="text-center">
            <p><strong>월드:</strong> {{ character.world_name }}</p>
            <p><strong>성별:</strong> {{ character.character_gender }}</p>
            <p><strong>직업:</strong> {{ character.character_class }}</p>
            <p><strong>레벨:</strong> {{ character.character_level }}</p>
            <p><strong>길드:</strong> {{ character.character_guild_name }}</p>
          </v-card-subtitle>
          <v-card-text class="text-center">
            <v-img
              :src="character.character_image"
              alt="Character Image"
              contain
              max-height="200"
            ></v-img>
          </v-card-text>
        </v-card>

        <!-- 색상 선택 카드 -->
        <v-card class="pa-4 mb-4 elevation-2 modern-card">
          <v-card-title class="headline">외형 커스터마이징</v-card-title>
          <v-row>
            <v-col cols="8">
              <v-color-picker
                v-model="selectedColor"
                flat
                hide-canvas
              ></v-color-picker>
              <v-btn
                color="primary"
                @click="addColorToList"
                class="mt-3"
              >
                색상 추가
              </v-btn>
            </v-col>
            <v-col cols="4">
              <div class="color-box">
                <div v-for="(color, index) in colorList" :key="index" class="color-swatch" :style="{ backgroundColor: color }"></div>
                <v-btn icon @click="clearColorList" class="clear-button">
                  <v-icon>mdi-trash-can-outline</v-icon>
                </v-btn>
              </div>
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
      characterName: "", // 검색할 캐릭터 이름
      character: {}, // 검색된 캐릭터 정보 저장
      message: "", // 결과 메시지
      selectedColor: "", // 현재 선택된 색상
      colorList: [] // 선택된 색상 목록
    };
  },
  methods: {
    async searchAndSaveCharacter() {
      try {
        const ocidResponse = await axios.get(
          `http://localhost:8081/api/characters/ocid`,
          { params: { name: this.characterName } }
        );
        this.character = ocidResponse.data;
        this.message = ""; // 오류 메시지 초기화
      } catch (error) {
        console.error(error);
        this.message = "캐릭터 정보를 불러오는 중 오류가 발생했습니다.";
      }
    },
    addColorToList() {
      if (this.selectedColor && !this.colorList.includes(this.selectedColor)) {
        this.colorList.push(this.selectedColor);
      }
    },
    clearColorList() {
      this.colorList = []; // 색상 목록 초기화
    }
  },
};
</script>

<style scoped>
/* 모던한 스타일 추가 */
.modern-title {
  color: #2c3e50;
  font-weight: bold;
  font-size: 1.5em;
}
.modern-card {
  background-color: #f9f9f9;
  color: #2c3e50;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}
.color-box {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 10px;
  border: 2px solid #ddd;
  border-radius: 8px;
  min-height: 100px;
  background-color: #fff;
  position: relative;
}
.color-swatch {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #ddd;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.3);
}
.clear-button {
  position: absolute;
  top: 5px;
  right: 5px;
}
</style>
