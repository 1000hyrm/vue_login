<template>
    <div class="app">
        <div v-if="state.account.id"> <!--id값이 들어오게 되면-->
            <p>안녕하세요 {{state.account.name}}님</p>
            <button @click="logout()">로그아웃</button>
        </div>
        <div v-else> <!--id값이 없다면 로그인 창이 뜸-->
            <label for="loginId">
                <span>아이디 </span>
                <input type="text" id="loginId" v-model="state.form.loginId"> <!--state의 form정보를 model로 입력 받음-->
            </label>
            <br>
            <label for="loginPW">
                <span>패스워드 </span>
                <input type="password" id="loginPW" v-model="state.form.loginPW">
            </label>
            <hr>
            <button @click="submit()">로그인</button> <!--submit을 함-->
        </div>
    </div>
</template>

<script>
import axios from "axios";
import {reactive} from "vue";
export default{
    setup(){
        const state = reactive({
            account:{
                id: null,
                name: ""
            },
            form:{
                loginId: "",
                loginPW: ""
            }
        });

        const submit = () => { //submit 하면
            const args = {
                loginId: state.form.loginId,
                loginPW: state.form.loginPW,
            };
            //axios post로 인자 값을 보냄
            axios.post("/api/account", args).then((res) => { //성공하면
                alert("로그인에 성공했습니다."); 
                state.account = res.data; //결과값을 state.account에 넣음
            })
            .catch(() => { //실패하면
                alert("로그인에 실패했습니다.");
            });
        };

        const logout = () => { //로그아웃을 누르면
            axios.delete("/api/account").then(()=>{ //delete 메서드를 통해 account창에 url을 던져주고
                alert("로그아웃 되었습니다.");
                state.account.id = null; //값을 비워줌
                state.account.name = "";
            });
        };

        axios.get("/api/account").then((res)=>{ //처음 접속했을 때 api get 방식으로 통신
            state.account = res.data; //성공하면 state.account에 데이터 값을 넣어줌
        });

        return {state, submit, logout};
    }
};
</script>

<style>
    button {
        background-color: skyblue;
        zoom: 1.2;
        border: 0;
        outline: 0;
    }
    label {
        color: black;
        font-weight: bold;
        display: block; 
    }
    input {
        background-color: whitesmoke;
    }
</style>