<template>
  <div>
    <h1>Character Search</h1>
    <input v-model="characterName" placeholder="Enter character name" />
    <button @click="searchAndSaveCharacter">Search & Save</button>

   <v-color-picker></v-color-picker>


    <div v-if="character">
      <h2>Character Info</h2>
      <p><strong>Name:</strong> {{ character.character_name }}</p>
      <p><strong>World:</strong> {{ character.world_name }}</p>
      <p><strong>Gender:</strong> {{ character.character_gender }}</p>
      <p><strong>Class:</strong> {{ character.character_class }}</p>
      <p><strong>Level:</strong> {{ character.character_level }}</p>
      <p><strong>Guild:</strong> {{ character.character_guild_name }}</p>
      <img :src="character.character_image" alt="Character Image" />
    </div>

    <p v-if="message">{{ message }}</p>
  </div>
</template>

<script>
import axios from "axios"; // axios import 추가

export default {
  name: "CharacterInfo",
  data() {
    return {
      characterName: "", // 검색할 캐릭터 이름
      character: {}, // 검색된 캐릭터 정보 저장
      message: "", // 결과 메시지
    };
  },
  methods: {
    async searchAndSaveCharacter() {
      try {
        // ocid조회 + 회원정보 조회 + 조회수 저장
        const ocidResponse = await axios.get(
          `http://localhost:8081/api/characters/ocid`,
          { params: { name: this.characterName } } // 쿼리 파라미터 전달
        );
        this.character = ocidResponse.data;
      } catch (error) {
        console.error(error);
        this.message = "An error occurred while saving the character.";
      }
    },
  },
};
</script>

<style scoped>
h1 {
  color: #42b983;
}
img {
  width: 200px;
  height: auto;
  margin-top: 10px;
}
</style>
