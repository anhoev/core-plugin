<template>
  <v-flex :class="flex" class="px-2">
    <v-layout row wrap>
      <v-flex xs12 sm12>
        <v-text-field
            :label="field.label || field.key"
            @click.stop="selectFile"
            v-model="imageName"
            prepend-icon="image"
            readonly
        >
          <v-icon slot="append" @click="clearFile">clear</v-icon>
        </v-text-field>
      </v-flex>
      <v-flex xs6 align-self-start v-if="imageUrl">
        <v-img :src="imageUrl" contain ref="image"></v-img>
      </v-flex>
      <v-flex xs6 d-block style="text-align: right;" v-if="imageUrl">
        <v-btn flat icon
               @click="openDialog"
        >
          <v-icon>edit</v-icon>
        </v-btn>
        <div> Resolution: {{ imageWidth }} x {{ imageHeight }}</div>
      </v-flex>
      <input
          type="file"
          v-show="false"
          ref="uploadButton"
          accept="image/*"
          @change="onFileSelected"
      />
    </v-layout>
    <v-dialog v-model="showDialog" v-if="imageUrl" max-width="600" lazy>
      <v-card>
        <v-card-title
            class="headline"
            primary-title
        >
          Image size: {{ imageSize }}
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
          <v-btn flat @click="showDialog = false">Cancel</v-btn>
          <v-btn flat @click="save">Save</v-btn>
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
        resolutionSliderModel: 0,
        compressionSliderModel: 0,
        dialogImageWidth: 0,
        dialogImageUrl: ''
      };
    },
    inject: {
      rootModel: { default: null },
      path: { default: null },
      noLayout: { default: null }
    },
    mounted() {
      setTimeout(()=> {
        if (this.$refs.image && this.model[this.field.key]) {
          this.imageWidth = this.$refs.image.image.naturalWidth;
          this.imageHeight = this.$refs.image.image.naturalHeight;
        }
      }, 100);
    },
    computed: {
      flex() {
        return this.noLayout ? 'xs-12' : this.field.flex;
      },
      imageSize() {
        if (this.dialogImageUrl) {
          return formatBytes(this.dialogImageUrl.length);
        }
        return 0;
      },
      dialogImageHeight: {
        get() {
          const ratio = this.imageWidth / this.imageHeight;
          return Math.floor(this.dialogImageWidth / ratio);
        },
        set(value) {
          const ratio = this.imageWidth / this.imageHeight;
          this.dialogImageWidth = Math.floor(value * ratio);
          return value;
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
            this.dialogImageUrl = this.imageUrl;
            let image = new Image();
            image.src = this.imageUrl;
            image.onload = e => {
              this.imageWidth = image.naturalWidth;
              this.imageHeight = image.naturalHeight;
              this.dialogImageWidth = this.imageWidth;
            };
          };
        }
      },
      clearFile() {
        this.imageName = '';
        this.imageUrl = '';
        this.imageWidth = 0;
        this.imageHeight = 0;
      },
      initDialog() {
        this.resolutionSliderModel = 100;
        this.compressionSliderModel = 100;
        this.dialogImageUrl = this.imageUrl;
        this.dialogImageWidth = this.imageWidth;
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
        image.src = this.imageUrl;
        let context = canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
        let quality = this.compressionSliderModel / 100;
        this.dialogImageUrl = canvas.toDataURL('image/jpeg', quality);
      },
      openDialog() {
        this.initDialog();
        this.showDialog = true;
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
