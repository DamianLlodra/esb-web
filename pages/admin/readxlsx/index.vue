<template>
  <div>
    <v-file-input
      v-model="file"
      @change="readXlsx"
      accept=".xlsx"
      label="Seleccionar archivo"
      hint="Selecciona un archivo .xlsx"
      prepend-icon="mdi-file-excel"
    ></v-file-input>
    {{ data }}
  </div>
</template>

<script>
import { utils, read } from 'xlsx';
export default {
  data() {
    return {
      file: null,
      data: null,
    };
  },
  methods: {
    readXlsx() {
      let datos = [];
      const reader = new FileReader();
      reader.onload = (e) => {
        const ddata = new Uint8Array(e.target.result);
        const workbook = read(ddata, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        const json = utils.sheet_to_json(worksheet, {
          blankrows: false,
          header: 1,
        });
        json.splice(0, 7);
        datos = json;
      };
      if (this.file) reader.readAsArrayBuffer(this.file);

      return datos;
    },
  },
};
</script>

<style></style>