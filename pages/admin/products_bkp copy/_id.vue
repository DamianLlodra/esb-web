<template>
  <div class="flex flex-col">
    <form-generic :view-config="viewConfig" :model="data"></form-generic>
    <button @click="save">Grabar</button>
  </div>
</template>

<script>
import FormGeneric from '~/components/FormGeneric.vue';
export default {
  components: { FormGeneric },
  asyncData() {
    return {
      data: {},
      viewConfig: { producto: {}, lista: {}, imagen: {}, stock: {} },
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    save() {
      this.data.id =
        this.$route.params.id === 'new'
          ? this.data.nombre.replace(' ', '-')
          : this.$route.params.id;
      this.$dal.save('productos', this.data).then(() => {
        this.$router.push('/admin/products');
      });
    },
    loadData() {
      this.$dal.getById('products', this.$route.params.id).then((data) => {
        this.data = data;
      });
    },
    loadFile(e) {
      const reader = new FileReader();
      const file = e.target.files[0]; // get the supplied file
      // if there is a file, set image to that file
      if (file) {
        reader.onload = () => {
          if (reader.readyState === 2) {
            this.uploadToFirebase(file);
          }
        };
        reader.readAsDataURL(e.target.files[0]);
        // if there is no file, set image back to null
      } else {
        this.uploadToFirebase(null);
      }
    },
    uploadToFirebase(image) {
      if (image) {
        const storage = this.$firebase.storage();
        const storageRef = storage.ref();
        const imageRef = storageRef.child('/fotos/' + image.name);

        imageRef.put(image).then(() => {
          alert('Image uploaded successfully to Firebase.');
        });
      } else {
        alert('Please upload an image first.');
      }
    },
    Show() {
      const storage = this.$firebase.storage();
      const storageRef = storage.ref();
      const imageRef = storageRef.child('aceite-Pureza-Girasol-900ml.jpg');
      imageRef
        .getDownloadURL()
        .then(function (url) {
          this.imagen = url;
        })
        .catch(function (error) {
          console.error(error);
        });
    },
  },
};
</script>

<style></style>
