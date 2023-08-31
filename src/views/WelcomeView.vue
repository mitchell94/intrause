<script setup>
import { ref, onMounted } from 'vue'

// import Swal from 'sweetalert2'

let url = import.meta.env.VITE_API_URL
let token = JSON.parse(localStorage.getItem('use'))

let personData = ref({})
let getPersonData = async () => {
    let response = await fetch(url + '/intranet/person/profile', {
        headers: {
            'X-Accesss-Token': token
        }
    })
    let responseData = await response.json()
    personData.value = responseData
}
getPersonData()

let studentSpecialtyData = ref(undefined)
let getStudentSpecialty = async () => {
    let response = await fetch(url + '/intranet/student-program', {
        headers: {
            'X-Accesss-Token': token
        }
    })
    let responseData = await response.json()
    studentSpecialtyData.value = responseData
    localStorage.setItem('student', responseData.id)
}
getStudentSpecialty()

onMounted(() => {})
</script>

<template>
    <div class="row">
        <div class="col d-flex justify-content-center mt-3">
            <h1 class="text-random text-center">INTRANET USE-FCS</h1>
        </div>
    </div>
    <div class="row">
        <div class="col d-flex justify-content-center mt-3">
            <h2 class="text-dark text-center">
                Obsta. {{ personData.name + ' ' + personData.paternal + ' ' + personData.maternal }}
            </h2>
        </div>
    </div>
    <div class="row">
        <div class="col d-flex justify-content-center mt-3">
            <h2 class="text-dark text-center">
                {{ personData.document_number }}
            </h2>
        </div>
    </div>
    <div class="row" v-if="studentSpecialtyData !== undefined">
        <div class="col d-flex justify-content-center mt-3">
            <h3 class="text-random text-center">
                {{ studentSpecialtyData.Program.denomination }}
            </h3>
        </div>
    </div>
    <div class="row justify-content-center">
        <div class="col-6 col-md-4 image-unsm"></div>
        <div class="col-6 col-md-4 image-fcs"></div>
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
    background-image: url('../logo-unsm.png');
}

.image-fcs {
    background-image: url('../logo-fcs.png');
}
p {
    font-size: 1.5rem;
    font-weight: 600;
}
</style>
