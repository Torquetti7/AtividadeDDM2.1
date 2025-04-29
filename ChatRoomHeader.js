import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { Entypo, Ionicons } from '@expo/vector-icons'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Image } from 'expo-image';

export default function ChatRoomHeader({user, router}) {
  return (
    <Stack.Screen
        options={{
            title: '',
            headerShadowVisible: false,
            headerLeft: ()=>(
                <View className="flex-row items-center gap-4">
                    <TouchableOpacity onPress={()=> router.back()}>
                        <Entypo name="chevron-left" size={hp(4)} color="#737373" />
                    </TouchableOpacity>
                    <View className="flex-row items-center gap-3">
                        <Image 
                            source={user?.profileUrl}
                            style={{height: hp(4.5), aspectRatio: 1, borderRadius: 100}}
                        />
                        <Text style={{fontSize: hp(2.5)}} className="text-neutral-700 font-medium">
                            {user?.username}
                        </Text>
                    </View>
                </View>
            ),
            headerRight: ()=>(
                <View className="flex-row items-center gap-8">
                    <Ionicons name="call" size={hp(2.8)} color={'#737373'} />
                    <Ionicons name="videocam" size={hp(2.8)} color={'#737373'} />
                </View>
            )
        }}
    />
  )
}

/*
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

*/