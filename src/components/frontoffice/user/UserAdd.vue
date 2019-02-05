<template>
  <v-expansion-panel id="add_patient_to_box" inset dark>
    <v-expansion-panel-content hide-actions>
      <div slot="header">
        <v-btn color="primary" dark>
          <v-icon class="pr-2">fas fa-plus</v-icon>
          <label>{{$t('frontoffice.user.new_user')}}</label>
        </v-btn>
      </div>

      <v-form>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs12 md8>
              <v-text-field
                :rules="[() => ((form.email.length>5 && form.email.indexOf('@') > -1) || form.email.length==0) || 'Invalid email']"
                label="Email"
                v-model="form.email"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 md4 class="text-xs-right">
              <v-select
                :items="[$t('frontoffice.user.informal_caregiver'),$t('frontoffice.user.formal_caregiver'),$t('frontoffice.user.additional_sponsor')]"
                :label="$t('frontoffice.user.role')"
                v-model="role"
                append-icon="fas fa-angle-down"
              ></v-select>
            </v-flex>
            <v-flex sx12>
              <v-btn dark color="ash" block @click.native="save">{{ $t('frontoffice.user.save') }}</v-btn>
            </v-flex>
          </v-layout>
        </v-container>
      </v-form>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import { event_bus } from "@/plugins/bus.js";

export default {
  name: "add_patient_to_box",
  props: {
    box: Object
  },
  data: () => {
    return {
      form: {
        email: "",
        sponsor: false,
        name: "",
        since: null,
        id: ""
      },
      role: "Informal caregiver"
    };
  },
  watch: {
    role(val) {
      this.form.sponsor =
        val === "Additional sponsor" || val === "Responsável Adicional";
    }
  },
  methods: {
    save() {
      if (this.form.email.length > 1) {
        event_bus.$emit("waiting", true);
        event_bus.$data.http
          .post("/vitabox/" + this.box.id + "/user", this.form)
          .then(response => {
            this.form.since = new Date();
            this.form.name = response.data.name;
            this.form.id = response.data.id;
            this.$emit("adduser", this.form);
            event_bus.$emit("toast", {
              message: "user was successfully registered to vitabox",
              type: "success"
            });
            this.form = {
              email: "",
              sponsor: false,
              name: "",
              since: null,
              id: ""
            };
            event_bus.$emit("waiting", false);
          })
          .catch(error => {
            if (error.response) {
              event_bus.$emit("toast", {
                message: error.response.data,
                type: "error"
              });
            } else {
              event_bus.$emit("toast", {
                message: error.message,
                type: "error"
              });
            }
            event_bus.$emit("waiting", false);
          });
      } else {
        event_bus.$emit("toast", {
          message: "insert all fields please",
          type: "error"
        });
      }
    }
  }
};
</script>