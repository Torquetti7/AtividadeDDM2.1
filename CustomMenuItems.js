import { Text, View } from 'react-native';
import {
    MenuOption,
  } from 'react-native-popup-menu';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export const MenuItem = ({text, action, value, icon})=>{
    return (
        <MenuOption onSelect={()=> action(value)}>
            <View className="px-4 py-1 flex-row justify-between items-center">
                <Text style={{fontSize: hp(1.7)}} className="font-semibold text-neutral-600">
                    {text}
                </Text>
                {icon}
            </View>
        </MenuOption>
    )
}

/*
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

*/