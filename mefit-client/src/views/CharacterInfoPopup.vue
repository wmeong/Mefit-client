<template>
  <v-dialog v-model="visible" max-width="600px" @click:outside="closeDialog">
    <v-card>
      <v-card-title>
        <span class="headline">{{ characterData.name || "로딩 중..." }}</span>
      </v-card-title>
      <v-card-text>
        <v-container v-if="!loading">
          <v-row>
            <v-col cols="4">
              <img
                :src="characterData.image"
                alt="Character"
                class="character-img"
                v-if="characterData.image"
              />
            </v-col>
            <v-col cols="8">
              <h4>착용 아이템</h4>
              <v-list>
                <v-list-item
                  v-for="(item, index) in characterData.items"
                  :key="index"
                >
                  <v-list-item-content>
                    <v-list-item-title>{{ item.name }}</v-list-item-title>
                    <v-list-item-subtitle>{{
                      item.details
                    }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-col>
          </v-row>
        </v-container>
        <v-progress-circular
          v-else
          indeterminate
          color="primary"
        ></v-progress-circular>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="closeDialog">닫기</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from "axios";

export default {
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
    character: {
      type: Object,
      required: true,
    },
  },
  emits: ["update:modelValue"],
  data() {
    return {
      characterData: {
        image: "", // 이미지 URL 저장
        name: "", // 캐릭터 이름
        items: [], // 착용 아이템 리스트
      },
      loading: false,
    };
  },
  computed: {
    visible: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit("update:modelValue", value);
      },
    },
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        this.loadCharacterData();
      }
    },
    character: {
      handler(newCharacter) {
        console.log("🔍 팝업에서 받은 캐릭터 이미지 URL:", newCharacter.image); // << 이미지 URL 확인
        if (newCharacter.image) {
          this.characterData.image = newCharacter.image;
          this.loadCharacterData();
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    async loadCharacterData() {
      if (!this.characterData.image) {
        console.warn("🚨 이미지 URL이 없습니다!");
        return;
      }

      this.loading = true;
      try {
        console.log("🔍 API 호출 시작:", this.characterData.image);
        const response = await axios.get(`/api/personal/character/image`, {
          params: { imageUrl: this.characterData.image },
        });

        if (response.data.length > 0) {
          this.characterData.name = response.data[0].characterName;
          this.characterData.items = response.data.map((item) => ({
            name: item.itemName,
            details: item.itemType,
          }));
          console.log("✅ API 응답:", response.data);
        } else {
          console.warn("⚠️ 해당 이미지의 캐릭터 정보를 찾을 수 없습니다.");
        }
      } catch (error) {
        console.error("❌ 캐릭터 데이터를 불러오는 중 오류 발생:", error);
      } finally {
        this.loading = false;
      }
    },
    closeDialog() {
      this.$emit("update:modelValue", false);
    },
  },
};
</script>

<style>
.character-img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
}
</style>
