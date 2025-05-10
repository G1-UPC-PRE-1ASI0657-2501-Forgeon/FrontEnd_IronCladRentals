<template>
  <div class="full-screen">
    <pv-galleria
        :value="currentImage"
        :responsiveOptions="responsiveOptions"
        :numVisible="5"
        :circular="true"
        style="width: 100%; height: 100%;"
        :showItemNavigators="false"  <!-- Aquí se cambia a false para ocultar las flechas -->
    :showThumbnails="false"
    :showItemNavigatorsOnHover="true"
    :showIndicators="true"
    @onBeforeShow="handleBeforeShow"
    >
    <template #item="slotProps">
      <img
          :src="slotProps.item.itemImageSrc"
          :alt="slotProps.item.alt"
          style="width: 100%; height: 100%; object-fit: cover;"
      />
    </template>

    <template #indicators="{ activeIndex, onClick }">
      <div class="custom-indicators">
          <span
              v-for="(item, index) in images"
              :key="index"
              class="indicator"
              :class="{ active: index === activeIndex }"
              @click="onClick(index)"
          ></span>
      </div>
    </template>
    </pv-galleria>
  </div>
</template>

<script>
import image2 from '@/assets/images/carousel/image2.jpg';
import image3 from '@/assets/images/carousel/image3.jpg';
import image4 from '@/assets/images/carousel/image4.jpg';
import image5 from '@/assets/images/carousel/image5.jpg';
import image6 from '@/assets/images/carousel/image6.jpg';
import image8 from '@/assets/images/carousel/image8.jpg';
import image9 from '@/assets/images/carousel/image9.jpg';
import image10 from '@/assets/images/carousel/image10.jpg';

export default {
  name: 'TheHomeCarousel',
  data() {
    return {
      images: [
        { itemImageSrc: image3, thumbnailImageSrc: 'image of farm.jpg', alt: 'Image 1' },
        { itemImageSrc: image2, thumbnailImageSrc: 'image of farm.jpg', alt: 'Image 2' },
        { itemImageSrc: image3, thumbnailImageSrc: 'image of farm.jpg', alt: 'Image 3' },
        { itemImageSrc: image4, thumbnailImageSrc: 'image of farm.jpg', alt: 'Image 4' },
        { itemImageSrc: image5, thumbnailImageSrc: 'image of farm.jpg', alt: 'Image 5' },
        { itemImageSrc: image6, thumbnailImageSrc: 'image of farm.jpg', alt: 'Image 6' },
        {itemImageSrc: image3, thumbnailImageSrc: 'image of farm.jpg', alt: 'Image 7'},
        {itemImageSrc: image8, thumbnailImageSrc: 'image of farm.jpg', alt: 'Image 8'},
        {itemImageSrc: image9, thumbnailImageSrc: 'image of farm.jpg', alt: 'Image 9'},
        {itemImageSrc: image10, thumbnailImageSrc: 'image of farm.jpg', alt: 'Image 10'},
      ],
      responsiveOptions: [],
      currentIndex: 0,
      intervalId: null,
    };
  },
  computed: {
    currentImage() {
      return [this.images[this.currentIndex]];
    },
  },
  mounted() {
    this.intervalId = setInterval(this.nextImage, 5000);
  },
  beforeUnmount() {
    clearInterval(this.intervalId);
  },
  methods: {
    handleBeforeShow() {
    },
    nextImage() {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
    },
    onClick(index) {
      this.currentIndex = index;
      clearInterval(this.intervalId);
      this.intervalId = setInterval(this.nextImage, 5000);
    },
  },
};
</script>

<style scoped>
.full-screen {
  position: relative;
  width: 100%;
  height: calc(100vh - 100px);
}

.custom-indicators {
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
}

.indicator {
  width: 10px;
  height: 10px;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 50%;
  margin: 0 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.indicator.active {
  background-color: #ffffff;
}
</style>
