<template>
  <div>
    <h1>Character Search</h1>
    <input v-model="characterName" placeholder="Enter character name" />
    <button @click="searchAndSaveCharacter">Search & Save</button>

    <div v-if="character">
      <h2>Character Info</h2>
      <p><strong>Name:</strong> {{ character.characterName }}</p>
      <p><strong>World:</strong> {{ character.worldName }}</p>
      <p><strong>Gender:</strong> {{ character.characterGender }}</p>
      <p><strong>Class:</strong> {{ character.characterClass }}</p>
      <p><strong>Level:</strong> {{ character.characterLevel }}</p>
      <p><strong>Guild:</strong> {{ character.characterGuildName }}</p>
      <img :src="character.characterImage" alt="Character Image" />
    </div>

    <p v-if="message">{{ message }}</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      characterName: '', // 검색할 캐릭터 이름
      character: null,    // 검색된 캐릭터 정보 저장
      message: '',        // 결과 메시지
    };
  },
  methods: {
    async searchAndSaveCharacter() {
      try {
        // 1단계: 캐릭터 이름으로 ocid 조회
        const ocidResponse = await axios.get(
          `http://localhost:8081/api/characters/ocid`,
          { params: { name: this.characterName } } // 쿼리 파라미터 전달
        );

        const ocid = ocidResponse.data.ocid;

        if (!ocid) {
          this.message = 'Character not found.';
          return;
        }

        // 2단계: ocid로 캐릭터 정보를 가져와 서버에 저장
        const saveResponse = await axios.post(
          `http://localhost:8081/api/characters/save`,
          { ocid: ocid } // POST 바디에 ocid 전달
        );

        if (saveResponse.status === 200) {
          // 서버에서 저장된 캐릭터 정보를 받아와 화면에 표시
          this.character = saveResponse.data;
          this.message = 'Character saved successfully!';
        } else {
          this.message = 'Failed to save character.';
        }
      } catch (error) {
        console.error(error);
        this.message = 'An error occurred while saving the character.';
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
