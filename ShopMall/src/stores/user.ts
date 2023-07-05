import {defineStore} from "pinia";
import {computed, reactive} from "vue";
import router from "@/router";

export const useUser =
    defineStore('user',
        () => {
            const existsUserData: string | null = localStorage.getItem('user');
            const userData = reactive({data: existsUserData ? JSON.parse(existsUserData) : null});
            const isLogin = computed(() => userData.data !== null);
            const user = computed(() => userData.data);
            const login = async (username: string, password: string, redirect: string) => {
                try {
                    //const user = await fetchWrapper.post(`${baseUrl}/authenticate`, { username, password });
                    const user = {id: 1, name: 'Kriz', account: username, password: password, token: 'fake-jwt-token'};
                    // update pinia state
                    userData.data = user;
                    // store user details and jwt in local storage to keep user logged in between page refreshes
                    localStorage.setItem('user', JSON.stringify(user));
                    await router.push({path: redirect});
                } catch (error) {
                }
            };

            const logout = async () => {
                console.log('logout');
                userData.data = null;
                localStorage.removeItem('user');
                await router.push('/login');
            }

            return {
                user,
                isLogin,
                login,
                logout,
            }
        }
    );
