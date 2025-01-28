<template>
  <v-dialog v-model="visible" max-width="550px" @click:outside="closeDialog">
    <v-card>
      <v-card-title>
        <span class="headline">{{ characterData.name || "로딩 중..." }}</span>
      </v-card-title>
      <v-card-text>
        <v-container v-if="!loading">
          <v-row>
            <!-- 캐릭터 이미지 -->
            <v-col cols="4" class="character-img-container">
              <img
                :src="characterData.image"
                alt="Character"
                class="character-img"
                v-if="characterData.image"
              />
            </v-col>

            <!-- 착용 아이템 목록 -->
            <v-col cols="8">
              <h4 class="item-title">🛍️ 착용 아이템</h4>
              <v-row dense>
                <v-col
                  v-for="(item, index) in characterData.items"
                  :key="index"
                  cols="6"
                >
                  <v-card class="item-card">
                    <v-card-text class="item-content">
                      <!-- ✅ 아이템 아이콘 -->
                      <img
                        v-if="item.icon"
                        :src="item.icon"
                        alt="Item Icon"
                        class="item-icon"
                      />
                      <div class="item-info">
                        <div class="item-name">{{ item.name }}</div>
                        <div class="item-type">{{ item.details }}</div>
                        <!-- ✅ 색상 정보 (색, 채, 명) -->
                        <div
                          v-if="item.colorHue !== null"
                          class="color-info"
                        >
                          <span class="color-label">🎨</span>
                          (색: {{ item.colorHue }}, 채: {{ item.colorSaturation }}, 명: {{ item.colorValue }})
                        </div>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-container>

        <!-- 로딩 상태 표시 -->
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
        image: "",
        name: "",
        items: [],
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
        return;
      }

      this.loading = true;
      try {
        const response = await axios.get(`/api/personal/character/image`, {
          params: { imageUrl: this.characterData.image },
        });

        if (response.data.length > 0) {
          this.characterData.name = response.data[0].characterName;
          this.characterData.items = response.data.map((item) => ({
            name: item.itemName,
            details: item.itemType,
            icon: item.itemIcon,
            colorHue: item.colorHue,
            colorSaturation: item.colorSaturation,
            colorValue: item.colorValue,
          }));
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

<style scoped>
/* 캐릭터 이미지 스타일 */
.character-img-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
.character-img {
  max-width: 80px;
  height: auto;
  border-radius: 8px;
}

/* 아이템 목록 스타일 */
.item-title {
  font-weight: bold;
  margin-bottom: 10px;
}

/* 개별 아이템 카드 스타일 */
.item-card {
  padding: 5px;
  height: 80px; /* ✅ 카드 크기 일정하게 고정 */
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
  text-align: center;
}

/* 카드 내부 정렬 */
.item-content {
  display: flex;
  align-items: center;
  gap: 5px;
  width: 100%;
  justify-content: center;
}

/* 아이템 아이콘 */
.item-icon {
  width: 22px;
  height: 22px;
  flex-shrink: 0;
}

/* 아이템 정보 */
.item-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center; /* ✅ 가운데 정렬 */
  text-align: center;
}

/* 아이템 이름 */
.item-name {
  font-size: 0.85rem;
  font-weight: bold;
  white-space: nowrap; /* ✅ 줄바꿈 방지 */
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100px;
}

/* 아이템 카테고리 */
.item-type {
  font-size: 0.75rem;
  color: gray;
  white-space: nowrap; /* ✅ 줄바꿈 방지 */
}

/* 색상 정보 */
.color-info {
  font-size: 0.7rem;
  color: #4c4c4c;
  margin-top: 2px;
  white-space: nowrap; /* ✅ 줄바꿈 방지 */
}
.color-label {
  font-weight: bold;
}
</style>
