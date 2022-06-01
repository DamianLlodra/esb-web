<template>
  <form class="p-1">
    <div v-for="field in getFields" :key="field.name">
      
      <div class="flex flex-row m-2 justify-center">
        <div class="flex flex-col">
          <div v-if="field.inputType === 'select'">
            <v-select
              :label="field.label"
              :id="field.name"
              v-model="model[field.name]"
              :type="field.inputType"
              :placeholder="field.placeholder || field.label"
              :prefix="field.prefix"
              :suffix="field.suffix"
              :items="field.options"
              :item-text="field.itemText"
              :item-value="field.itemValue"
            >
            </v-select>
          </div>
          <div v-else-if="field.inputType === 'option'"></div>
          <div v-else-if="field.inputType === 'currency'"></div>
          <div v-else-if="field.inputType === 'file'">
            <v-file-input
              :label="field.label"
              :id="field.name"
              v-model="model[field.name]"
              key=""
              type="file"
              :placeholder="field.placeholder || field.label"
              :prefix="field.prefix"
              :suffix="field.suffix"
            ></v-file-input>
          </div>
          <div v-else-if="field.inputType === 'checkbox'">
            
            <div class="flex flex-row items-center m-2">
              <!-- <input
                :id="field.name"
                v-model="model[field.name]"
                :type="field.inputType"
                :placeholder="field.placeholder || field.label"
                class="border-2 border-blue-300 focus:border-blue-500"
              /> -->
              <div v-if="field.options && field.options.length > 0">
                <v-checkbox
                  v-for="option in field.options"
                  :key="option.label"
                  v-model="model[field.name]"
                  :value="option.value"
                  :label="option.label"
                >
                {{ option.label }}
                </v-checkbox>
              </div>
              <div v-else>
                
                <v-checkbox
                  :id="field.name"
                  v-model="model[field.name]"
                  :label="field.label"
                ></v-checkbox>
              </div>
            </div>
          </div>
          <div v-else-if="field.inputType === 'number'">
            <v-text-field
              :label="field.label"
              :id="field.name"
              v-model.number="model[field.name]"
              :type="field.inputType"
              :placeholder="field.placeholder || field.label"
              :prefix="field.prefix"
              :suffix="field.suffix"
            >
            </v-text-field>
          </div>
          <div v-else-if="field.inputType === 'textarea'">
            <v-textarea
              :label="field.label"
              :id="field.name"
              v-model="model[field.name]"
              :type="field.inputType"
              :placeholder="field.placeholder || field.label"
              :prefix="field.prefix"
              :suffix="field.suffix"
            >
            </v-textarea>
          </div>
          <div v-else>
            <v-text-field
              :label="field.label"
              :id="field.name"
              v-model="model[field.name]"
              :type="field.inputType"
              :placeholder="field.placeholder || field.label"
              :prefix="field.prefix"
              :suffix="field.suffix"
            >
            </v-text-field>
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
            suffix: this.viewConfig[key].suffix,
            prefix: this.viewConfig[key].prefix,
            options: this.viewConfig[key].options,
            itemText: this.viewConfig[key].itemText,
            itemValue: this.viewConfig[key].itemValue,
          });
        }
      }

      Object.entries(this.viewConfig).forEach((element) => {
        if (!this.model[element[0]])
          this.model[element[0]] = element[1].defaultValue;
      });

      return dataProp;
    },
  },
};
</script>
