<script setup>
import { ref } from 'vue'
import { usePerson } from '../composables/person'
import { useProgram } from '../composables/program'
import { useCurrentDate } from '../composables/current-date'

const url = import.meta.env.VITE_API_URL
const token = JSON.parse(localStorage.getItem('use'))
const student = localStorage.getItem('student')

// COMPOSABLES
const { personName, personDocument } = usePerson(url, token)
const { programName } = useProgram(url, token, student)
const { currentDate } = useCurrentDate()

// PAGOS----------------------------------------------
let paymentsList = ref([])
let totalPaymentsPayed = ref(0)
let totalPaymentsPendant = ref(0)
let getPayments = async () => {
    let response = await fetch(url + `/intranet/student-payment`, {
        headers: {
            'X-Accesss-Token': token,
            'X-Student-Id': student
        }
    })
    let data = await response.json()
    paymentsList.value = data
    totalPaymentsPayed.value = data
        .filter((e) => e.type === 'Pagado')
        .reduce((total, item) => total + Number(item.amount), 0)

    totalPaymentsPendant.value = data
        .filter((e) => e.type === 'Pendiente')
        .reduce((total, item) => total + Number(item.amount), 0)
}
getPayments()
// Configuración de la tabla pagos
const paymentSearchField = ['concept', 'amount', 'process', 'type']
const paymentSearchValue = ref('')
const paymentsHeaders = ref([
    { text: 'CONCEPTO', value: 'concept' },
    { text: 'MONTO', value: 'amount' },
    { text: 'PERIODO', value: 'process' },
    { text: 'ESTADO', value: 'type' }
])
// Impresión de la tabla pagos
let printPaymentsOpen = ref(false)
let printPayments = {
    id: 'to-print-payments',
    openCallback() {
        printPaymentsOpen.value = false
    }
}
</script>

<template>
    <div class="row">
        <div class="col d-flex align-items-center page-bar">
            <span class="page-title">Reporte de pagos</span>
        </div>
    </div>
    <div class="row">
        <div class="col mt-3 mb-3">
            <div class="card shadow-sm top-random">
                <div class="card-header d-flex justify-content-between text-random">
                    <span class="h6">CONCEPTOS DE PAGO</span>
                    <span
                        class="cursor-pt"
                        v-print="printPayments"
                        @click="printPaymentsOpen = true"
                    >
                        <span class="fa-solid fa-print"></span>
                        IMPRIMIR
                    </span>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-auto">
                            <span class="form-label fw-bold text-secondary">Buscar:</span>
                        </div>
                        <div class="col">
                            <input
                                type="text"
                                class="form-control form-control-sm mb-2"
                                v-model="paymentSearchValue"
                            />
                        </div>
                    </div>
                    <EasyDataTable
                        :headers="paymentsHeaders"
                        :items="paymentsList"
                        :search-field="paymentSearchField"
                        :search-value="paymentSearchValue"
                        :rows-per-page="10"
                        show-index
                        alternating
                        buttons-pagination
                    >
                    </EasyDataTable>
                </div>
            </div>
        </div>
    </div>

    <!-- PAGINA DE IMPRESIÓN DE CONCEPTOS -->
    <div class="row" v-if="printPaymentsOpen">
        <div class="col mb-3">
            <div class="print-page" id="to-print-payments">
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
                        <div class="col pt-2 pb-0 print-title">CONCEPTOS DE PAGO</div>
                    </div>
                    <div class="row">
                        <div class="col px-0">
                            <div class="mt-3">
                                <table>
                                    <tbody>
                                        <tr>
                                            <td class="td-bold">PROGRAMA</td>
                                            <td class="td-bold px-2">:</td>
                                            <td class="td-normal">{{ programName }}</td>
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
                        <div class="col d-flex justify-content-between mt-3 px-0">
                            <span>T. Pagado: S/ {{ totalPaymentsPayed }}</span>
                            <span>T. Pendiente: S/ {{ totalPaymentsPendant }}</span>
                            <span>Fecha: {{ currentDate }}</span>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col mt-1 p-0">
                            <table class="table table-sm table-bordered">
                                <thead class="table-dark">
                                    <tr>
                                        <th>#</th>
                                        <th>CONCEPTO</th>
                                        <th>MONTO</th>
                                        <th>PERIODO</th>
                                        <th>ESTADO</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(pay, i) in paymentsList" :key="pay.id">
                                        <td>{{ i + 1 }}</td>
                                        <td>{{ pay.concept }}</td>
                                        <td>{{ pay.amount }}</td>
                                        <td>{{ pay.process }}</td>
                                        <td :class="{ 'text-danger': pay.type == 'Pendiente' }">
                                            {{ pay.type }}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
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
</style>
