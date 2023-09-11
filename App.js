import React, { useState, useEffect, Alert } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { API_KEY } from '@env';


const myHeaders = new Headers();
myHeaders.append("apikey", API_KEY);

const requestOptions = {
  method: 'GET',
  redirect: 'follow',
  headers: myHeaders
};

export default function App() {


  const [convertedResult, setConvertedResult] = useState('');
  const [currencySymbols, setCurrencySymbols] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState('');
  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    fetch("https://api.apilayer.com/exchangerates_data/symbols", requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result); 
        setCurrencySymbols(Object.keys(result.symbols));
      })
      .catch(error => console.log('error', error));
  }, []);

  const convertCurrency = () => {
    const url = `https://api.apilayer.com/exchangerates_data/convert?to=EUR&from=${selectedCurrency}&amount=${keyword}`; 

    fetch(url, requestOptions)
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setConvertedResult(parseFloat(data.result).toFixed(2));
        } else {
          Alert.alert('Error', 'Unable to convert currency.');
        }
      })
      .catch(error => {
        console.log('error', error);
        Alert.alert('Error', error.message);
      });
  }

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={require('./assets/eurocoin.jpg')}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
      <View style={styles.resultContainer}>
        <Text style={styles.resultText}>
          {convertedResult ? `${convertedResult} €` : ''}
        </Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder='amount'
          value={keyword}
          onChangeText={text => setKeyword(text)}
        />
        <Picker
          style={styles.picker}
          selectedValue={selectedCurrency}
          onValueChange={(itemValue) => setSelectedCurrency(itemValue)}
        >
          {
            currencySymbols.map(code => (
              <Picker.Item key={code} label={code} value={code} />
            ))
          }
        </Picker>
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Convert" onPress={convertCurrency} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 20,
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  input: {
    fontSize: 18,
    width: 100,  
    padding: 10,
  },
  picker: {
    width: 120, 
    height: 50,
  },
  buttonContainer: {
    width: 80,  
    alignSelf: 'center',
    marginTop: 20,
  },
  resultContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  resultText: {
    fontSize: 24,
    color: 'black',
  },
  imageContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  image: {
    width: 150, 
    height: 150,
  },
});