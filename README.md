# AtividadeDDM2.1

context.js
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




ChatList.js
Este é um componente React Native chamado ChatList que: Recebe via props dois dados: users, que é uma lista de usuários com quem o usuário atual pode estar em conversa; e currentUser que são informações do usuário atual. Usa o useRouter do expo-router para possibilitar a navegação entre telas. Renderiza uma lista (FlatList) de usuários onde cada usuário é renderizado por meio do componente ChatItem, e o último item da lista recebe a propriedade noBorder, provavelmente usada para estilização.
Além disso, ele possui alguns detalhes de estilização, como o container é flexível (flex-1) para ocupar todo o espaço disponível; a FlatList tem paddingVertical de 25 para espaçamento interno; e a barra de rolagem vertical é escondida


Boas Práticas Utilizadas:
Uso correto do FlatList: ideal para renderizar listas grandes de forma otimizada no React Native.
Separação de responsabilidades: ChatItem é um componente separado, respeitando o princípio de componentes reutilizáveis.
Uso do useRouter do Expo Router: permite navegação programática e facilita redirecionamentos.
Estilização consistente: usa className="flex-1" provavelmente via TailwindCSS para React Native (como tailwind-rn ou nativewind).


Como o código poderia ser refatorado para maior escalabilidade:
Atualmente a chave (key) dos itens da lista é gerada usando Math.random(), isso faz com que o React não consiga identificar corretamente cada item.
Idealmente, cada usuário deve ter um identificador único (id, uid, email ou algo do tipo). Então o keyExtractor deve ser:
keyExtractor={item => item.id.toString()}
Se item.id não existir, é necessario garantir um campo único no objeto item.

Caso users esteja vazio, poderia haver uma renderização alternativa para indicar que não há chats disponíveis.
Por exemplo: 
<FlatList
  ...
  ListEmptyComponent={() => (
    <View className="flex-1 justify-center items-center">
      <Text>Nenhum chat disponível</Text>
    </View>
  )}
/>

O router é passado do ChatList para cada ChatItem. Uma alternativa mais limpa poderia ser que cada ChatItem internamente use useRouter, evitando passar roteador via props.
const router = useRouter();

Se a lista de usuários for muito grande, pode ser interessante limitar a quantidade inicial de itens renderizados para evitar travamentos:
<FlatList
  ...
  initialNumToRender={10} 
/>




ChatRoomHeader.js
Explicação do Funcionamento do Código:
Este componente ChatRoomHeader é usado para customizar o cabeçalho da tela de chat usando o expo-router (Stack.Screen); além disso ele configura opções específicas do header como:
title: vazio (''), então o título padrão da tela é omitido;
headerShadowVisible: false para remover a sombra sob o header;
headerLeft: um botão de voltar (chevron-left) que chama router.back() para navegar para a tela anterior, onde junto dele, é exibido o avatar do usuário (user.profileUrl) e o nome (user.username).
headerRight: Dois ícones (call e videocam) indicando ações de chamada de voz ou vídeo (apesar de ainda não possuírem ação vinculada).

Outras características:
Usa expo-image para a imagem, que é mais eficiente que o <Image> padrão do React Native.
Usa responsividade de tamanhos com react-native-responsive-screen (hp e wp).
Utiliza Tailwind para estilização (className="...").


Boas Práticas Utilizadas:
Customização do Stack.Screen diretamente: ideal para controle fino do header no expo-router.
Uso de TouchableOpacity para ações de toque, respeitando o padrão de acessibilidade.
Responsividade: usando heightPercentageToDP e widthPercentageToDP para ajustar tamanhos de ícones e imagens conforme o tamanho da tela.
Componentização limpa: todo o header é definido em um único lugar de forma declarativa.
Adoção do expo-image: melhor performance para carregamento de imagens.
Estilização consistente com Tailwind.


Como o código poderia ser refatorado para maior escalabilidade:
Atualmente, ChatRoomHeader define diretamente o Stack.Screen, o que pode limitar se o header precisar ser mais dinâmico no futuro (por exemplo, mudar durante a conversa).
Uma prática melhor seria definir o header no arquivo da rota (chatroom.js, chat/[id].js, etc.) e deixar ChatRoomHeader como um simples componente visual (para reutilização, inclusive).
Por exemplo, no arquivo de rota:
import ChatRoomHeader from "@/components/ChatRoomHeader";

<Stack.Screen 
  options={{
    header: (props) => <ChatRoomHeader {...props} user={user} />
  }}
/>

Atualmente os ícones call e videocam estão apenas visuais. Para escalabilidade, seria eficiente já preparar as funções de navegação/ação:
<TouchableOpacity onPress={handleCall}>
  <Ionicons name="call" ... />
</TouchableOpacity>
<TouchableOpacity onPress={handleVideoCall}>
  <Ionicons name="videocam" ... />
</TouchableOpacity>

Para manter segurança e evitar erros, é possivel tipar o user e router.
ChatRoomHeader.propTypes = {
  user: PropTypes.object.isRequired,
  router: PropTypes.object.isRequired,
}





CustomMenuItems.js
Explicação do Funcionamento do Código:
Este componente MenuItem representa um item de menu dentro de um menu popup (react-native-popup-menu), quando o usuário clica no item (MenuOption), é executada a função action, passando value como argumento.
A estrutura visual possui um View contendo um Text para o rótulo (text), e um possível ícone (icon) que é passado como prop.
Já na estilização é utilizado Tailwind (className) para controle de padding (px-4 py-1) e alinhamento (flex-row, justify-between, items-center), além da responsividade (heightPercentageToDP) para definir o tamanho da fonte (fontSize: hp(1.7)).


Boas Práticas Utilizadas:
Componentização: MenuItem é separado como componente isolado e reutilizável.
Responsividade: Usa medidas relativas (hp) para adaptar o tamanho da fonte a diferentes telas.
Uso correto do MenuOption: Integrado adequadamente ao react-native-popup-menu.
Código limpo e conciso: Clareza nas responsabilidades de cada elemento (ação + visual).
Boas práticas de acessibilidade: O MenuOption é interativo corretamente.


Como o código poderia ser refatorado para maior escalabilidade:
Atualmente text, action, value e icon são passados sem tipo ou validação.
Para previnir erros e facilitar a leitura e manutenção do componente é possivel:
import PropTypes from 'prop-types';

MenuItem.propTypes = {
  text: PropTypes.string.isRequired,
  action: PropTypes.func.isRequired,
  value: PropTypes.any.isRequired,
  icon: PropTypes.node,
}

Atualmente icon é esperado, mas não é obrigatório, Seria eficiente garantir que o layout fique consistente mesmo sem o ícone:
<View className="px-4 py-1 flex-row justify-between items-center">
  <Text style={{ fontSize: hp(1.7) }} className="font-semibold text-neutral-600">
    {text}
  </Text>
  {icon ? icon : <View style={{ width: hp(2) }} />} {      }
  </View>

Para melhorar ainda mais  a acessibilidade, pode adicionar accessible e accessibilityLabel:
<MenuOption 
  onSelect={() => action(value)}
  accessible={true}
  accessibilityLabel={text}
>
