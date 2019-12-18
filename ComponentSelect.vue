<template>
  <g-row :class="flex" class="px-2">
    <g-combobox v-model="value" :items="options" :label="field.label || field.key" clearable
                @change="onChange" class="flex-grow-1"
                :menu-props="{'z-index': 1000, 'closeOnContentClick': true}">
      <template #append-outer>
        <g-icon color="blue darken-1" @click.stop="toggleEditor">edit</g-icon>
      </template>
    </g-combobox>
    <g-dialog class="flex-grow-1" v-model="showEditorDialog" max-width="80%" lazy>
      <g-card class="flex-grow-1" style="height: 80vh">
        <g-card-text style="height: calc(100% - 55px)">
          <monaco-editor :value.sync="code" :language="currentLanguage" :label="model ? model.component : ''"/>
        </g-card-text>
        <g-card-actions>
          <g-spacer/>
          <g-btn color="blue darken-1" flat @click.stop="toggleEditor">Close</g-btn>
          <g-btn color="blue darken-1" flat @click.stop="save">Save</g-btn>
        </g-card-actions>
      </g-card>
    </g-dialog>
  </g-row>
</template>

<script>
  import cms from 'cms';
  import SnackBarController from 'SnackBarController'; //from 'backoffice';

  const vueLanguage = 'vue';
  export default {
    props: ['model', 'field', 'noFlex'],
    created() {
    },
    data() {
      return {
        items: null,
        loading: false,
        code: '',
        currentLanguage: vueLanguage,
        showEditorDialog: false,
        snackbarMsg: '',
      };
    },
    inject: {
      rootModel: {default: null},
      path: {default: null},
      noLayout: {default: null}
    },
    computed: {
      flex() {
        return this.noLayout ? 'col-xs-12' : this.field.flex;
      },
      options() {
        const list = cms.pluginComponents.map(c => c.name);
        return list.map(item => ({text: item, value: item}));
      },
      value: {
        get() {
          return {text: this.model[this.field.key] || ''};
        },
        set(v) {
          this.model[this.field.key] = v ? v.text : null;
        }
      }
    },
    mounted() {
      this.value = {text: this.model[this.field.key]};
      if (this.model) {
        this.loadPlugin()
            .then((items) => {
              const plugin = this.getPlugin(items);
              if (!plugin) return;
              Object.assign(this.model, {
                url: plugin.url,
                path: plugin.path,
                pluginName: plugin.pluginName
              });
            }).finally(() => {
          this.getFileContent().then();
        });
      }
    },
    methods: {
      onChange(e) {
        if (this.field.onChange) this.field.onChange(e.value, this.rootModel, this.model);
      },
      getPlugin(items) {
        for (let i = 0; i < items.length; i++) {
          if (items[i].name !== 'dist') {
            if (items[i].name === this.model.component + '.vue') {
              return items[i];
            }
            if (items[i].children) {
              const result = (this.getPlugin(items[i].children));
              if (result) {
                return result;
              }
            }
          }
        }
      },
      loadPlugin() {
        return new Promise((resolve, reject) => {
          cms.socket.emit('loadPlugin', (tree) => {
            this.items = tree;
            resolve(tree);
          });
        });
      },
      getFileContent() {
        return new Promise(res => {
          this.loading = true;
          console.log(cms.baseUrl);
          if (!this.model || !this.model.url) return;
          fetch(cms.baseUrl + this.model.url)
              .then(res => res.text())
              .then(json => {
                this.$nextTick(() => {
                  this.code = json;
                  res(json);
                });
                this.loading = false;
              })
              .catch(() => {
                this.loading = false;
              });
        });
      },
      toggleEditor() {
        this.showEditorDialog = !this.showEditorDialog;
      },
      save() {
        cms.socket.emit('savePlugin', this.model.pluginName, this.model.path, this.code, (err) => {
          if (err) SnackBarController.show(err.message)
          SnackBarController.show('Saved successfully')
        });
        this.loadPlugin().then(() => {
          this.showEditorDialog = false;
        });
      }
    }
  };
</script>

<style>
</style>
