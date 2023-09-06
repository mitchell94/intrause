<script setup>
import { ref } from 'vue'

let url = import.meta.env.VITE_API_URL
let token = JSON.parse(localStorage.getItem('use'))
let studentId = JSON.parse(localStorage.getItem('student'))

// OBTIENE LOS DATOS DEL USUARIO INICIADO
let personName = ref('')
let personDocument = ref('')
let getPersonData = async () => {
    let response = await fetch(url + '/intranet/person/profile', {
        headers: {
            'X-Accesss-Token': token
        }
    })
    let responseData = await response.json()
    personName.value = responseData.name + ' ' + responseData.paternal + ' ' + responseData.maternal
    personDocument.value = responseData.document_number
}
getPersonData()

let programName = ref('')
let getStudentSpecialty = async () => {
    let response = await fetch(url + '/intranet/student-program', {
        headers: {
            'X-Accesss-Token': token
        }
    })
    let responseData = await response.json()
    programName.value = responseData.Program.denomination.toUpperCase()
}
getStudentSpecialty()

// MOVIMIENTOS--------------------------------------
// let movementsList = ref([])
// let totalMovements = ref(0)
// let getMovements = async () => {
//     let response = await fetch(url + `/intranet/student-movement/${studentId}`, {
//         headers: {
//             'X-Accesss-Token': token
//         }
//     })
//     let responseData = await response.json()
//     movementsList.value = responseData
//     totalMovements.value = responseData.reduce(
//         (total, item) => total + Number(item.voucher_amount),
//         0
//     )
// }
// getMovements()
// // Configuración de la tabla movimientos
// const movementSearchField = ['voucher_code', 'voucher_amount', 'voucher_date']
// const movementSearchValue = ref('')
// const movementsHeaders = ref([
//     { text: 'N° RECIBO', value: 'voucher_code' },
//     { text: 'MONTO', value: 'voucher_amount', sortable: true },
//     { text: 'FECHA RECIBO', value: 'voucher_date', sortable: true },
//     { text: 'ESTADO', value: 'state' }
// ])
// // Impresión de la tabla movimientos
// let printMovementsOpen = ref(false)
// let printMovements = {
//     id: 'to-print-movements',
//     openCallback() {
//         printMovementsOpen.value = false
//     }
// }

// PAGOS----------------------------------------------
let paymentsList = ref([])
let totalPaymentsPayed = ref(0)
let totalPaymentsPendant = ref(0)
let getPayments = async () => {
    let response = await fetch(url + `/intranet/student-payment/${studentId}`, {
        headers: {
            'X-Accesss-Token': token
        }
    })
    let responseData = await response.json()
    paymentsList.value = responseData
    totalPaymentsPayed.value = responseData
        .filter((e) => e.type === 'Pagado')
        .reduce((total, item) => total + Number(item.amount), 0)

    totalPaymentsPendant.value = responseData
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
// Impresión de la tabla movimientos
let printPaymentsOpen = ref(false)
let printPayments = {
    id: 'to-print-payments',
    openCallback() {
        printPaymentsOpen.value = false
    }
}

// FECHA ACTUAL---------------------------------------
let currentDate = new Date()
let day = currentDate.getDate()
let month = currentDate.getMonth() + 1
let year = currentDate.getFullYear()

if (day < 10) {
    day = '0' + day
}

if (month < 10) {
    month = '0' + month
}

let formattedDate = ref(day + '-' + month + '-' + year)
</script>

<template>
    <div class="row">
        <div class="col d-flex align-items-center page-bar">
            <span class="page-title">Reporte de pagos</span>
        </div>
    </div>
    <div class="row">
        <!-- <div class="col mt-3 mb-md-3">
            <div class="card shadow-sm top-primary">
                <div class="card-header d-flex justify-content-between text-primary">
                    <span class="h6">PAGOS REALIZADOS</span>
                    <span
                        class="cursor-pt"
                        v-print="printMovements"
                        @click="printMovementsOpen = true"
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
                                v-model="movementSearchValue"
                            />
                        </div>
                    </div>
                    <EasyDataTable
                        :headers="movementsHeaders"
                        :items="movementsList"
                        :search-field="movementSearchField"
                        :search-value="movementSearchValue"
                        :rows-per-page="10"
                        show-index
                        alternating
                        buttons-pagination
                    >
                    </EasyDataTable>
                </div>
            </div>
        </div> -->
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

    <!-- PAGINA DE IMPRESIÓN DE MOVIMIENTOS -->
    <!-- <div class="row" v-if="printMovementsOpen">
        <div class="col mb-3">
            <div class="print-page" id="to-print-movements">
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
                        <div class="col fw-bold pt-3 pb-0 card-title">
                            REPORTE DE RECIBOS DE PAGO
                        </div>
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
                            <span>Total: S/ {{ totalMovements }}</span>
                            <span>Fecha: {{ formattedDate }}</span>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col mt-1 p-0">
                            <table class="table table-sm table-bordered">
                                <thead class="table-dark">
                                    <tr>
                                        <th>#</th>
                                        <th>N° RECIBO</th>
                                        <th>MONTO</th>
                                        <th>FECHA DE RECIBO</th>
                                        <th>ESTADO</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(mov, i) in movementsList" :key="mov.id">
                                        <td>{{ i + 1 }}</td>
                                        <td>{{ mov.voucher_code }}</td>
                                        <td>{{ mov.voucher_amount }}</td>
                                        <td>{{ mov.voucher_date }}</td>
                                        <td>{{ mov.state }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div> -->

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
                        <div class="col fw-bold pt-3 pb-0 card-title">
                            REPORTE DE CONCEPTOS DE PAGO
                        </div>
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
                            <span>Fecha: {{ formattedDate }}</span>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col mt-1 p-0">
                            <table class="table table-sm table-bordered">
                                <thead class="table-dark">
                                    <tr>
                                        <th>#</th>
                                        <th>CONCEPTOO</th>
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
            </div>
        </div>
    </div>
</template>

<style scoped>
.print-page {
    width: 21cm;
    min-height: 29.7cm;
    padding: 1cm;
    font-family: Arial, Helvetica, sans-serif;
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
    background-image: url('../logo-unsm.png');
}

.image-fcs {
    background-image: url('../logo-fcs.png');
}
.unsm-name {
    font-size: 1.4rem;
}
.fcs-name {
    font-size: 1.15rem;
}
.use-name {
    font-size: 1.3rem;
}

.card-title {
    display: flex;
    justify-content: center;
    border-bottom: 2px solid black;
    font-weight: bold;
    font-size: 1.6rem;
    color: black;
}

table {
    white-space: normal !important;
}
.td-bold {
    font-weight: bold;
    font-size: 0.8rem;
}
.td-normal {
    font-size: 0.8rem;
}

th,
td {
    font-size: 0.7rem;
}
</style>
