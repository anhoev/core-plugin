<template>
  <g-col :class="flex" class="px-2">
    <g-row>
      <g-col xs="12" sm="12" class="py-0">
        <g-text-field class="custom-text-field"
                      :label="field.label || field.key"
                      placeholder="Upload image"
                      @click.stop="selectFile"
                      v-model="imageName"
                      prepend-icon="image"
                      read-only>
          <template #append-inner>
            <g-icon @click="clearFile">clear</g-icon>
          </template>
        </g-text-field>
      </g-col>
      <g-col class="pa-0" xs="6" align-self-start v-if="imageUrl">
        <img :src="imageUrl" ref="image" alt="" style="height: 87px;"/>
      </g-col>
      <g-col class="pa-0" xs="6" v-if="imageUrl">
        <g-row class="flex-column fill-height" justify-content="space-between" align-items="end">
          <g-col class="flex-shrink-1 pa-0" style="margin-right: 15px; display: flex; justify-content: flex-end">
            <g-btn flat icon text-color="grey" @click="openDialog">
              <g-icon>edit</g-icon>
            </g-btn>
          </g-col>
          <g-col class="flex-shrink-1 pa-0" style="margin-right: 15px; margin-bottom: 4px;">
            <g-subheader class="grey--text pa-0">
              Resolution: {{ imageWidth }} x {{ imageHeight }} ({{ imageSize }})
            </g-subheader>
          </g-col>
        </g-row>
      </g-col>

      <input
          type="file"
          v-show="false"
          ref="uploadButton"
          accept="image/*"
          @change="onFileSelected($event);onChange($event)"/>
    </g-row>
    <g-dialog v-model="showDialog" v-if="imageUrl" max-width="600" persistent lazy>
      <g-card>
        <g-card-title
            class="headline"
            style="display: block;">
          Image size: {{ dialogImageSize }}<br/>
          <span class="grey--text text--lighten-1" style="font-size: 13px;">
            Original image resolution: {{ originalImageWidth }} x {{ originalImageHeight }}
          </span>
        </g-card-title>
        <g-card-text>
          <g-row>
            <g-col xs="5">
              <g-text-field
                  label="Width"
                  v-model="dialogImageWidth"
                  type="number"
                  class="mt-0"/>
            </g-col>
            <g-spacer/>
            <g-col xs="5">
              <g-text-field
                  label="Height"
                  v-model="dialogImageHeight"
                  type="number"
                  class="mt-0"/>
            </g-col>
            <g-col xs="10">
              <g-slider
                  v-model="compressionSliderModel"
                  label="Quality"
                  thumb-label
                  min="1" max="100" step="1"/>
            </g-col>
            <g-spacer/>
            <g-col class="flex-shrink-1" style="width: 60px;">
              <g-text-field
                  v-model="compressionSliderModel"
                  hide-details
                  single-line
                  type="number"
                  class="mt-0"/>
            </g-col>
            <g-col xs="12">
              <g-img :src="dialogImageUrl" :width="dialogImageWidth" :height="imageHeight" max-width="568"/>
            </g-col>
          </g-row>
        </g-card-text>
        <g-card-actions>
          <g-row align-items="center" justify-content="end">
            <g-spacer/>
            <g-btn flat text-color="blue darken-1" @click="showDialog = false">Cancel</g-btn>
            <g-btn flat text-color="success" @click="save">Save</g-btn>
          </g-row>
        </g-card-actions>
      </g-card>
    </g-dialog>
  </g-col>
</template>

