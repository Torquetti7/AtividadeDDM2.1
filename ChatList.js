import { View, Text, FlatList } from 'react-native'
import React from 'react'
import ChatItem from './ChatItem'
import { useRouter } from 'expo-router'

export default function ChatList({users, currentUser}) {
    const router = useRouter();
  return (
    <View className="flex-1">
      <FlatList
        data={users}
        contentContainerStyle={{flex: 1, paddingVertical: 25}}
        keyExtractor={item=> Math.random()}
        showsVerticalScrollIndicator={false}
        renderItem={({item, index})=> <ChatItem 
            noBorder={index+1 == users.length} 
            router={router} 
            currentUser={currentUser}
            item={item} 
            index={index} 
        />}
       />
    </View>
  )
}

/*
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
*/