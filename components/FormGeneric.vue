<template>
  <form class="p-2">
    <div v-for="field in getFields" :key="field.name">
      <div v-if="field.inputType === 'select'"></div>
      <div v-else-if="field.inputType === 'option'"></div>
      <div v-else-if="field.inputType === 'currency'"></div>
      <div v-else-if="field.inputType === 'checkbox'">
        <div class="flex flex-row items-center m-2">
          <input
            :id="field.name"
            v-model="model[field.name]"
            :type="field.inputType"
            :placeholder="field.placeholder || field.label"
            class="border-2 border-blue-300 focus:border-blue-500"
          />
          <label class="ml-1" :for="field.name">{{ field.label }}</label>
        </div>
      </div>
      <div v-else>
        <div class="flex flex-row m-2 justify-center">
          <div class="flex flex-col">
            <label :for="field.name">{{ field.label }}</label>
            <input
              :id="field.name"
              v-model="model[field.name]"
              :type="field.inputType"
              :placeholder="field.placeholder || field.label"
              class="border-2 border-green-300 focus:border-green-500"
            />
          </div>
        </div>
      </div>
    </div>
  </form>
</template>
<script>
export default {
  props: {
    model: {
      type: Object,
      default: () => {},
    },
    viewConfig: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return { fields: [] };
  },
  computed: {
    getFields() {
      return this.setFields();
    },
  },
  methods: {
    camelCaseToSpace(stringValue) {
      let stringReturn = stringValue
        .replace(/([A-Z]+)/g, ' $1')
        .replace(/([A-Z][a-z])/g, ' $1');

      stringReturn =
        stringReturn.charAt(0).toUpperCase() +
        stringReturn.substring(1).toLowerCase();

      return stringReturn;
    },
    getType(object) {
      return typeof object;
    },
    getInputType(object) {
      const key = typeof object;
      let inputType = '';
      switch (key) {
        case 'string':
          inputType = 'text';
          break;
        case 'number':
          inputType = 'number';
          break;
        case 'date':
          inputType = 'date';
          break;
        case 'boolean':
          inputType = 'checkbox';
          break;
        case 'object':
          if (object instanceof Date) {
            inputType = 'date';
          }
          break;
        default:
          inputType = 'text';
          break;
      }
      return inputType;
    },
    setFields() {
      const dataProp = [];
      for (const key in this.viewConfig) {
        if (Object.hasOwnProperty.call(this.viewConfig, key)) {
          const index = dataProp.length + 1;
          dataProp.push({
            index,
            name: this.viewConfig[key].name || key,
            label: this.viewConfig[key].label || this.camelCaseToSpace(key),
            dataType:
              this.viewConfig[key].dataType ||
              this.getType(this.viewConfig[key].defaultValue),
            inputType:
              this.viewConfig[key].inputType ||
              this.getInputType(this.viewConfig[key].defaultValue),
            value:
              this.viewConfig[key].defaultValue instanceof Date
                ? this.viewConfig[key].defaultValue
                    .toISOString()
                    .substring(0, 10)
                : this.viewConfig[key].defaultValue,
            validations: this.viewConfig[key].validations,
            items: this.viewConfig[key].items || [],
          });
        }
      }
      //this.fields = dataProp;

      Object.entries(this.viewConfig).forEach((element) => {
        if (!this.model[element[0]])
          this.model[element[0]] =  element[1].defaultValue;
      });
      console.log(this.model);
      return dataProp;
    },
  },
};
</script>