<script>
  //import GSubheader from "../../gform/pos-vue-framework/src/components/GSubheader/GSubheader";
  function formatBytes(bytes, decimals) {
    if (0 === bytes) {
      return '0 Bytes';
    }
    const k = 1024;
    let _decimals = decimals || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    let fn = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, fn)).toFixed(_decimals)) + ' ' + sizes[fn];
  }

  export default {
    name: 'InlineImage',
    //components: {GSubheader},
    props: ['model', 'field', 'noFlex'],
    data() {
      return {
        imageName: '',
        imageWidth: 0,
        imageHeight: 0,
        showDialog: false,
        compressionSliderModel: 100,
        dialogImageWidth: 0,
        dialogImageUrl: '',
        originalImageUrl: '',
        originalImageWidth: 0,
        originalImageHeight: 0,
        imageAspectRatio: 0
      };
    },
    inject: {
      rootModel: {default: null},
      path: {default: null},
      noLayout: {default: null}
    },
    mounted() {
      this.originalImageUrl = this.model[this.field.key];
      setTimeout(() => {
        if (this.$refs.image && this.model[this.field.key]) {
          this.originalImageWidth = this.$refs.image.naturalWidth;
          this.originalImageHeight = this.$refs.image.naturalHeight;
          this.imageWidth = this.$refs.image.naturalWidth;
          this.imageHeight = this.$refs.image.naturalHeight;
          this.dialogImageWidth = this.$refs.image.naturalWidth;
          this.imageAspectRatio = this.imageWidth / this.imageHeight;
        }
      }, 100);
    },
    computed: {
      flex() {
        return this.noLayout ? 'xs-12' : this.field.flex;
      },
      imageSize() {
        if (this.imageUrl) {
          return formatBytes(this.imageUrl.length);
        }
      },
      dialogImageSize() {
        if (this.dialogImageUrl) {
          return formatBytes(this.dialogImageUrl.length);
        }
        return 0;
      },
      dialogImageHeight: {
        get() {
          return Math.floor(this.dialogImageWidth / this.imageAspectRatio);
        },
        set(value) {
          this.dialogImageWidth = Math.floor(value * this.imageAspectRatio);
        }
      },
      imageUrl: {
        get() {
          return this.model[this.field.key];
        },
        set(value) {
          this.model[this.field.key] = value
        }
      }
    },
    methods: {
      selectFile() {
        this.$refs.uploadButton.click();
      },
      onFileSelected(e) {
        const files = e.target.files;
        const file = files[0];
        if (file !== undefined) {
          if (file.name === this.imageName) {
            return;
          }
          this.imageName = file.name;
          if (this.imageName.lastIndexOf('.') <= 0) {
            return;
          }
          const fileReader = new FileReader();
          fileReader.readAsDataURL(file);
          fileReader.onload = e => {
            this.imageUrl = e.target.result;
            this.originalImageUrl = e.target.result;
            this.dialogImageUrl = this.imageUrl;
            let image = new Image();
            image.src = this.imageUrl;
            image.onload = () => {
              this.originalImageWidth = image.naturalWidth;
              this.originalImageHeight = image.naturalHeight;
              this.imageWidth = image.naturalWidth;
              this.imageHeight = image.naturalHeight;
              this.imageAspectRatio = this.originalImageWidth / this.originalImageHeight;
              this.compressionSliderModel = 100;
            };
          };
        }
      },
      clearFile() {
        this.imageName = '';
        this.imageUrl = '';
        this.imageWidth = 0;
        this.imageHeight = 0;
        this.compressionSliderModel = 100;
      },
      initDialog() {
        if (this.imageUrl === this.originalImageUrl) {
          this.dialogImageUrl = this.originalImageUrl;
          this.dialogImageWidth = this.imageWidth;
        } else {
          this.dialogImageWidth = this.imageWidth;
        }
      },
      save() {
        this.imageUrl = this.dialogImageUrl;
        this.imageWidth = this.dialogImageWidth;
        this.imageHeight = this.dialogImageHeight;
        this.showDialog = false;
      },
      getPreviewImageUrl() {
        let canvas = document.createElement('canvas');
        canvas.width = this.dialogImageWidth;
        canvas.height = this.dialogImageHeight;
        const image = new Image();
        image.src = this.originalImageUrl;
        image.onload = () => {
          let context = canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
          let quality = this.compressionSliderModel / 100;
          this.dialogImageUrl = canvas.toDataURL('image/jpeg', quality);
        };
      },
      openDialog() {
        this.initDialog();
        this.showDialog = true;
      },
      onChange(e) {
        if (this.field.onChange) {
          this.field.onChange(e.target.files[0].name, this.rootModel, this.model);
        }
      }
    },
    watch: {
      dialogImageWidth: _.debounce(function () {
        this.getPreviewImageUrl();
      }, 500),
      compressionSliderModel: _.debounce(function () {
        this.getPreviewImageUrl();
      }, 500)
    }
  };
</script>

<style scoped lang="scss">
  .middle {
    padding-top: 5px !important;
  }

  .grey--text {
    color: #bdbdbd;
  }
</style>
