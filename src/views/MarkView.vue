<script setup>
// let url = import.meta.env.VITE_API_URL
// let token = JSON.parse(localStorage.getItem('token'))
// let periodo = ref(null)
// let asociados = ref(null)
// let ingresos = ref(null)
// let egresos = ref(null)

// let consultaDashboard = async () => {
//     let respuesta = await fetch(url + '/reportes/consulta-dashboard', {
//         headers: {
//             Authorization: 'Bearer ' + token
//         }
//     })
//     let respuestaDatos = await respuesta.json()
//     if (respuestaDatos != false) {
//         periodo.value = respuestaDatos.periodo
//         asociados.value = respuestaDatos.asociados
//         ingresos.value = respuestaDatos.ingresos
//         egresos.value = respuestaDatos.egresos
//     }
// }

// onMounted(() => {
//     // consultaDashboard()
// })
</script>

<template>
    <div class="row">
        <div class="col d-flex justify-content-center mt-3">
            <h2 class="text-random text-center">INTRANET USE-FCS</h2>
        </div>
    </div>
    <div class="row">
        <!-- <div class="col image-unsm"></div> -->
        <div class="col image-fcs"></div>
    </div>
    <div class="row">
        <div class="col d-flex justify-content-center mt-3">
            <h1 class="text-success text-center">UNSM - T</h1>
        </div>
    </div>
    <!-- <div class="row gx-2">
        <div class="col-md-3 mt-3 mt-md-0">
            <div class="card top-secondary text-secondary bg-white shadow-sm">
                <div class="card-body">
                    <span>Programa</span>
                    <p v-if="periodo != null">{{ periodo }}</p>
                </div>
            </div>
        </div>
        <div class="col-md-3 mt-3 mt-md-0">
            <div class="card top-random text-success bg-white shadow-sm">
                <div class="card-body">
                    <span>Asociados</span>
                    <p v-if="asociados != null">{{ asociados }}</p>
                </div>
            </div>
        </div>
        <div class="col-md-3 mt-3 mt-md-0">
            <div class="card top-primary text-primary bg-white shadow-sm">
                <div class="card-body">
                    <span>Ingresos de hoy</span>
                    <p v-if="ingresos != null">S/ {{ ingresos }}</p>
                </div>
            </div>
        </div>
        <div class="col-md-3 mt-3 mt-md-0 mb-3">
            <div class="card top-info text-info bg-white shadow-sm">
                <div class="card-body">
                    <span>Egresos de hoy</span>
                    <p v-if="egresos != null">S/ {{ egresos }}</p>
                </div>
            </div>
        </div>
    </div> -->
</template>

<style>
.image-unsm, .image-fcs {
    /* background-image: url('../logo-fcs.png'); */
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
    /* filter: drop-shadow(0 2px 5px rgba(25, 135, 84, 0.4)); */
    height: 350px;
    opacity: 0.856;
}

/* .image-unsm {
    background-image: url('../logo-unsm.png');
} */

.image-fcs {
    background-image: url('../logo-fcs.png');
}
p {
    font-size: 1.5rem;
    font-weight: 600;
}
</style>
