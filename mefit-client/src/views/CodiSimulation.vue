<template>
  <div class="customization">
    <div class="preview">
      <!-- 이미지 미리보기 -->
      <img :src="generatedUrl" alt="캐릭터 이미지" />
    </div>

    <div class="controls">
      <h3>색 계열 선택</h3>
      <select v-model="selectedColorGroup" @change="onColorGroupChange">
        <option v-for="group in colorGroups" :key="group.name" :value="group">
          {{ group.name }}
        </option>
      </select>

      <h3>모자 색상 조절</h3>
      <div class="adjustment">
        <label>색조</label>
        <input
          type="range"
          :min="selectedColorGroup.range[0]"
          :max="selectedColorGroup.range[1]"
          v-model="hue"
          @input="onUserAdjustment"
        />
        <span>{{ hue }}</span>
      </div>
      <div class="adjustment">
        <label>채도</label>
        <input
          type="range"
          min="-99"
          max="99" 
          v-model="saturation"
          @input="onUserAdjustment"
        />
        <span>{{ saturation }}</span>
      </div>
      <div class="adjustment">
        <label>명도</label>
        <input
          type="range"
          min="-99"
          max="99"
          v-model="brightness"
          @input="onUserAdjustment"
        />
        <span>{{ brightness }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [
        { itemId: 2000, version: "253" },
        { itemId: 12016, version: "253" },
        { itemId: 50312, version: "253" },
        { itemId: 1032074, version: "253" },
        { itemId: 64440, version: "253" },
        { itemId: 1070123, version: "253" },
        { itemId: 1050484, version: "253" },
        { itemId: 1702223, version: "253" },
        { itemId: 1005145, version: "253" }, // 모자
      ],
      hue: 0, // 초기 색조 값
      saturation: 0, // 초기 채도 값
      brightness: 0, // 초기 명도 값
      baseUrl: "https://maplestory.io/api/character",
      generatedUrl: "", // 생성된 URL
      isColorAdjusted: false, // 색상이 변경되었는지 확인
      colorGroups: [
        { name: "전체", range: [0, 359] },
        { name: "빨강", range: [0, 30] },
        { name: "노랑", range: [30, 90] },
        { name: "초록", range: [90, 150] },
        { name: "청록", range: [150, 210] },
        { name: "파랑", range: [210, 270] },
        { name: "자주", range: [270, 330] },
      ],
      selectedColorGroup: { name: "전체", range: [0, 359] }, // 초기 색 계열
    };
  },
  methods: {
    updateUrl() {
      // 아이템 리스트에서 모자에만 색상 값 추가
      const queryItems = this.items.map((item) => {
        const { itemId, version } = item;
        let query = `%7B%22itemId%22%3A${itemId}%2C%22version%22%3A%22${version}%22`;
        if (itemId === 1005145 && this.isColorAdjusted) {
          // 사용자가 조정한 경우에만 색상 추가
          query += `%2C%22hue%22%3A${this.hue}%2C%22saturation%22%3A${this.saturation}%2C%22brightness%22%3A${this.brightness}`;
        }
        query += `%7D`;
        return query;
      }).join("%2C");

      // URL 업데이트
      this.generatedUrl = `${this.baseUrl}/${queryItems}/stand1/0?showears=false&showLefEars=false&resize=1&bgColor=0,0,0,0`;
    },
    onColorGroupChange() {
      // 색 계열 변경 시 색조 범위 조정
      const [minHue, maxHue] = this.selectedColorGroup.range;
      this.hue = Math.max(minHue, Math.min(this.hue, maxHue));
      this.updateUrl();
    },
    onUserAdjustment() {
      // 사용자가 색상 조절 시 isColorAdjusted 활성화
      this.isColorAdjusted = true;
      this.updateUrl();
    },
  },
  mounted() {
    // 초기 URL 생성
    this.updateUrl();
  },
};
</script>

<style>
.customization {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.preview img {
  width: 300px;
  height: auto;
  border: 1px solid #ccc;
  margin-bottom: 20px;
}

.controls {
  display: flex;
  flex-direction: column;
}

.adjustment {
  margin-bottom: 10px;
}
</style>
