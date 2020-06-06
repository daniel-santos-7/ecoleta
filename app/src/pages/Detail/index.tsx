import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Text, SafeAreaView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Feather as Icon, FontAwesome } from '@expo/vector-icons';
import { RectButton } from 'react-native-gesture-handler';
import api, { baseURL } from '../../services/api';
import * as MailComposer from 'expo-mail-composer';
import { Linking } from 'expo';

interface RouteParams {
  id: number;
}

interface Point {
  id: number;
  name: string;
  image: string;
  email: string;
  whatsapp: string;
  city: string;
  uf: string;
  items: {
    title: string;
  }[]
}

export default function Detail() {

  const navigation = useNavigation();

  const route = useRoute();

  const routeParams = route.params as RouteParams;

  function handleNavigateBack():void {
    navigation.goBack();
  }

  function handleComposeMail() {
    MailComposer.composeAsync({
      subject: 'Interesse na coleta de resíduos',
      recipients: [point.email]
    });
  }

  function handleWhatsapp() {
    Linking.openURL(`whatsapp://send?phone=${point.whatsapp}&text=tenho interesse na coleta de resíduos`)
  }

  const [point, setPoint] = useState<Point>({} as Point);

  useEffect(()=> {

    api.get<Point>(`point/${routeParams.id}`).then(resp=> {

      setPoint(resp.data);

    });

  },[]);

  if(!point || !point.items) {
  
    return null;
  
  }

  return(
    <SafeAreaView style={{flex:1}}>
    <View style={styles.container}>
      <TouchableOpacity onPress={handleNavigateBack}>
                <Icon name="arrow-left" size={20} color="#34cb79"/>
      </TouchableOpacity>
      <Image style={styles.pointImage} source={{uri: `${baseURL}/uploads/${point.image}`}}/>
      <Text style={styles.pointName}>{point.name}</Text>
      <Text style={styles.pointItems}>{point.items.map(item=> item.title).join(', ')}</Text>
      <View style={styles.container}>
        <Text style={styles.addressTitle}>Endereço</Text>
        <Text style={styles.addressContent}>{point.city} / {point.uf}</Text>
      </View>
      <View style={styles.footer}>
        <RectButton style={styles.button} onPress={handleWhatsapp}>
          <FontAwesome name="whatsapp" size={20} color="#FFF"/>
          <Text style={styles.buttonText}>Whatsapp</Text>
        </RectButton>
        <RectButton style={styles.button} onPress={handleComposeMail}>
          <Icon name="mail" size={20} color="#FFF"/>
          <Text style={styles.buttonText}>E-Mail</Text>
        </RectButton>
      </View>
    </View>
    </SafeAreaView>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    paddingTop: 20,
  },

  pointImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
    borderRadius: 10,
    marginTop: 32,
  },

  pointName: {
    color: '#322153',
    fontSize: 28,
    fontFamily: 'Ubuntu_700Bold',
    marginTop: 24,
  },

  pointItems: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 16,
    lineHeight: 24,
    marginTop: 8,
    color: '#6C6C80'
  },

  address: {
    marginTop: 32,
  },
  
  addressTitle: {
    color: '#322153',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  },

  addressContent: {
    fontFamily: 'Roboto_400Regular',
    lineHeight: 24,
    marginTop: 8,
    color: '#6C6C80'
  },

  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#999',
    paddingVertical: 20,
    paddingHorizontal: 32,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  
  button: {
    width: '48%',
    backgroundColor: '#34CB79',
    borderRadius: 10,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    marginLeft: 8,
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Roboto_500Medium',
  },
});