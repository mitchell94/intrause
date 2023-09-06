import { createRouter, createWebHistory } from 'vue-router'
import * as jose from 'jose'

import LoginView from '../views/LoginView.vue'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'login',
            component: LoginView
        },
        {
            path: '/home',
            component: HomeView,
            children: [
                {
                    path: '/home',
                    name: 'welcome',
                    component: () => import('../views/WelcomeView.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    path: '/marks',
                    name: 'marks',
                    component: () => import('../views/MarkView.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    path: '/payments',
                    name: 'payments',
                    component: () => import('../views/PaymentView.vue'),
                    meta: { requiresAuth: true }
                }
            ]
        }
    ]
})

router.beforeEach((to) => {
    // Si ya existe un token, redirigir al welcome
    if (to.name == 'login') {
        if (localStorage.getItem('use')) {
            router.push({ name: 'welcome' })
        }
    }
    // Comprobar la existencia y validez del token
    if (to.meta.requiresAuth) {
        if (!localStorage.getItem('use')) {
            router.push({ name: 'login' })
        } else {
            validateToken()
        }
    }
})

// verificar la validez de un token
async function validateToken() {
    try {
        let token = JSON.parse(localStorage.getItem('use'))
        let secret = new TextEncoder().encode('mysecretkey')
        await jose.jwtVerify(token, secret)
    } catch (error) {
        localStorage.removeItem('use')
        router.push({ name: 'login' })
    }
}

export default router
