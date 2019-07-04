<template>
  <v-content id="auth">
    <v-container fill-height>
      <v-layout justify-center wrap align-center class="pb-5 mb-5">
        <v-flex id="auth_card">
          <v-card id="register">
            <v-card-title id="register_title">
              <p class="title mb-0">{{ $t('user.auth.register') }}</p>
            </v-card-title>
            <v-card-text id="register_box">
              <v-layout row wrap>
                <v-flex md6>
                  <v-text-field
                    id="name"
                    v-model="name"
                    prepend-icon="fas fa-user"
                    :label="$t('user.auth.first_name')"
                    type="text"
                    required
                  ></v-text-field>
                </v-flex>
                <v-flex md6>
                  <v-text-field
                    class="pl-1"
                    id="surname"
                    v-model="surname"
                    :label="$t('user.auth.last_name')"
                    type="text"
                    required
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                    id="email"
                    v-model="email"
                    prepend-icon="fas fa-envelope"
                    :label="$t('user.auth.email')"
                    type="text"
                    required
                  ></v-text-field>
                </v-flex>
                <v-flex md6>
                  <v-text-field
                    id="password"
                    v-model="password"
                    prepend-icon="fas fa-lock"
                    :label="$t('user.auth.pass')"
                    type="password"
                    required
                  ></v-text-field>
                </v-flex>
                <v-flex md6>
                  <v-text-field
                    class="pl-1"
                    id="reppassword"
                    v-model="reppassword"
                    :label="$t('user.auth.repeat_pass')"
                    type="password"
                    required
                  ></v-text-field>
                </v-flex>
              </v-layout>
            </v-card-text>
            <v-card-actions>
              <v-btn flat class="primary--text" to="/signin">{{ $t('user.auth.login') }}</v-btn>
              <v-spacer></v-spacer>
              <v-btn class="raven primary--text" @click="register_dialog=true">
                {{ $t('user.auth.register') }}
                <v-icon dark right>fas fa-user-plus</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>

    <v-dialog v-model="register_dialog" width="600">
      <v-card>
        <v-card-title
          class="headline grey lighten-2"
          primary-title
        >{{ $t('user.auth.privacy_title') }}</v-card-title>
        <v-card-text>
          <div class="px-2" id="privacy_policy">By using our products, YOU:
            <ul>
              <li>represent and warrant being a Consumer;</li>
              <li>accept to be bound by these Terms of Service;</li>
              <li>acknowledge having been informed by Vitasenior-MT of all rights granted to YOU.</li>
            </ul>
            <br>It is important for YOU to read this document, as it is legally binding between YOU and Vitasenior-MT regarding your purchase and use of the Products.
            <br>
            <br>
            <h3>Personal Data Collection</h3>
            <br>Vitasenior-MT hereby informs its Patients and websites Users, (collectively, “Users”), that any personal data supplied shall be recorded to automated files, for which Vitasenior-MT is the Controller and is located at Polytechnic Institute of Tomar´s address at Quinta do Contador, Estrada da Serra, 2300-313 Tomar, Portugal.
            <br>
            <br>The Processors are the following: a) IBM, located at England, for storing all data and executing the web services; b) Microsoft, for the purpose of email confirmation a password recovery. All personal data are encrypted before being stored at the databases.
            <br>
            <br>
            <b>Data Responsability</b>
            <br>By filling any form in Vitasenior-MT's website ou Using the equipment throught the Vitabox, Users consent to the processing of their personal data. When You upload, submit, store, send or receive Content to or through our Cloud Site, You give to Vitasenior-MT a worldwide license to use, host, store, reproduce, modify, create derivative works (i.e., so that Your Content works better with our Data Services), communicate, publish, publicly perform, publicly display and distribute such Content in a nonpersonally identifiable manner. To protect Your Content, keep your password to the Cloud Site confidential. Every Vitabox the YOU register in the Cloud Site makes You responsible for all the Content that may be collected throught it.
            <br>
            <br>
            <b>Access</b>
            <br>Our Data Services allow You to share the Vitabox Content, which remains Your property and You are solely responsible for it.
            <br>
            <br>
            <b>Data Services</b>
            <br>Any Content shall be sent encrypted to the Cloud Site. To these effects Vitasenior-MT warrants that any Content sent by using a Vitabox shall be encrypted.
            <br>
            <br>
            <b>Rectification and Erasure</b>
            <br>YOU have the right to rectify and erase all the data of the Vitabox to which YOU are responsible.
            <br>
            <br>
            <v-divider></v-divider>
            <v-checkbox v-model="policy_accept" :label="$t('user.auth.accept')"></v-checkbox>
          </div>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" flat @click="register_dialog = false">{{ $t('user.auth.close') }}</v-btn>
          <v-btn
            color="primary"
            :disabled="!policy_accept"
            flat
            @click="registerUser"
          >{{ $t('user.auth.submit') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="confirm_email_dialog" width="500">
      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>
          <span>Validate email</span>
          <v-spacer></v-spacer>
          <v-btn icon flat class="my-0" @click="confirm_email_dialog=false">
            <v-icon color="error">fas fa-times</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>A email was sent in order to validate it. Only then you may use the system.</v-card-text>
      </v-card>
    </v-dialog>
  </v-content>
</template>

<script>
import { event_bus } from "@/plugins/bus.js";
export default {
  data() {
    return {
      name: "",
      surname: "",
      email: "",
      password: "",
      reppassword: "",
      register_dialog: false,
      confirm_email_dialog: false,
      policy_accept: false
    };
  },
  mounted() {
    this.$el.addEventListener("keypress", event => {
      if (event.key == "Enter") this.registerUser();
    });
  },
  beforeDestroy() {
    this.$el.removeEventListener("keypress", event => {
      if (event.key == "Enter") this.registerUser();
    });
  },
  methods: {
    registerUser() {
      event_bus.$emit("waiting", true);
      this.register_dialog = false;
      if (this.password === this.reppassword) {
        event_bus.$data.http
          .post("/register", {
            password: this.password,
            name: this.name + " " + this.surname,
            email: this.email
          })
          .then(response => {
            this.confirm_email_dialog = true;
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
          message: "the password doesn't match",
          type: "error"
        });
      }
    }
  }
};
</script>

<style>
#register {
  padding-bottom: 5px;
}
#register_title {
  box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 1px 5px 0 rgba(0, 0, 0, 0.12);
  height: 72px;
}
#register_box {
  height: 251px;
}
#auth {
  background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
    url("../../../assets/fotoLar.jpg");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  height: 100%;
}
/* @media only screen and (orientation: portrait) {
  #auth {
    background-image: url("../../../assets/2.jpg");
    background-repeat: no-repeat;
    background-size: cover;
    height: 100%;
  }
}
@media only screen and (orientation: landscape) {
  #auth {
    background-image: url("../../../assets/fotoLar.jpg");
    background-repeat: no-repeat;
    background-size: cover;
    height: 100%;
  }
} */
#auth_card {
  max-width: 400px;
}

#privacy_policy {
  max-height: 500px;
  overflow-y: scroll;
}
</style>