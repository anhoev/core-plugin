<template>
  <v-flex :class="flex" class="px-2">
    <v-layout row wrap>
      <v-flex xs12 sm12>
        <v-text-field
            :label="field.label || field.key"
            placeholder="Upload image"
            @click.stop="selectFile"
            v-model="imageName"
            prepend-icon="image"
            readonly
        >
          <v-icon slot="append" @click="clearFile">clear</v-icon>
        </v-text-field>
      </v-flex>
      <v-flex xs6 align-self-start v-if="imageUrl" fill-height>
        <img :src="imageUrl" ref="image" alt="" style="height: 87px;" />
      </v-flex>
      <v-flex xs6 v-if="imageUrl">
        <v-layout column justify-space-between align-end fill-height>
          <v-flex shrink>
            <v-btn flat icon color="grey"
                   @click="openDialog"
            >
              <v-icon>edit</v-icon>
            </v-btn>
          </v-flex>
          <v-flex shrink style="margin-right: 15px; margin-bottom: 4px;">
            <v-subheader class="grey--text text--lighten-1 pa-0">
              Resolution: {{ imageWidth }} x {{ imageHeight }} ({{ imageSize }})
            </v-subheader>
          </v-flex>
        </v-layout>
      </v-flex>

      <input
          type="file"
          v-show="false"
          ref="uploadButton"
          accept="image/*"
          @change="onFileSelected($event);onChange($event)"
      />
    </v-layout>
    <v-dialog v-model="showDialog" v-if="imageUrl" max-width="600" persistent lazy>
      <v-card>
        <v-card-title
            class="headline"
            primary-title
            style="display: block;"
        >
          Image size: {{ dialogImageSize }}<br />
          <span class="grey--text text--lighten-1" style="font-size: 13px;">
            Original image resolution: {{ originalImageWidth }} x {{ originalImageHeight }}
          </span>
        </v-card-title>
        <v-card-text>
          <v-layout row wrap>
            <v-flex xs5>
              <v-text-field
                  label="Width"
                  v-model="dialogImageWidth"
                  type="number"
                  class="mt-0"
              ></v-text-field>
            </v-flex>
            <v-spacer></v-spacer>
            <v-flex xs5>
              <v-text-field
                  label="Height"
                  v-model="dialogImageHeight"
                  type="number"
                  class="mt-0"
              ></v-text-field>
            </v-flex>
            <v-flex xs10>
              <v-slider
                  v-model="compressionSliderModel"
                  label="Quality"
                  min="1"
                  max="100"
                  step="1"
              >
              </v-slider>
            </v-flex>
            <v-spacer></v-spacer>
            <v-flex shrink style="width: 60px;">
              <v-text-field
                  v-model="compressionSliderModel"
                  hide-details
                  single-line
                  type="number"
                  class="mt-0"
              ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-img :src="dialogImageUrl" :width="dialogImageWidth" max-width="568"></v-img>
            </v-flex>
          </v-layout>
        </v-card-text>
        <v-card-actions>
          <v-layout align-center justify-end row fill-height>
            <v-btn flat color="blue darken-1" @click="showDialog = false">Cancel</v-btn>
            <v-btn flat color="success" @click="save">Save</v-btn>
          </v-layout>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-flex>
</template>

<script>
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
      rootModel: { default: null },
      path: { default: null },
      noLayout: { default: null }
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
        if (this.imageUrl)  {
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
          this.$set(this.model, this.field.key, value);
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
        }
      },
      openDialog() {
        this.initDialog();
        this.showDialog = true;
      },
      onChange(e) {
        if (this.field.onChange) this.field.onChange(e.target.files[0].name, this.rootModel, this.model);
      }
    },
    watch: {
      dialogImageWidth: _.debounce(function() {
        this.getPreviewImageUrl();
      }, 500),
      compressionSliderModel: _.debounce(function() {
        this.getPreviewImageUrl();
      }, 500)
    }
  };
</script>

<style scoped>
  .middle {
    padding-top: 5px !important;
  }
</style>
