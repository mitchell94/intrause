<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { usePerson } from '../composables/person'

const router = useRouter()
const url = import.meta.env.VITE_API_URL
const token = JSON.parse(localStorage.getItem('use'))

// COMPOSABLES
const { personName } = usePerson(url, token)

let goProgram = (id) => {
    localStorage.setItem('student', id)
    router.push({
        name: 'dashboard'
    })
}

let studentProgramsList = ref([])
let getStudentProgramsList = async () => {
    let response = await fetch(url + '/intranet/student-programs-list', {
        headers: {
            'X-Accesss-Token': token
        }
    })
    let data = await response.json()
    studentProgramsList.value = data
}
getStudentProgramsList()
</script>

<template>
    <div class="container-fluid back-welcome">
        <div class="row justify-content-center">
            <div class="col-md-2 col-lg-2 mt-3 d-flex justify-content-end show-images">
                <img src="../assets/logo-unsm.png" class="img-fluid logo-unsm" alt="" />
            </div>
            <div class="col-12 col-md-8 col-lg-7 col-xl-6 mt-3">
                <div class="mb-1 d-flex justify-content-center">
                    <span class="unsm-name text-center">UNIVERSIDAD NACIONAL DE SAN MARTÍN</span>
                </div>
                <div class="mb-1 d-flex justify-content-center">
                    <span class="fcs-name text-center">FACULTAD DE CIENCIAS DE LA SALUD</span>
                </div>
                <div class="mb-1 d-flex justify-content-center">
                    <span class="use-name text-center">UNIDAD DE SEGUNDA ESPECIALIDAD</span>
                </div>
            </div>
            <div class="col-md-2 col-lg-2 mt-3 d-flex justify-content-start show-images">
                <img src="../assets/logo-fcs.png" class="img-fluid logo-fcs" alt="" />
            </div>
        </div>

        <div class="row">
            <div class="col mt-5 person-name">Obsta. {{ personName }}</div>
        </div>

        <div class="row justify-content-center program-name">
            <div class="col-auto mt-4">
                <div class="list-group">
                    <button
                        type="button"
                        class="list-group-item list-group-item-action py-3 px-4 d-flex justify-content-between align-items-center"
                        aria-current="true"
                        v-for="ep in studentProgramsList"
                        :key="ep.id"
                        @click="goProgram(ep.id)"
                    >
                        Ir al programa de {{ ep.Program.abbreviation }}
                        <i class="fa-solid fa-arrow-right-to-bracket ms-2 ms-md-5"></i>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.back-welcome {
    background-color: #802434;
    color: white;
    font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
    font-weight: bold;
    width: 100%;
    min-height: 100%;
}
.unsm-name {
    font-size: 1em;
}
.fcs-name {
    font-size: 0.8em;
}
.use-name {
    font-size: 0.9em;
}
.show-images {
    display: none !important;
}
.person-name {
    text-align: center;
    font-size: 1em;
}
.program-name {
    text-align: center;
    font-size: 1.3em;
    font-weight: bold;
}
@media only screen and (min-width: 576px) {
    .unsm-name {
        font-size: 1.7em;
    }
    .fcs-name {
        font-size: 1.3em;
    }
    .use-name {
        font-size: 1.5em;
    }
}
@media only screen and (min-width: 768px) {
    .show-images {
        display: flex !important;
    }
    .logo-unsm,
    .logo-fcs {
        filter: drop-shadow(0 0 2px rgba(255, 255, 255, 0.4));
    }
    .unsm-name {
        font-size: 1.6em;
    }
    .fcs-name {
        font-size: 1.3em;
    }
    .use-name {
        font-size: 1.45em;
    }
}
@media only screen and (min-width: 992px) {
    .logo-unsm,
    .logo-fcs {
        max-width: 128px !important;
        max-height: 128px !important;
    }
    .unsm-name {
        font-size: 1.8em;
    }
    .fcs-name {
        font-size: 1.5em;
    }
    .use-name {
        font-size: 1.7em;
    }
    .person-name {
        text-align: center;
        font-size: 2em;
    }
    .program-name {
        text-align: center;
        font-size: 1.6em;
        font-weight: bold;
    }
}
</style>
