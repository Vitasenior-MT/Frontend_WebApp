<template>
    <div class="text-md-center">
        <h2>Sign In</h2>
        <v-layout>
            <v-flex xs6 offset-xs3>
                <v-card>
                    <v-card-text>
                        <v-text-field v-model="register.email" label="Email" required></v-text-field>
                        <v-text-field v-model="register.password" label="Password" required></v-text-field>
                    </v-card-text>
                    <v-btn class="mb-3" success @click='logItIn'>Login</v-btn>
                </v-card>
            </v-flex>
        </v-layout>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                register:{
                    email: "",
                    password: ""
                }
            }
        }
    }
</script>