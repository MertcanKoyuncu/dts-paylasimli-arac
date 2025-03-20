import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput,
  Dimensions,
  Modal,
  FlatList,
  Image,
  StatusBar
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

const INITIAL_REGION = {
  latitude: 41.0082,  // İstanbul'un koordinatları
  longitude: 28.9784,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

const VEHICLE_TYPES = [
  { id: '1', name: 'Ekonomik', price: '₺20', image: require('../../assets/economy-car.png'), eta: '3 dk' },
  { id: '2', name: 'Konfor', price: '₺30', image: require('../../assets/comfort-car.png'), eta: '5 dk' },
  { id: '3', name: 'Premium', price: '₺50', image: require('../../assets/premium-car.png'), eta: '8 dk' },
];

const HomeScreen = () => {
  const [region, setRegion] = useState(INITIAL_REGION);
  const [location, setLocation] = useState(null);
  const [destination, setDestination] = useState('');
  const [bookingModalVisible, setBookingModalVisible] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(VEHICLE_TYPES[0]);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Konum izni verilmedi!');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      
      setLocation(location);
      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
    })();
  }, []);

  const handleBookVehicle = () => {
    // Araç çağırma işlemleri burada yapılacak
    setBookingModalVisible(false);
    router.push({
      pathname: '/ride',
      params: { 
        vehicle: JSON.stringify(selectedVehicle), 
        destination 
      }
    });
  };

  const renderVehicleItem = ({ item }) => (
    <TouchableOpacity 
      style={[
        styles.vehicleItem, 
        selectedVehicle.id === item.id && styles.selectedVehicleItem
      ]}
      onPress={() => setSelectedVehicle(item)}
    >
      <Image source={item.image} style={styles.vehicleImage} />
      <View style={styles.vehicleInfo}>
        <Text style={styles.vehicleName}>{item.name}</Text>
        <Text style={styles.vehicleEta}>{item.eta}</Text>
      </View>
      <Text style={styles.vehiclePrice}>{item.price}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Harita */}
      <MapView
        style={styles.map}
        region={region}
        showsUserLocation
        showsMyLocationButton
      >
        {location && (
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude
            }}
            title="Konumunuz"
          />
        )}
      </MapView>
      
      {/* Üst menü */}
      <View style={styles.headerContainer}>
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={() => router.push('/profile')}
        >
          <Ionicons name="person" size={24} color="#333" />
        </TouchableOpacity>
      </View>
      
      {/* Alt panel */}
      <View style={styles.bottomContainer}>
        <Text style={styles.welcomeText}>Nereye gitmek istersiniz?</Text>
        
        <View style={styles.searchContainer}>
          <View style={styles.currentLocationContainer}>
            <Ionicons name="location" size={24} color="#FF5E3A" />
            <Text style={styles.currentLocationText}>Mevcut Konum</Text>
          </View>
          
          <View style={styles.destinationContainer}>
            <TextInput
              style={styles.destinationInput}
              placeholder="Nereye?"
              value={destination}
              onChangeText={setDestination}
            />
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.bookButton}
          onPress={() => setBookingModalVisible(true)}
          disabled={!destination}
        >
          <Text style={styles.bookButtonText}>ARAÇ ÇAĞIR</Text>
        </TouchableOpacity>
      </View>

      {/* Araç seçim modalı */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={bookingModalVisible}
        onRequestClose={() => setBookingModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Araç Seçin</Text>
              <TouchableOpacity onPress={() => setBookingModalVisible(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={VEHICLE_TYPES}
              renderItem={renderVehicleItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
            />
            
            <TouchableOpacity 
              style={styles.confirmButton}
              onPress={handleBookVehicle}
            >
              <Text style={styles.confirmButtonText}>ONAYLA</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    width,
    height,
    ...StyleSheet.absoluteFillObject,
  },
  headerContainer: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1,
  },
  profileButton: {
    backgroundColor: '#fff',
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  searchContainer: {
    marginBottom: 20,
  },
  currentLocationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  currentLocationText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  destinationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  destinationInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  bookButton: {
    backgroundColor: '#FF5E3A',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    height: height * 0.6,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  vehicleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  selectedVehicleItem: {
    backgroundColor: '#f0f0f0',
  },
  vehicleImage: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  vehicleInfo: {
    flex: 1,
    marginLeft: 15,
  },
  vehicleName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  vehicleEta: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  vehiclePrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  confirmButton: {
    backgroundColor: '#FF5E3A',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen; 