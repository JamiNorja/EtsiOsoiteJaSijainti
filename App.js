import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TextInput, Button, Keyboard, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

export default function App() {
  const initial = {
    latitude: 60.200692,
    longitude: 24.934302,
    latitudeDelta: 0.0322,
    longitudeDelta: 0.221
  }

  const [region, setRegion] = useState(initial);
  const [address, setAddress] = useState('');

  useEffect(() => {
    const fetchLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('No permission to access location');
      }else {
        try {
          let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
          console.log(location)
          setRegion({ ...region, latitude: location.coords.latitude, longitude: location.coords.longitude });
        } catch (error) {
          console.log(error.message);
        }
      }
    }
    fetchLocation();
  }, []);

  const fetchCoordinates = (address) => {
    const KEY = process.env.EXPO_PUBLIC_MAPQUEST_API_KEY;
    const url = `https://www.mapquestapi.com/geocoding/v1/address?key=${KEY}&location=${address}`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        const { lat, lng } = data.results[0].locations[0].latLng;
        setRegion({ ...region, latitude: lat, longitude: lng })
      })
      .catch(error => console.error('API call failed', error.message))

    Keyboard.dismiss();
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
      >
        <Marker coordinate={region} />
      </MapView>
      <View style={styles.search}>
        <TextInput
          style={{ fontSize: 18, width: 200 }}
          placeholder='Hae'
          value={address}
          onChangeText={text => setAddress(text)}
        />
        <Button title="Show" onPress={() => fetchCoordinates(address)} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    flex: 1,
    width: "100%",
    height: "100%"
  },
  search: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  }
});