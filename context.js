import { createContext, useContext, useEffect, useState } from "react";
import {onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut} from 'firebase/auth';
import { auth, db } from "../firebaseConfig";
import {doc, getDoc, setDoc} from 'firebase/firestore'

export const AuthContext = createContext();

export const AuthContextProvider = ({children})=>{
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(undefined);


    useEffect(()=>{
        const unsub = onAuthStateChanged(auth, (user)=>{
            // console.log('got user: ', user);
            if(user){
                setIsAuthenticated(true);
                setUser(user);
                updateUserData(user.uid);
            }else{
                setIsAuthenticated(false);
                setUser(null);
            }
        });
        return unsub;
    },[]);

    const updateUserData = async (userId)=>{
        const docRef = doc(db, 'users', userId);
        const docSnap = await getDoc(docRef);

        if(docSnap.exists()){
            let data = docSnap.data();
            setUser({...user, username: data.username, profileUrl: data.profileUrl, userId: data.userId})
        }
    }

    const login = async (email, password)=>{
        try{
            const response = await signInWithEmailAndPassword(auth, email, password);
            return {success: true};
        }catch(e){
            let msg = e.message;
            if(msg.includes('(auth/invalid-email)')) msg='E-mail inválido'
            if(msg.includes('(auth/invalid-credential)')) msg='E-mail ou Senha errada'
            return {success: false, msg};
        }
    }
    const logout = async ()=>{
        try{
            await signOut(auth);
            return {success: true}
        }catch(e){
            return {success: false, msg: e.message, error: e};
        }
    }
    const register = async (email, password, username, profileUrl)=>{
        try{
            const response = await createUserWithEmailAndPassword(auth, email, password);
            console.log('response.user :', response?.user);

            // setUser(response?.user);
            // setIsAuthenticated(true);

            await setDoc(doc(db, "users", response?.user?.uid),{
                username, 
                profileUrl,
                userId: response?.user?.uid
            });
            return {success: true, data: response?.user};
        }catch(e){
            let msg = e.message;
            if(msg.includes('(auth/invalid-email)')) msg='E-mail inválido'
            if(msg.includes('(auth/email-already-in-use)')) msg='Esse e-mail já está em uso'
            return {success: false, msg};
        }
    }

    return (
        <AuthContext.Provider value={{user, isAuthenticated, login, register, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = ()=>{
    const value = useContext(AuthContext);

    if(!value){
        throw new Error('useAuth must be wrapped inside AuthContextProvider');
    }
    return value;
}

/*
Explicação do Funcionamento do Código:
Esse código implementa um contexto de autenticação (AuthContext) usando React + Firebase
AuthContext é criado para armazenar e compartilhar informações sobre o usuário autenticado em toda a aplicação React.
AuthContextProvider é um componente que: usa useState para armazenar o user (informações do usuário) e isAuthenticated (booleano de autenticação); e usa useEffect para escutar mudanças no estado de autenticação do Firebase com onAuthStateChanged. Quando o usuário muda (logado/deslogado): Atualiza user e isAuthenticated e chama updateUserData para puxar mais dados do Firestore.

Funções auxiliares:
updateUserData: Busca informações adicionais do usuário no Firestore (username, profileUrl, userId) e atualiza o user no estado.
login: Faz login com email e senha via Firebase além de tratar erros e traduz mensagens específicas.
logout: Faz logout usando Firebase.
register: Cadastra um novo usuário no Firebase Auth e cria um documento no Firestore para armazenar username, profileUrl, e userId.
useAuth: Hook customizado para acessar o contexto (AuthContext) de forma segura.


Boas Práticas Utilizadas:
Uso de Context API para gerenciar autenticação globalmente, evitando props drilling.
Separação clara de responsabilidades: autenticação e gerenciamento de dados adicionais do usuário.
Utilização de hooks (useState, useEffect) de forma correta.
Mensagens de erro mais amigáveis para o usuário final.
Unsubscribe no useEffect: evita vazamento de memória ao desmontar o componente.
Encapsulamento da lógica em funções (login, register, logout) para reutilização e clareza.
Fallback de segurança no useAuth para garantir que o hook só seja usado dentro do provider.


Como o código poderia ser refatorado para maior escalabilidade:
No updateUserData, o user passado pode estar desatualizado naquele momento, pois o setUser depende do estado anterior.
Ele pode ser feratorado da seguinte forma:
setUser(prevUser => ({
    ...prevUser,
    username: data.username,
    profileUrl: data.profileUrl,
    userId: data.userId
}));

Atualmente a tradução dos erros está repetida em login e register. 
Seria possivel centralizar:
const parseFirebaseError = (errorMessage) => {
    if(errorMessage.includes('(auth/invalid-email)')) return 'E-mail inválido';
    if(errorMessage.includes('(auth/invalid-credential)')) return 'E-mail ou Senha errada';
    if(errorMessage.includes('(auth/email-already-in-use)')) return 'Esse e-mail já está em uso';
    return 'Erro desconhecido';
}
E usar
catch(e) {
    return { success: false, msg: parseFirebaseError(e.message) };
}

Atualmente isAuthenticated pode ser true, false ou undefined, mas o front-end teria que tratar esse estado.
Uma opção seria adicionar uma flag de loading para melhorar controle de fluxos de loading/spinner, etc.
const [loading, setLoading] = useState(true);
useEffect(()=>{
    const unsub = onAuthStateChanged(auth, (user)=>{
        if(user){
            setUser(user);
            setIsAuthenticated(true);
            updateUserData(user.uid);
        } else {
            setUser(null);
            setIsAuthenticated(false);
        }
        setLoading(false);
    });
    return unsub;
},[]);
E expor loading no Provider:
<AuthContext.Provider value={{user, isAuthenticated, loading, login, register, logout}}>

*/