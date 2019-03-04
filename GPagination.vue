<template>
  <div class="v-datatable__actions">
    <div class="v-datatable__actions__select">Rows per page:
      <v-select hide-details
                :menu-props="{auto: true, minWidth: '75px'}"
                :items="computedRowsPerPageItems"
                :value="limit"
                @input="$emit('update:limit', $event);changeLimitRow();"
      />
    </div>
    <div class="v-datatable__actions__range-controls">
      <div class="v-datatable__actions__pagination">{{documentFrom}}-{{documentTo}} of {{totalDocument}}</div>
      <v-btn icon flat :disabled="disablePre" @click="prevPage">
        <v-icon>chevron_left</v-icon>
      </v-btn>
      <v-btn icon flat :disabled="disableNext" @click="nextPage">
        <v-icon>chevron_right</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'GPagination',
    props: {
      limit: Number,
      totalDocument: Number,
      currentPage: Number
    },
    data: () => ({
      computedRowsPerPageItems: [10, 15, 20, 25, 50]
    }),
    methods: {
      nextPage() {
        let page = this.currentPage + 1;
        this.$emit('update:currentPage', page);
        this.$emit('execQueryByPage');
      },
      prevPage() {
        let page = this.currentPage - 1;
        this.$emit('update:currentPage', page);
        this.$emit('execQueryByPage');
      },
      changeLimitRow() {
        this.$emit('execQueryByPage');
      }
    },
    computed: {
      documentFrom() {
        return (this.currentPage - 1) * this.limit + 1;
      },
      documentTo() {
        let toDocument = (this.currentPage * this.limit);
        if (toDocument > this.totalDocument) {
          return this.totalDocument;
        }
        return toDocument;
      },
      disablePre() {
        return (this.limit * (this.currentPage - 1)) == 0;
      },
      disableNext() {
        return (this.limit * this.currentPage) >= this.totalDocument;
      }
    }
  };
</script>

<style scoped>

</style>
