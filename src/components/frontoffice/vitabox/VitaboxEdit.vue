<template>
  <div>
    <v-tooltip bottom>
      <v-btn slot="activator" icon @click.native="()=>dialog_vitabox_edit=true">
        <v-icon color="indigo accent-2">fas fa-cogs</v-icon>
      </v-btn>
      <span>{{ $t('frontoffice.vitabox.edit_location') }}</span>
    </v-tooltip>
    <v-dialog v-model="dialog_vitabox_edit" width="600">
      <v-card>
        <v-card-title>
          <span
            class="headline warning--text"
          >{{ $t("frontoffice.vitabox.update_vitabox_location") }}</span>
          <v-spacer></v-spacer>
          <v-btn icon @click="close">
            <v-icon color="error">fas fa-times</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-layout wrap v-if="vitabox">
            <v-flex md8>
              <v-textarea
                :rules="[() => vitabox.address.length > 1 || 'Vitabox address is required']"
                name="address"
                v-model="vitabox.address"
                :label="$t('frontoffice.vitabox.address')"
              ></v-textarea>
            </v-flex>
            <v-flex md4>
              <v-overflow-btn
                v-model="district"
                :items="districts"
                item-text="name"
                :label="$t('frontoffice.vitabox.district')"
                editable
                single-line
                append-icon="fas fa-angle-down"
              ></v-overflow-btn>
              <v-overflow-btn
                v-model="locality"
                :items="district?localities[this.districts.indexOf(district)]:[]"
                item-text="localities"
                :label="$t('frontoffice.vitabox.locality')"
                editable
                single-line
                :disabled="district?false:true"
                append-icon="fas fa-angle-down"
                class="mt-0"
              ></v-overflow-btn>
            </v-flex>
          </v-layout>
          <div id="google-map-edit"></div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            dark
            color="warning darken-1"
            block
            @click.native="save"
          >{{ $t("frontoffice.patient.submit") }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { event_bus } from "@/plugins/bus.js";

export default {
  data: () => {
    return {
      dialog_vitabox_edit: false,
      vitabox: null,
      address: "",
      map: null,
      marker: null,
      district: null,
      districtIndex: null,
      locality: null,
      districts: [
        "Aveiro",
        "Beja",
        "Braga",
        "Bragança",
        "Castelo Branco",
        "Coimbra",
        "Évora",
        "Faro",
        "Guarda",
        "Leiria",
        "Lisboa",
        "Portalegre",
        "Porto",
        "Santarém",
        "Setúbal",
        "Viana do Castelo",
        "Vila Real",
        "Viseu"
      ],
      localities: [
        [
          "Águeda",
          "Albergaria-a-Velha",
          "Anadia",
          "Arouca",
          "Aveiro",
          "Castelo de Paiva",
          "Espinho",
          "Estarreja",
          "Ílhavo",
          "Mealhada",
          "Murtosa",
          "Oliveira de Azeméis",
          "Oliveira do Bairro",
          "Ovar",
          "Santa Maria da Feira",
          "São João da Madeira",
          "Sever do Vouga",
          "Vagos",
          "Vale de Cambra"
        ],
        [
          "Aljustrel",
          "Almodôvar",
          "Alvito",
          "Barrancos",
          "Beja",
          "Castro Verde",
          "Cuba",
          "Ferreira do Alentejo",
          "Mértola",
          "Moura",
          "Odemira",
          "Ourique",
          "Serpa",
          "Vidigueira"
        ],
        [
          "Amares",
          "Barcelos",
          "Braga",
          "Cabeceiras de Basto",
          "Celorico de Basto",
          "Esposende",
          "Fafe",
          "Guimarães",
          "Póvoa de Lanhoso",
          "Terras de Bouro",
          "Vieira do Minho",
          "Vila Nova de Famalicão",
          "Vila Verde",
          "Vizela"
        ],
        [
          "Alfândega da Fé",
          "Bragança",
          "Carrazeda de Ansiães",
          "Freixo de Espada à Cinta",
          "Macedo de Cavaleiros",
          "Miranda do Douro",
          "Mirandela",
          "Mogadouro",
          "Torre de Moncorvo",
          "Vila Flor",
          "Vimioso",
          "Vinhais"
        ],
        [
          "Belmonte",
          "Castelo Branco",
          "Covilhã",
          "Fundão",
          "Idanha-a-Nova",
          "Oleiros",
          "Penamacor",
          "Proença-a-Nova",
          "Sertã",
          "Vila de Rei",
          "Vila Velha de Ródão"
        ],
        [
          "Arganil",
          "Cantanhede",
          "Coimbra",
          "Condeixa-a-Nova",
          "Figueira da Foz",
          "Góis",
          "Lousã",
          "Mira",
          "Miranda do Corvo",
          "Montemor-o-Velho",
          "Oliveira do Hospital",
          "Pampilhosa da Serra",
          "Penacova",
          "Penela",
          "Soure",
          "Tábua",
          "Vila Nova de Poiares"
        ],
        [
          "Alandroal",
          "Arraiolos",
          "Borba",
          "Estremoz",
          "Évora",
          "Montemor-o-Novo",
          "Mora",
          "Mourão",
          "Olivença",
          "Portel",
          "Redondo",
          "Reguengos de Monsaraz",
          "Vendas Novas",
          "Viana do Alentejo",
          "Vila Viçosa"
        ],
        [
          "Albufeira",
          "Alcoutim",
          "Aljezur",
          "Castro Marim",
          "Faro",
          "Lagoa",
          "Lagos",
          "Loulé",
          "Monchique",
          "Olhão",
          "Portimão",
          "São Brás de Alportel",
          "Silves",
          "Tavira",
          "Vila do Bispo",
          "Vila Real de Santo António"
        ],
        [
          "Aguiar da Beira",
          "Almeida",
          "Celorico da Beira",
          "Figueira de Castelo Rodrigo",
          "Fornos de Algodres",
          "Gouveia",
          "Guarda",
          "Manteigas",
          "Mêda",
          "Pinhel",
          "Sabugal",
          "Seia",
          "Trancoso",
          "Vila Nova de Foz Côa"
        ],
        [
          "Alcobaça",
          "Alvaiázere",
          "Ansião",
          "Batalha",
          "Bombarral",
          "Caldas da Rainha",
          "Castanheira de Pera",
          "Figueiró dos Vinhos",
          "Leiria",
          "Marinha Grande",
          "Nazaré",
          "Óbidos",
          "Pedrógão Grande",
          "Peniche",
          "Pombal",
          "Porto de Mós"
        ],
        [
          "Alenquer",
          "Amadora",
          "Arruda dos Vinhos",
          "Azambuja",
          "Cadaval",
          "Cascais",
          "Lisboa",
          "Loures",
          "Lourinhã",
          "Mafra",
          "Odivelas",
          "Oeiras",
          "Sintra",
          "Sobral de Monte Agraço",
          "Torres Vedras",
          "Vila Franca de Xira"
        ],
        [
          "Alter do Chão",
          "Arronches",
          "Avis",
          "Campo Maior",
          "Castelo de Vide",
          "Crato",
          "Elvas",
          "Fronteira",
          "Gavião",
          "Marvão",
          "Monforte",
          "Nisa",
          "Ponte de Sor",
          "Portalegre",
          "Sousel"
        ],
        [
          "Amarante",
          "Baião",
          "Felgueiras",
          "Gondomar",
          "Lousada",
          "Maia",
          "Marco de Canaveses",
          "Matosinhos",
          "Paços de Ferreira",
          "Paredes",
          "Penafiel",
          "Porto",
          "Póvoa de Varzim",
          "Santo Tirso",
          "Trofa",
          "Valongo",
          "Vila do Conde",
          "Vila Nova de Gaia"
        ],
        [
          "Abrantes",
          "Alcanena",
          "Almeirim",
          "Alpiarça",
          "Benavente",
          "Cartaxo",
          "Chamusca",
          "Constância",
          "Coruche",
          "Entroncamento",
          "Ferreira do Zêzere",
          "Golegã",
          "Mação",
          "Ourém",
          "Rio Maior",
          "Salvaterra de Magos",
          "Santarém",
          "Sardoal",
          "Tomar",
          "Torres Novas",
          "Vila Nova da Barquinha"
        ],
        [
          "Alcácer do Sal",
          "Alcochete",
          "Almada",
          "Barreiro",
          "Grândola",
          "Moita",
          "Montijo",
          "Palmela",
          "Santiago do Cacém",
          "Seixal",
          "Sesimbra",
          "Setúbal",
          "Sines"
        ],
        [
          "Arcos de Valdevez",
          "Caminha",
          "Melgaço",
          "Monção",
          "Paredes de Coura",
          "Ponte da Barca",
          "Ponte de Lima",
          "Valença",
          "Viana do Castelo",
          "Vila Nova de Cerveira"
        ],
        [
          "Alijó",
          "Boticas",
          "Chaves",
          "Mesão Frio",
          "Mondim de Basto",
          "Montalegre",
          "Murça",
          "Peso da Régua",
          "Ribeira de Pena",
          "Sabrosa",
          "Santa Marta de Penaguião",
          "Valpaços",
          "Vila Pouca de Aguiar",
          "Vila Real"
        ],
        [
          "Armamar",
          "Carregal do Sal",
          "Castro Daire",
          "Cinfães",
          "Lamego",
          "Mangualde",
          "Moimenta da Beira",
          "Mortágua",
          "Nelas",
          "Oliveira de Frades",
          "Penalva do Castelo",
          "Penedono",
          "Resende",
          "Santa Comba Dão",
          "São João da Pesqueira",
          "São Pedro do Sul",
          "Sátão",
          "Sernancelhe",
          "Tabuaço",
          "Tarouca",
          "Tondela",
          "Vila Nova de Paiva",
          "Viseu",
          "Vouzela"
        ]
      ]
    };
  },
  mounted() {
    if (this.$store.state.vitabox) {
      this.vitabox = this.$store.state.vitabox;
    }
  },
  watch: {
    vitabox(val) {
      const element = document.getElementById("google-map-edit");
      const options = {
        zoom: 15,
        center: new google.maps.LatLng(val.latitude, val.longitude)
      };
      this.map = new google.maps.Map(element, options);
      google.maps.event.addListener(this.map, "click", event =>
        this.setMarker(event.latLng)
      );
    }
  },
  methods: {
    save() {
      if (
        this.district !== "" &&
        this.locality !== "" &&
        this.marker !== null
      ) {
        event_bus.$emit("waiting", true);

        this.vitabox.latitude = this.marker.getPosition().lat();
        this.vitabox.longitude = this.marker.getPosition().lng();
        this.vitabox.district = this.district
          .toLowerCase()
          .replace(/[éèêÉÈÊ]/g, "e")
          .replace(/[úùûÚÙÛ]/g, "u")
          .replace(/[áàãâAÁÀÃÂ]/g, "a")
          .replace(/[çÇ]/g, "c")
          .replace(/[íìîÍÌÎ]/g, "i")
          .replace(/[ñÑ]/g, "n")
          .replace(/[úùûÚÙÛ]/g, "u")
          .replace(/[óòõôÓÒÔÕ]/g, "o")
          .replace(/[ ]/g, "_");
        this.vitabox.locality = this.locality
          .toLowerCase()
          .replace(/[éèêÉÈÊ]/g, "e")
          .replace(/[úùûÚÙÛ]/g, "u")
          .replace(/[áàãâAÁÀÃÂ]/g, "a")
          .replace(/[çÇ]/g, "c")
          .replace(/[íìîÍÌÎ]/g, "i")
          .replace(/[ñÑ]/g, "n")
          .replace(/[úùûÚÙÛ]/g, "u")
          .replace(/[óòõôÓÒÔÕ]/g, "o")
          .replace(/[ ]/g, "_");

        event_bus.$data.http
          .put("/vitabox/" + this.vitabox.id + "/update", this.vitabox)
          .then(response => {
            this.dialog_vitabox_edit = false;
            this.$store.commit("editVitabox", this.vitabox);
            event_bus.$emit("toast", {
              message: "vitabox was successfully updated",
              type: "success"
            });
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
          message: "insert all the fields and the marker at map",
          type: "error"
        });
      }
    },
    setMarker(location) {
      if (this.marker !== null) {
        this.marker.setMap(null);
      }
      this.marker = new google.maps.Marker({
        position: location,
        map: this.map
      });
    },
    close() {
      this.dialog_vitabox_edit = false;
    }
  }
};
</script>

<style>
#google-map-edit {
  width: 100%;
  height: 300px;
  margin: 0 auto;
  background-color: transparent;
}
</style>
