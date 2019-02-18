<template>
  <v-card>
    <v-card-title>
      <span class="headline">{{$t('user.utils.alter_language')}}</span>
      <v-spacer></v-spacer>
      <v-btn icon @click.native="close">
        <v-icon color="error">fas fa-times</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text class="d-inline-flex">
      <div class="pt-2 pr-1">
        <v-avatar size="32">
          <img v-if="selected" :src="'/static/'+selected.flag" alt="avatar">
        </v-avatar>
      </div>

      <v-select
        append-icon="fas fa-angle-down"
        v-model="selected"
        :items="languages"
        label="Select language"
        hide-details
        item-text="text"
        item-value="tag"
        return-object
      ></v-select>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="primary_d" flat @click.native="save">{{$t('user.auth.submit')}}</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      languages: [
        {
          tag: "pt",
          text: this.$t("user.utils.portuguese"),
          flag: "flag_pt.png"
        },
        {
          tag: "en",
          text: this.$t("user.utils.english"),
          flag: "flag_uk.png"
        }
      ],
      selected: null
    };
  },
  mounted() {
    this.selected = this.languages.find(x => x.tag == this.$i18n.locale);
  },
  methods: {
    close() {
      this.$emit("close");
    },
    save() {
      this.$i18n.locale = this.selected.tag;
    }
  }
};
</script>

<style>
</style>
