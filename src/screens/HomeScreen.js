import React, { useState, useEffect, useRef } from 'react';
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
  StatusBar,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
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
  { id: '1', name: 'Ekonomik', price: '15', image: require('../../assets/economy-car.png'), eta: '3 dk' },
  { id: '2', name: 'Konfor', price: '20', image: require('../../assets/comfort-car.png'), eta: '5 dk' },
  { id: '3', name: 'Premium', price: '25', image: require('../../assets/premium-car.png'), eta: '8 dk' },
];

// Google API Key - gerçek bir projede güvenlik için environment variables kullanılmalıdır
const GOOGLE_API_KEY = 'AIzaSyA9LYzXVYuU4PRofmRKgqVn1nzB_y3-YB4';

const HomeScreen = () => {
  const [region, setRegion] = useState(INITIAL_REGION);
  const [location, setLocation] = useState(null);
  const [currentLocation, setCurrentLocation] = useState('');
  const [destination, setDestination] = useState('');
  const [bookingModalVisible, setBookingModalVisible] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(VEHICLE_TYPES[0]);
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const [suggestions, setSuggestions] = useState([]);
  const [isSuggestingFor, setIsSuggestingFor] = useState(null); // 'origin' veya 'destination'
  const [originCoords, setOriginCoords] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const debounceTimer = useRef(null);
  const mapRef = useRef(null);

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
      setOriginCoords({ latitude, longitude });
      
      // Mevcut konum adresini al
      try {
        const addressResponse = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_API_KEY}`
        );
        const addressData = await addressResponse.json();
        if (addressData.results && addressData.results.length > 0) {
          setCurrentLocation(addressData.results[0].formatted_address);
        }
      } catch (error) {
        console.error('Adres getirme hatası:', error);
        setCurrentLocation('Mevcut Konum');
      }
    })();
  }, []);

  // Yer aramayı işle (otomatik tamamlama)
  const handlePlaceSearch = (text, type) => {
    if (type === 'origin') {
      setCurrentLocation(text);
      setIsSuggestingFor('origin');
    } else {
      setDestination(text);
      setIsSuggestingFor('destination');
    }
    
    // Debounce işlemi - yazma bittikten 500ms sonra işlemi yap
    clearTimeout(debounceTimer.current);
    
    if (text.length > 2) {
      debounceTimer.current = setTimeout(() => {
        // Tamamen yerel test verileri kullan
        const suggestions = [
          { place_id: 'test1', description: 'Ankara, Türkiye' },
          { place_id: 'test2', description: 'İstanbul, Türkiye' },
          { place_id: 'test3', description: 'İzmir, Türkiye' },
          { place_id: 'test4', description: 'Antalya, Türkiye' },
          { place_id: 'test5', description: 'Bursa, Türkiye' }
        ].filter(item => 
          item.description.toLowerCase().includes(text.toLowerCase())
        );
        
        setSuggestions(suggestions);
      }, 300);
    } else {
      setSuggestions([]);
    }
  };
  
  // Seçilen öneriyi işle
  const handleSelectSuggestion = async (placeId) => {
    try {
      // Test verileriyle çalış
      let lat, lng, address;
      
      if (placeId === 'test1') {
        // Ankara
        lat = 39.9334;
        lng = 32.8597;
        address = 'Ankara, Türkiye';
      } else if (placeId === 'test2') {
        // İstanbul
        lat = 41.0082;
        lng = 28.9784;
        address = 'İstanbul, Türkiye';
      } else if (placeId === 'test3') {
        // İzmir
        lat = 38.4237;
        lng = 27.1428;
        address = 'İzmir, Türkiye';
      } else if (placeId === 'test4') {
        // Antalya
        lat = 36.8969;
        lng = 30.7133;
        address = 'Antalya, Türkiye';
      } else if (placeId === 'test5') {
        // Bursa
        lat = 40.1885;
        lng = 29.0610;
        address = 'Bursa, Türkiye';
      } else {
        // Varsayılan - İstanbul
        lat = 41.0082;
        lng = 28.9784;
        address = 'İstanbul, Türkiye';
      }
      
      const coords = { latitude: lat, longitude: lng };
      
      if (isSuggestingFor === 'origin') {
        setCurrentLocation(address);
        setOriginCoords(coords);
      } else {
        setDestination(address);
        setDestinationCoords(coords);
      }
      
      // Haritayı bu konuma odakla
      setRegion({
        latitude: lat,
        longitude: lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      
      setSuggestions([]);
      setIsSuggestingFor(null);
      
      // Her iki konum da seçilmişse mesafe ve süreyi hesapla
      if ((isSuggestingFor === 'origin' && destinationCoords) || 
          (isSuggestingFor === 'destination' && originCoords)) {
        calculateDistanceAndDuration();
      }
    } catch (error) {
      console.error('Yer detayı hatası:', error);
    }
  };

  // Mesafe ve süre hesapla
  const calculateDistanceAndDuration = async () => {
    if (!originCoords || !destinationCoords) return;
    
    setIsLoading(true);
    
    try {
      console.log("Hesaplama başlatılıyor:", originCoords, destinationCoords);
      
      // Şehirleri belirleme
      const city1 = getCity(originCoords.latitude, originCoords.longitude);
      const city2 = getCity(destinationCoords.latitude, destinationCoords.longitude);
      
      console.log("Şehirler:", city1, city2);
      
      // İki şehir arası mesafe tablosu (bilinen mesafeler)
      const knownDistances = {
        'Ankara_İstanbul': 450,
        'Ankara_İzmir': 600,
        'Ankara_Antalya': 500,
        'Ankara_Bursa': 380,
        'İstanbul_İzmir': 480,
        'İstanbul_Antalya': 700,
        'İstanbul_Bursa': 150,
        'İzmir_Antalya': 320,
        'İzmir_Bursa': 330,
        'Antalya_Bursa': 550
      };
      
      let calculatedDistance = 0;
      
      // Eğer iki şehir de belirlenebilirse sabit mesafeler kullan
      if (city1 && city2 && city1 !== city2) {
        // Şehir isimleri alfabetik sıraya göre key oluştur
        const key = [city1, city2].sort().join('_');
        console.log("Aranıyor:", key);
        
        if (knownDistances[key]) {
          calculatedDistance = knownDistances[key];
          console.log("Bilinen mesafe bulundu:", calculatedDistance);
        } else {
          // Bilinen bir mesafe yoksa Haversine formülünü kullan
          calculatedDistance = calculateHaversineDistance(
            originCoords.latitude, originCoords.longitude,
            destinationCoords.latitude, destinationCoords.longitude
          );
          console.log("Bilinen mesafe bulunamadı, hesaplanan:", calculatedDistance);
        }
      } else {
        // Her iki şehir de belirlenemezse Haversine formülünü kullan
        calculatedDistance = calculateHaversineDistance(
          originCoords.latitude, originCoords.longitude,
          destinationCoords.latitude, destinationCoords.longitude
        );
        console.log("Şehirler belirlenemedi, hesaplanan:", calculatedDistance);
      }
      
      // Mesafeyi km cinsinden ayarla
      setDistance(calculatedDistance);
      console.log("Mesafe ayarlandı:", calculatedDistance);
      
      // Seyahat süresini hesapla (ortalama 60 km/saat hız varsayımı)
      const estimatedDuration = calculatedDistance / 60 * 60;
      setDuration(estimatedDuration);
      console.log("Süre ayarlandı:", estimatedDuration);
      
      // Rota çizgisi oluştur
      createDirectRoute();
    } catch (error) {
      console.error('Mesafe hesaplama hatası:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Direkt rota çizgisi oluştur
  const createDirectRoute = () => {
    if (!originCoords || !destinationCoords) return;
    
    // İki nokta arasında direkt bir çizgi oluştur
    setRouteCoordinates([originCoords, destinationCoords]);
    
    // Haritayı rota genişliğine göre ayarla
    if (mapRef.current) {
      mapRef.current.fitToCoordinates([originCoords, destinationCoords], {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
    }
  };
  
  // Koordinatlara göre şehir belirleme - hassasiyeti artırıldı
  const getCity = (lat, lon) => {
    const cities = {
      'Ankara': [39.9334, 32.8597],
      'İstanbul': [41.0082, 28.9784],
      'İzmir': [38.4237, 27.1428],
      'Antalya': [36.8969, 30.7133],
      'Bursa': [40.1885, 29.0610]
    };
    
    // Daha geniş bir tolerans değeri kullan (0.5 derece)
    const tolerance = 0.5;
    
    for (const [city, coords] of Object.entries(cities)) {
      if (Math.abs(lat - coords[0]) < tolerance && Math.abs(lon - coords[1]) < tolerance) {
        return city;
      }
    }
    console.log("Şehir bulunamadı:", lat, lon);
    return null;
  };
  
  // Haversine formülü ile iki koordinat arası mesafe hesaplama (km)
  const calculateHaversineDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Dünya yarıçapı (km)
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    // Kuş uçuşu mesafenin 1.5 katını al (kara yolu mesafesi yaklaşık)
    return Math.max(Math.round(distance * 1.5), 10); // En az 10 km, yuvarlanmış değer
  };
  
  // Radyan dönüşümü
  const toRad = (value) => {
    return value * Math.PI / 180;
  };

  const handleBookVehicle = () => {
    // Araç çağırma işlemleri burada yapılacak
    setBookingModalVisible(false);
    
    // Km başına ücret hesaplama (15 TL/km)
    const farePerKm = 15;
    const baseFare = parseInt(selectedVehicle.price);
    const totalFare = baseFare + (distance * farePerKm);
    
    const vehicleData = {
      ...selectedVehicle,
      calculatedPrice: `₺${totalFare.toFixed(0)}`
    };
    
    router.push({
      pathname: '/ride',
      params: { 
        vehicle: JSON.stringify(vehicleData),
        destination,
        origin: currentLocation,
        distance: distance.toFixed(1)
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
      <View style={styles.priceContainer}>
        <Text style={styles.vehiclePrice}>₺{item.price} + (15 × {distance.toFixed(1)} km)</Text>
        <Text style={styles.totalPrice}>Toplam: ₺{(parseInt(item.price) + (distance * 15)).toFixed(0)}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Harita */}
      <MapView
        ref={mapRef}
        style={styles.map}
        region={region}
        showsUserLocation
        showsMyLocationButton
      >
        {originCoords && (
          <Marker
            coordinate={originCoords}
            title="Başlangıç"
            pinColor="blue"
          />
        )}
        
        {destinationCoords && (
          <Marker
            coordinate={destinationCoords}
            title="Varış"
            pinColor="red"
          />
        )}
        
        {routeCoordinates.length > 0 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeWidth={3}
            strokeColor="#FF5E3A"
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
            <TextInput
              style={styles.currentLocationInput}
              value={currentLocation}
              onChangeText={(text) => handlePlaceSearch(text, 'origin')}
              placeholder="Nereden?"
            />
          </View>
          
          <View style={styles.destinationContainer}>
            <Ionicons name="navigate" size={24} color="#333" />
            <TextInput
              style={styles.destinationInput}
              placeholder="Nereye?"
              value={destination}
              onChangeText={(text) => handlePlaceSearch(text, 'destination')}
            />
          </View>
          
          {suggestions.length > 0 && isSuggestingFor && (
            <View style={styles.suggestionsContainer}>
              <ScrollView style={styles.suggestionsList}>
                {suggestions.map((suggestion) => (
                  <TouchableOpacity
                    key={suggestion.place_id}
                    style={styles.suggestionItem}
                    onPress={() => handleSelectSuggestion(suggestion.place_id)}
                  >
                    <Ionicons name="location" size={18} color="#666" />
                    <Text style={styles.suggestionText}>
                      {suggestion.description}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
        
        {isLoading ? (
          <ActivityIndicator size="large" color="#FF5E3A" style={styles.loader} />
        ) : distance > 0 ? (
          <View style={styles.distanceInfoContainer}>
            <Text style={styles.distanceInfoText}>
              Mesafe: {distance.toFixed(1)} km | Süre: {Math.round(duration)} dakika
            </Text>
          </View>
        ) : null}
        
        <TouchableOpacity 
          style={[
            styles.bookButton, 
            (!destination || !currentLocation || !originCoords || !destinationCoords) && styles.bookButtonDisabled
          ]}
          onPress={() => setBookingModalVisible(true)}
          disabled={!destination || !currentLocation || !originCoords || !destinationCoords}
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
            
            <View style={styles.routeSummaryContainer}>
              <Text style={styles.routeSummaryTitle}>Yolculuk Bilgileri</Text>
              <View style={styles.routeSummaryItem}>
                <Ionicons name="location" size={16} color="#333" />
                <Text style={styles.routeSummaryText} numberOfLines={1}>{currentLocation}</Text>
              </View>
              <View style={styles.routeSummaryItem}>
                <Ionicons name="navigate" size={16} color="#FF5E3A" />
                <Text style={styles.routeSummaryText} numberOfLines={1}>{destination}</Text>
              </View>
              <Text style={styles.routeSummaryDistance}>
                Toplam Mesafe: {distance.toFixed(1)} km | Tahmini Süre: {Math.round(duration)} dakika
              </Text>
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
    position: 'relative',
  },
  currentLocationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  currentLocationInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
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
    marginLeft: 10,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: 100,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 8,
    maxHeight: 200,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    zIndex: 10,
  },
  suggestionsList: {
    maxHeight: 200,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  suggestionText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#333',
  },
  distanceInfoContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  distanceInfoText: {
    fontSize: 14,
    color: '#333',
  },
  loader: {
    marginBottom: 15,
  },
  bookButton: {
    backgroundColor: '#FF5E3A',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  bookButtonDisabled: {
    backgroundColor: '#ccc',
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
    height: height * 0.7,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  routeSummaryContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
  },
  routeSummaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  routeSummaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  routeSummaryText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  routeSummaryDistance: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
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
  priceContainer: {
    alignItems: 'flex-end',
  },
  vehiclePrice: {
    fontSize: 14,
    color: '#666',
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF5E3A',
    marginTop: 3,
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