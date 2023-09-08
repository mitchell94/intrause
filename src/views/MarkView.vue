<script setup>
import { ref } from 'vue'
import { usePerson } from '../composables/person'
import { useProgram } from '../composables/program'

const url = import.meta.env.VITE_API_URL
const token = JSON.parse(localStorage.getItem('use'))
const student = localStorage.getItem('student')

// COMPOSABLES
const { personName, personDocument } = usePerson(url, token)
const { programName } = useProgram(url, token, student)

// RECORD ACADEMICO --------------------------------------
let unityName = ref('')
let sedeName = ref('')
let registrationList = ref([])
let totalCourses = ref(0)
let totalCredits = ref(0)
let generalAverage = ref(0)
let aprovedCourses = ref(0)
let aprovedCredits = ref(0)
// let percentAprovedCredits = ref(0)
let getAcademicRecord = async () => {
    let response = await fetch(url + `/intranet/student-academic-record`, {
        headers: {
            'X-Accesss-Token': token,
            'X-Student-Id': student
        }
    })
    let data = await response.json()

    // Datos generales de texto
    unityName.value = data.principalOrganicUnit.description.toUpperCase()
    sedeName.value = data.studentData.Program.Organic_unit_register.Campu.denomination.toUpperCase()
    registrationList.value = data.registration

    // Calcular total de cursos inscritos
    totalCourses.value = data.registration
        .map((reg) => reg.Registration_course.length)
        .reduce((total, course) => total + course, 0)

    // Calcular total de créditos inscritos
    totalCredits.value = data.registration
        .map((reg) =>
            reg.Registration_course.reduce(
                (totalRegCredits, regCourse) => totalRegCredits + regCourse.credits,
                0
            )
        )
        .reduce((total, regQtyCredits) => total + regQtyCredits, 0)

    // Calcular promedio general de los cursos inscritos
    generalAverage.value = (
        data.registration
            .map((reg) => {
                let sumNotes = reg.Registration_course.reduce(
                    (sumNotes, regCourse) => sumNotes + regCourse.note,
                    0
                )
                let regNote = sumNotes / reg.Registration_course.length
                return regNote
            })
            .reduce((sumRegNotes, regNote) => sumRegNotes + regNote, 0) / data.registration.length
    ).toFixed(2)

    // Calcular total de cursos aprobados
    aprovedCourses.value = data.registration
        .map(
            (reg) =>
                reg.Registration_course.filter((regCourse) => regCourse.type == 'Aprobado').length
        )
        .reduce((total, course) => total + course)

    // Calcular total de créditos aprobados
    aprovedCredits.value = data.registration
        .map((reg) =>
            reg.Registration_course.filter((regCourse) => regCourse.type == 'Aprobado').reduce(
                (totalRegCredits, regCourse) => totalRegCredits + regCourse.credits,
                0
            )
        )
        .reduce((total, regQtyCredits) => total + regQtyCredits, 0)

    // Calcular porcentaje de créditos aprobados
    // percentAprovedCredits.value = (aprovedCredits.value / totalCredits.value) * 100
}
getAcademicRecord()

// // Impresión de la tabla record
let printRecordOpen = ref(false)
let printRecord = {
    id: 'to-print-record',
    openCallback() {
        printRecordOpen.value = false
    }
}
</script>

