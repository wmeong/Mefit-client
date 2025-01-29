<template>
  <v-dialog v-model="visible" max-width="750px" @click:outside="closeDialog">
    <v-card>
      <!-- ✅ 상단 닫기 버튼 추가 -->
      <v-card-title class="close-button">
        <v-spacer></v-spacer>
        <v-btn icon @click="closeDialog">
          <v-icon>mdi-close</v-icon>
          <!-- ✅ X 아이콘 -->
        </v-btn>
      </v-card-title>

      <v-card-text>
        <v-container class="character-popup">
          <!-- 캐릭터 이미지 -->
          <v-row justify="center">
            <v-col cols="12" class="text-center">
              <img
                v-if="characterData.image"
                :src="characterData.image"
                alt="Character"
                class="character-img"
              />
            </v-col>
          </v-row>

          <v-row dense>
            <v-col v-for="(item, index) in characterData.items" :key="index" cols="4">
              <v-card class="item-card">
                <v-card-text class="item-content">
                  <!-- ✅ 아이템 아이콘 -->
                  <img
                    v-if="item.item_icon"
                    :src="item.item_icon"
                    alt="Item Icon"
                    class="item-icon"
                  />
                  <div class="item-info">
                    <div class="item-name">{{ item.item_name }}</div>
                    <div class="item-type">{{ item.item_type }}</div>

                    <!-- ✅ 색상 정보 (색, 채, 명) - 헤어, 성형, 피부는 제외 -->
                    <div
                      v-if="item.color_hue !== null && !['헤어', '성형', '피부'].includes(item.item_type)"
                      class="color-info"
                    >
                      <span class="color-label"></span>
                      계열: {{ item.color_range }}
                      <br />
                      색: {{ item.color_hue }}, 채: {{ item.color_saturation }}, 명: {{ item.color_value }}
                    </div>

                    <!-- ✅ 믹스 컬러 정보 -->
                    <div v-if="item.mix_color" class="mix-color-info">
                      {{ item.base_color }} {{ 100 - item.mix_rate }}%
                      {{ item.mix_color }} {{ item.mix_rate }}%
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>

        <!-- 로딩 상태 표시 -->
        <v-progress-circular v-if="loading" indeterminate color="primary"></v-progress-circular>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import hairIcon from "@/assets/hair.png";
import faceIcon from "@/assets/face.png";
import skinIcon from "@/assets/skin.png";
import axios from "axios";

export default {
  props: {
    modelValue: {
      type: Boolean,
      required: true
    },
    character: {
      type: Object,
      required: true
    }
  },
  emits: ["update:modelValue"],
  data() {
    return {
      characterData: {
        image: "",
        name: "",
        items: []
      },
      loading: false
    };
  },
  computed: {
    visible: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit("update:modelValue", value);
      }
    }
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
      immediate: true
    }
  },
  methods: {
    async loadCharacterData() {
      if (!this.characterData.image) {
        return;
      }

      this.loading = true;
      try {
        const response = await axios.get(`/api/personal/character/image`, {
          params: { imageUrl: this.characterData.image }
        });

        console.log("가져온 데이터:", response.data);

        const itemData = response.data || {};
        const searchedCashItemDTOS = itemData.searchedCashItemDTOS || [];
        const searchedCashFaceDTOS = itemData.searchedCashFaceDTOS || [];

        // ✅ 모든 아이템을 하나의 배열로 합침
        let items = [...searchedCashItemDTOS, ...searchedCashFaceDTOS];

        // ✅ 아이콘이 없는 경우 기본 아이콘 설정
        items = items.map(item => {
          let icon = item.item_icon || "https://via.placeholder.com/50"; // 기본 아이콘

          if (item.item_type === "헤어") icon = hairIcon;
          if (item.item_type === "성형") icon = faceIcon;
          if (item.item_type === "피부") icon = skinIcon;

          return { ...item, item_icon: icon };
        });

        // ✅ 헤어, 성형, 피부 먼저 배치
        const priorityTypes = ["헤어", "성형", "피부"];
        const priorityItems = items.filter(item =>
          priorityTypes.includes(item.item_type)
        );
        const otherItems = items.filter(
          item => !priorityTypes.includes(item.item_type)
        );

        // ✅ 최종 배열: 헤어, 성형, 피부 -> 나머지 아이템 순서
        this.characterData.items = [...priorityItems, ...otherItems];
      } catch (error) {
        console.error("❌ 캐릭터 데이터를 불러오는 중 오류 발생:", error);
      } finally {
        this.loading = false;
      }
    },

    closeDialog() {
      this.$emit("update:modelValue", false);
    }
  }
};
</script>


<style scoped>
/* 캐릭터 이미지 스타일 */
.character-img-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.character-popup {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 캐릭터 이미지 */
.character-img {
  max-width: 160px;
  height: 160px;
  border-radius: 8px;
  margin-bottom: 15px;
}

/* 아이템 제목 */
.item-title {
  text-align: center;
  font-weight: bold;
  margin-bottom: 10px;
}

/* 개별 아이템 카드 */
.item-card {
  padding: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
  text-align: left;
  height: 80px;
}

/* 카드 내부 정렬 */
.item-content {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  justify-content: flex-start;
}

/* 아이템 아이콘 */
.item-icon {
  width: 35px;
  height: 35px;
  flex-shrink: 0;
  background-color: #f0f0f0; /* ✅ 연한 회색 배경 */
  border-radius: 8px; /* ✅ 둥근 네모 */
  padding: 5px; /* ✅ 내부 여백 */
  display: flex; /* ✅ 아이콘 가운데 정렬 */
  justify-content: center;
  align-items: center;
}

/* 아이템 정보 */
.item-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* 아이템 이름 */
.item-name {
  font-size: 11px;
  font-weight: bold;
  white-space: nowrap;

  text-overflow: ellipsis;
  max-width: 120px;
}

/* 아이템 타입 */
.item-type {
  font-size: 0.75rem;
  color: gray;
  white-space: nowrap;
}

/* 색상 정보 */
.color-info {
  font-size: 0.7rem;
  color: #4c4c4c;
  margin-top: 2px;
  white-space: nowrap;
}

/* 믹스 컬러 정보 */
.mix-color-info {
  font-size: 0.7rem;
  color: #4c4c4c;
  margin-top: 2px;
  white-space: nowrap;
}
/*계열,색*/
.color-label {
  font-weight: bold;
}

/* 닫기 버튼 */
.close-button {
  display: flex;
  justify-content: flex-end;
  padding: 10px;
}

</style>
