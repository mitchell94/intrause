<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import Swal from 'sweetalert2'

let router = useRouter()
let route = useRoute()

let url = import.meta.env.VITE_API_URL

const logoUnsm = 'logo-unsm.png'
const logoFcs = 'logo-fcs.png'

let user = ref('')
let pass = ref('')

let login = async () => {
    try {
        let response = await fetch(url + '/intranet/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user: user.value,
                pass: pass.value
            })
        })
        let responseData = await response.json()
        if (responseData.message === 'Access') {
            localStorage.setItem('use', JSON.stringify(responseData.token))
            router.push({ name: 'welcome' })
        } else {
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: 'Datos incorrectos',
                showConfirmButton: false,
                timer: 1000
            })
        }
    } catch (error) {
        Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: 'Datos incorrectos',
            showConfirmButton: false,
            timer: 1000
        })
    }

    user.value = ''
    pass.value = ''
}

// Recargar la pagina para refrescar router
let reloadPage = () => {
    if (route.params.reload) {
        router.go()
    }
}
onMounted(() => {
    reloadPage()
})
</script>

<template>
    <div class="container-fluid back-login">
        <div class="row">
            <div class="col-3 mt-3 d-flex justify-content-end">
                <div>
                    <img :src="logoUnsm" alt="" width="128" height="128" />
                </div>
            </div>
            <div class="col-6 mt-3">
                <div class="mb-1 d-flex justify-content-center">
                    <h2>UNIVERSIDAD NACIONAL DE SAN MARTÍN</h2>
                </div>
                <div class="mb-1 d-flex justify-content-center">
                    <h4>FACULTAD DE CIENCIAS DE LA SALUD</h4>
                </div>
                <div class="mb-1 d-flex justify-content-center">
                    <h3>UNIDAD DE SEGUNDA ESPECIALIDAD</h3>
                </div>
            </div>
            <div class="col-3 mt-3 d-flex justify-content-start">
                <div>
                    <img :src="logoFcs" alt="" width="128" height="128" />
                </div>
            </div>
        </div>

        <div class="row justify-content-center">
            <div class="col-md-4 col-lg-3 px-4 px-md-0 mt-md-5 mt-3">
                <div class="card mb-3 bg-transparent">
                    <div class="card-body">
                        <div class="mb-3 d-flex justify-content-center">
                            <h1>USE</h1>
                        </div>
                        <div class="mb-3">
                            <label class="form-label"> Usuario </label>
                            <input type="text" class="form-control" v-model="user" />
                        </div>
                        <div class="mb-3">
                            <label class="form-label"> Contraseña </label>
                            <input type="password" class="form-control" v-model="pass" />
                        </div>
                        <button type="button" class="btn btn-primary w-100" @click="login">
                            Ingresar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.back-login {
    background-image: linear-gradient(to bottom, #6d0339, #b60b4d);
    color: white;
    font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
    font-weight: bold;
    width: 100%;
    min-height: 100%;
}

.bg-transparent {
    background-color: rgba(255, 255, 255, 0.1) !important;
    border: none;
    box-shadow: 0 0 3px white;
    color: white;
}
</style>