<template>
    <div class="row">
        <div class="col d-flex align-items-center page-bar">
            <span class="page-title">Reporte de calificaciones</span>
        </div>
    </div>
    <div class="row">
        <div class="col mt-3 mb-3">
            <div class="card shadow-sm top-random">
                <div class="card-header d-flex justify-content-between text-random">
                    <span class="h6">RECORD ACADÉMICO</span>
                    <span class="cursor-pt" v-print="printRecord" @click="printRecordOpen = true">
                        <span class="fa-solid fa-print"></span>
                        IMPRIMIR
                    </span>
                </div>
                <div class="card-body">
                    <div class="mb-2 fw-bold text-random">{{ programName }}</div>
                    <div class="row">
                        <div class="col-12 mt-3" v-for="reg in registrationList" :key="reg.id">
                            <span style="font-weight: bold; font-size: 0.8em; margin-right: 35px"
                                >SEMESTRE</span
                            >
                            <span style="font-size: 0.8em">{{
                                reg.Academic_semester.Academic_calendar.denomination +
                                ' - ' +
                                reg.Academic_semester.denomination
                            }}</span>
                            <table class="table table-sm table-bordered">
                                <thead class="table-dark">
                                    <tr>
                                        <th style="width: 85px">CÓDIGO</th>
                                        <th>CURSO</th>
                                        <th style="width: 20px">CL</th>
                                        <th style="width: 20px">CR</th>
                                        <th style="width: 20px">TC</th>
                                        <th style="width: 35px">NOTA</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="reco in reg.Registration_course" :key="reco.id">
                                        <td>{{ reco.code }}</td>
                                        <td>{{ reco.denomination }}</td>
                                        <td>{{ reco.ciclo }}</td>
                                        <td>{{ reco.credits }}</td>
                                        <td>
                                            <span v-if="reco.type_course == 'Obligatorio'">O</span>
                                            <span v-else>E</span>
                                        </td>
                                        <td
                                            :class="{
                                                'text-danger': reco.type == 'Desaprobado'
                                            }"
                                        >
                                            <span v-if="Number(reco.note) >= 10">{{
                                                reco.note
                                            }}</span>
                                            <span v-else>{{ `0${reco.note}` }}</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="mb-2">
                        <div class="row">
                            <div class="col">
                                <div class="mt-3">
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td class="td-bold">TOTAL CURSOS</td>
                                                <td class="td-bold px-2">:</td>
                                                <td class="td-normal">{{ totalCourses }}</td>
                                            </tr>
                                            <tr>
                                                <td class="td-bold">TOTAL CRÉDITOS</td>
                                                <td class="td-bold px-2">:</td>
                                                <td class="td-normal">{{ totalCredits }}</td>
                                            </tr>
                                            <tr>
                                                <td class="td-bold">PROMEDIO GENEREAL</td>
                                                <td class="td-bold px-2">:</td>
                                                <td class="td-normal">{{ generalAverage }}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div class="col">
                                <div class="mt-3">
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td class="td-bold">CURSOS APROBADOS</td>
                                                <td class="td-bold px-2">:</td>
                                                <td class="td-normal">{{ aprovedCourses }}</td>
                                            </tr>
                                            <tr>
                                                <td class="td-bold">CRÉDITOS APROBADOS</td>
                                                <td class="td-bold px-2">:</td>
                                                <td class="td-normal">{{ aprovedCredits }}</td>
                                            </tr>
                                            <!-- <tr>
                                                <td class="td-bold">
                                                    PORCENTAJE CRÉDITOS APROBADOS
                                                </td>
                                                <td class="td-bold px-2">:</td>
                                                <td class="td-normal">
                                                    {{ percentAprovedCredits }}%
                                                </td>
                                            </tr> -->
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div class="row mt-3" style="font-size: 0.7em">
                            <div class="col-auto">CL: Ciclo</div>
                            <div class="col-auto">CR: Créditos</div>
                            <div class="col">TC: Tipo Curso (O=Obligatorio; E=Electivo)</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- PAGINA DE IMPRESIÓN DE RECORD -->
    <div class="row" v-if="printRecordOpen">
        <div class="col mb-3">
            <div class="print-page" id="to-print-record">
                <div class="content-page container-fluid">
                    <div class="row">
                        <div class="col-auto px-0">
                            <div class="image-unsm"></div>
                        </div>
                        <div class="col px-0">
                            <div class="d-flex justify-content-center unsm-name">
                                UNIVERSIDAD NACIONAL DE SAN MARTÍN
                            </div>
                            <div class="d-flex justify-content-center fcs-name">
                                FACULTAD DE CIENCIAS DE LA SALUD
                            </div>
                            <div class="d-flex justify-content-center use-name">
                                UNIDAD DE SEGUNDA ESPECIALIDAD
                            </div>
                        </div>
                        <div class="col-auto px-0">
                            <div class="image-fcs"></div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col pt-2 pb-0 print-title">RECORD ACADÉMICO</div>
                    </div>

                    <div class="row">
                        <div class="col px-0">
                            <div class="mt-3">
                                <table>
                                    <tbody>
                                        <tr>
                                            <td class="td-bold">UNIDAD</td>
                                            <td class="td-bold px-2">:</td>
                                            <td class="td-normal">{{ unityName }}</td>
                                        </tr>
                                        <tr>
                                            <td class="td-bold">PROGRAMA</td>
                                            <td class="td-bold px-2">:</td>
                                            <td class="td-normal">{{ programName }}</td>
                                        </tr>
                                        <tr>
                                            <td class="td-bold">SEDE</td>
                                            <td class="td-bold px-2">:</td>
                                            <td class="td-normal">{{ sedeName }}</td>
                                        </tr>
                                        <tr>
                                            <td class="td-bold">ESTUDIANTE</td>
                                            <td class="td-bold px-2">:</td>
                                            <td class="td-normal">{{ personName }}</td>
                                        </tr>
                                        <tr>
                                            <td class="td-bold">CÓD/DNI</td>
                                            <td class="td-bold px-2">:</td>
                                            <td class="td-normal">{{ personDocument }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-12 mt-3 p-0" v-for="reg in registrationList" :key="reg.id">
                            <span style="font-weight: bold; font-size: 0.8em; margin-right: 35px"
                                >SEMESTRE</span
                            >
                            <span style="font-size: 0.8em">{{
                                reg.Academic_semester.Academic_calendar.denomination +
                                ' - ' +
                                reg.Academic_semester.denomination
                            }}</span>
                            <table class="table table-sm table-bordered">
                                <thead class="table-dark">
                                    <tr>
                                        <th style="width: 85px">CÓDIGO</th>
                                        <th>CURSO</th>
                                        <th style="width: 20px">CL</th>
                                        <th style="width: 20px">CR</th>
                                        <th style="width: 20px">TC</th>
                                        <th style="width: 35px">NOTA</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="reco in reg.Registration_course" :key="reco.id">
                                        <td>{{ reco.code }}</td>
                                        <td>{{ reco.denomination }}</td>
                                        <td>{{ reco.ciclo }}</td>
                                        <td>{{ reco.credits }}</td>
                                        <td>
                                            <span v-if="reco.type_course == 'Obligatorio'">O</span>
                                            <span v-else>E</span>
                                        </td>
                                        <td
                                            :class="{
                                                'text-danger': reco.type == 'Desaprobado'
                                            }"
                                        >
                                            <span v-if="Number(reco.note) >= 10">{{
                                                reco.note
                                            }}</span>
                                            <span v-else>{{ `0${reco.note}` }}</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col px-0">
                            <div class="mt-3">
                                <table>
                                    <tbody>
                                        <tr>
                                            <td class="td-bold">TOTAL CURSOS</td>
                                            <td class="td-bold px-2">:</td>
                                            <td class="td-normal">{{ totalCourses }}</td>
                                        </tr>
                                        <tr>
                                            <td class="td-bold">TOTAL CRÉDITOS</td>
                                            <td class="td-bold px-2">:</td>
                                            <td class="td-normal">{{ totalCredits }}</td>
                                        </tr>
                                        <tr>
                                            <td class="td-bold">PROMEDIO GENEREAL</td>
                                            <td class="td-bold px-2">:</td>
                                            <td class="td-normal">{{ generalAverage }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div class="col px-0">
                            <div class="mt-3">
                                <table>
                                    <tbody>
                                        <tr>
                                            <td class="td-bold">CURSOS APROBADOS</td>
                                            <td class="td-bold px-2">:</td>
                                            <td class="td-normal">{{ aprovedCourses }}</td>
                                        </tr>
                                        <tr>
                                            <td class="td-bold">CRÉDITOS APROBADOS</td>
                                            <td class="td-bold px-2">:</td>
                                            <td class="td-normal">{{ aprovedCredits }}</td>
                                        </tr>
                                        <!-- <tr>
                                            <td class="td-bold">PORCENTAJE CRÉDITOS APROBADOS</td>
                                            <td class="td-bold px-2">:</td>
                                            <td class="td-normal">{{ percentAprovedCredits }}%</td>
                                        </tr> -->
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div class="row legend mt-3">
                        <div class="col-auto">CL: Ciclo</div>
                        <div class="col-auto">CR: Créditos</div>
                        <div class="col">TC: Tipo Curso (O=Obligatorio; E=Electivo)</div>
                    </div>
                </div>
                <span class="watermark">SOLO LECTURA</span>
            </div>
        </div>
    </div>
</template>

<style scoped>
@media print {
    .print-page {
        width: 21cm;
        min-height: 29.7cm;
        padding: 1cm;
        font-family: Arial, Helvetica, sans-serif;
        position: relative;
    }
}
.watermark {
    color: rgba(0, 0, 0, 0.17);
    font-size: 9em;
    font-family: Verdana, Geneva, Tahoma, sans-serif;
    font-weight: bold;
    position: fixed;
    left: -5%;
    top: 26%;
    transform: rotate(-55deg);
    text-align: center;
}
.image-unsm,
.image-fcs {
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
    height: 110px;
    width: 110px;
}
.image-unsm {
    background-image: url('../assets/logo-unsm.png');
}
.image-fcs {
    background-image: url('../assets/logo-fcs.png');
}
.unsm-name {
    font-size: 1.4em;
}
.fcs-name {
    font-size: 1.15em;
}
.use-name {
    font-size: 1.3em;
}
.print-title {
    display: flex;
    justify-content: center;
    border-bottom: 2px solid black;
    font-weight: bold;
    font-size: 1.7em;
    color: black;
}

table {
    white-space: normal !important;
}
.td-bold {
    font-weight: bold;
    font-size: 0.8em;
}
.td-normal {
    font-size: 0.8em;
}

th,
td {
    font-size: 0.7em;
}

.legend {
    font-size: 0.7em;
    /* font-weight: bold; */
}
.legend > div {
    padding-left: 0 !important;
    padding-right: 75px !important;
}
</style>
