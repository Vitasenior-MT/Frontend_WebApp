<template>
    <div class="text-md-center">
        <h2>Sign Up</h2>
        <v-layout>
            <v-flex xs6 offset-xs3>
                <v-card>
                    <v-card-text>
                        <v-text-field v-model="register.username" label="Username" required></v-text-field>
                        <v-text-field v-model="register.email" label="Email" required></v-text-field>
                        <v-text-field v-model="register.password" label="Password" required></v-text-field>
                    </v-card-text>
                </v-card>
                 <v-btn class="mb-3" success @click='registerIt'>Register</v-btn>
            </v-flex>
        </v-layout>
    </div>
</template>

<script>
import { event_bus } from "@/plugins/bus.js";
    export default {
        data() {
            return {
                register:{
                    username: "",
                    email: "",
                    password: ""
                }
            }
        },
        mounted() {
            axios.post('/register');
        }
    }
</script>