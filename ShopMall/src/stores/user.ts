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
            const login = async (account: string, password: string, redirect: string) => {
                if (!redirect) {
                    redirect = '/'
                }
                const userList = [
                    { id: 1, account: 'admin', password: 'admin'},
                    { id: 2, account: 'Kriz', password: '1234'},
                ];

                try {
                    const targetMember = userList.find(user => user.account === account && user.password === password);
                    if (targetMember) {
                        const user = {account: account, password: password, token: 'fake-jwt-token'};
                        userData.data = user;
                        // store user details and jwt in local storage to keep user logged in between page refreshes
                        localStorage.setItem('user', JSON.stringify(user));
                        await router.push({path: redirect});
                    } else {
                        throw 'Username or password is incorrect'
                    }
                } catch (error) {
                    alert(error);
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
