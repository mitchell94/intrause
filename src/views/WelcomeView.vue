<script setup>
import { ref } from 'vue'
import { usePersonData } from '../composables/person-data';

const url = import.meta.env.VITE_API_URL
const token = JSON.parse(localStorage.getItem('use'))

// COMPOSABLES
const { person } = usePersonData(url, token)

let studentSpecialtyData = ref(undefined)
let getStudentSpecialty = async () => {
    let response = await fetch(url + '/intranet/student-program', {
        headers: {
            'X-Accesss-Token': token
        }
    })
    let responseData = await response.json()
    studentSpecialtyData.value = responseData
}
getStudentSpecialty()

</script>

<template>
    <div class="row">
        <div class="col d-flex justify-content-center mt-3">
            <h1 class="text-random text-center">USE-FCS</h1>
        </div>
    </div>
    <div class="row">
        <div class="col d-flex justify-content-center mt-3">
            <h2 class="text-dark text-center">
                Obsta. {{ person.name + ' ' + person.paternal + ' ' + person.maternal }}
            </h2>
        </div>
    </div>
    <div class="row justify-content-center">
        <div class="col col-md-10 mt-3">
            <h2 class="text-dark text-center">
                {{ person.document_number }}
            </h2>
        </div>
    </div>
    <div class="row justify-content-center" v-if="studentSpecialtyData !== undefined">
        <div class="col col-md-10 mt-3">
            <h3 class="text-random text-center">
                {{ studentSpecialtyData.Program.denomination }}
            </h3>
        </div>
    </div>
    <div class="row justify-content-center">
        <div class="col-5 col-md-3 image-unsm"></div>
        <div class="col-5 col-md-3 image-fcs"></div>
    </div>
</template>

<style scoped>
.image-unsm,
.image-fcs {
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
    height: 300px;
}
.image-unsm {
    background-image: url('../assets/logo-unsm.png');
}
.image-fcs {
    background-image: url('../assets/logo-fcs.png');
}
p {
    font-size: 1.5rem;
    font-weight: 600;
}
</style>
