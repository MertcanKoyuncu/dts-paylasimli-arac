import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image,
  SafeAreaView,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const RideScreen = ({ route }) => {
  const { vehicle: vehicleJson, destination, origin, distance } = route.params;
  const vehicle = vehicleJson ? JSON.parse(vehicleJson) : null;
  
  const [status, setStatus] = useState('searching'); // searching, found, arriving, inProgress, completed
  const [driverInfo, setDriverInfo] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [fare, setFare] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (!vehicle) return;
    
    // Simülasyon: Araç arama
    const searchTimeout = setTimeout(() => {
      setStatus('found');
      setDriverInfo({
        name: 'Ahmet Yılmaz',
        photo: require('../../assets/driver.png'),
        rating: 4.8,
        numberPlate: '34 ABC 123',
        car: 'Toyota Corolla',
        carColor: 'Beyaz',
      });
      setTimeRemaining(vehicle.eta.split(' ')[0] * 60); // dk to saniye dönüştürme
      
      // Km başına ücret hesaplama - baseFare + (15 TL x KM)
      const baseFare = parseInt(vehicle.price);
      const perKmFare = 15;
      const totalFare = baseFare + (perKmFare * distance);
      setFare(totalFare);
    }, 2000);

    return () => clearTimeout(searchTimeout);
  }, [vehicle, distance]);

  useEffect(() => {
    let timer;
    if (status === 'found' && timeRemaining > 0) {
      timer = setTimeout(() => {
        if (timeRemaining <= 30) {
          setStatus('arriving');
        }
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0 && status === 'arriving') {
      setStatus('inProgress');
      // Simülasyon: Yolculuk süresi
      setTimeout(() => {
        setStatus('completed');
      }, 5000);
    }
    
    return () => clearTimeout(timer);
  }, [timeRemaining, status]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>
        {status === 'searching' ? 'Araç Aranıyor' : 
         status === 'found' ? 'Araç Bulundu' :
         status === 'arriving' ? 'Araç Geliyor' :
         status === 'inProgress' ? 'Yolculukta' : 'Yolculuk Tamamlandı'}
      </Text>
      <View style={{ width: 24 }} />
    </View>
  );

  const renderSearching = () => (
    <View style={styles.searchingContainer}>
      <ActivityIndicator size="large" color="#FF5E3A" />
      <Text style={styles.searchingText}>Size uygun araç aranıyor...</Text>
    </View>
  );

  const renderDriverInfo = () => (
    <View style={styles.driverContainer}>
      <View style={styles.driverHeader}>
        <Image source={driverInfo.photo} style={styles.driverPhoto} />
        <View style={styles.driverDetails}>
          <Text style={styles.driverName}>{driverInfo.name}</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.ratingText}>{driverInfo.rating}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.callButton}>
          <Ionicons name="call" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.carInfoContainer}>
        <View style={styles.carInfo}>
          <Text style={styles.carInfoLabel}>Plaka</Text>
          <Text style={styles.carInfoValue}>{driverInfo.numberPlate}</Text>
        </View>
        <View style={styles.carInfo}>
          <Text style={styles.carInfoLabel}>Araç</Text>
          <Text style={styles.carInfoValue}>{driverInfo.car}</Text>
        </View>
        <View style={styles.carInfo}>
          <Text style={styles.carInfoLabel}>Renk</Text>
          <Text style={styles.carInfoValue}>{driverInfo.carColor}</Text>
        </View>
      </View>
    </View>
  );

  const renderArrivalInfo = () => (
    <View style={styles.arrivalContainer}>
      <View style={styles.timeContainer}>
        <Ionicons name="time-outline" size={24} color="#FF5E3A" />
        <Text style={styles.timeText}>
          {status === 'arriving' ? 'Çok yakında' : formatTime(timeRemaining)}
        </Text>
      </View>
      
      <View style={styles.routeContainer}>
        <View style={styles.routeItem}>
          <View style={styles.routeDot} />
          <Text style={styles.routeText}>{origin}</Text>
        </View>
        
        <View style={styles.routeDivider} />
        
        <View style={styles.routeItem}>
          <View style={[styles.routeDot, {backgroundColor: '#FF5E3A'}]} />
          <Text style={styles.routeText}>{destination}</Text>
        </View>
      </View>
      
      <View style={styles.fareContainer}>
        <Text style={styles.fareLabel}>Tahmini ücret:</Text>
        <Text style={styles.fareValue}>₺{fare}</Text>
        <Text style={styles.fareDetails}>({distance} km × ₺15/km + Baz ücret: ₺{vehicle.price})</Text>
      </View>
    </View>
  );

  const renderRideInProgress = () => (
    <View style={styles.inProgressContainer}>
      <View style={styles.progressIndicator}>
        <View style={styles.progressLine} />
        <Text style={styles.progressText}>Yolculuk devam ediyor</Text>
      </View>
      
      <View style={styles.routeContainer}>
        <View style={styles.routeItem}>
          <View style={styles.routeDot} />
          <Text style={styles.routeText}>{origin}</Text>
        </View>
        
        <View style={styles.routeDivider} />
        
        <View style={styles.routeItem}>
          <View style={[styles.routeDot, {backgroundColor: '#FF5E3A'}]} />
          <Text style={styles.routeText}>{destination}</Text>
        </View>
      </View>
      
      <View style={styles.fareContainer}>
        <Text style={styles.fareLabel}>Ücret:</Text>
        <Text style={styles.fareValue}>₺{fare}</Text>
      </View>
    </View>
  );

  const renderRideCompleted = () => (
    <View style={styles.completedContainer}>
      <View style={styles.completedIcon}>
        <Ionicons name="checkmark-circle" size={60} color="#4CAF50" />
      </View>
      <Text style={styles.completedText}>Yolculuk Tamamlandı</Text>
      <Text style={styles.fareText}>Ücret: ₺{fare}</Text>
      <Text style={styles.distanceText}>{distance} km × ₺15/km + Baz ücret</Text>
      
      <View style={styles.ratingPrompt}>
        <Text style={styles.ratingPromptText}>Sürücünüzü değerlendirin</Text>
        <View style={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map(star => (
            <TouchableOpacity key={star}>
              <Ionicons name="star" size={30} color="#FFD700" />
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      <TouchableOpacity 
        style={styles.doneButton}
        onPress={() => router.push('/home')}
      >
        <Text style={styles.doneButtonText}>TAMAM</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      
      {status === 'searching' && renderSearching()}
      
      {(status === 'found' || status === 'arriving' || status === 'inProgress') && (
        <>
          {renderDriverInfo()}
          {status === 'inProgress' ? renderRideInProgress() : renderArrivalInfo()}
        </>
      )}
      
      {status === 'completed' && renderRideCompleted()}
      
      {(status === 'found' || status === 'arriving') && (
        <TouchableOpacity 
          style={styles.cancelButton}
          onPress={() => router.back()}
        >
          <Text style={styles.cancelButtonText}>YOLCULUĞU İPTAL ET</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  searchingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#333',
  },
  driverContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  driverHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  driverPhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  driverDetails: {
    flex: 1,
  },
  driverName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#333',
  },
  callButton: {
    backgroundColor: '#4CAF50',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  carInfo: {
    alignItems: 'center',
  },
  carInfoLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  carInfoValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  arrivalContainer: {
    padding: 20,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  timeText: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  routeContainer: {
    marginBottom: 20,
  },
  routeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  routeDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#333',
    marginRight: 10,
  },
  routeDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#ccc',
    marginLeft: 5.5,
    marginBottom: 10,
  },
  routeText: {
    fontSize: 16,
    color: '#333',
  },
  fareContainer: {
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 15,
  },
  fareLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  fareValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  fareDetails: {
    fontSize: 12,
    color: '#666',
  },
  inProgressContainer: {
    padding: 20,
  },
  progressIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  progressLine: {
    height: 4,
    width: 100,
    backgroundColor: '#FF5E3A',
    marginRight: 10,
  },
  progressText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  completedContainer: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedIcon: {
    marginBottom: 20,
  },
  completedText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  fareText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  distanceText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 30,
  },
  ratingPrompt: {
    alignItems: 'center',
    marginBottom: 30,
  },
  ratingPromptText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  starsContainer: {
    flexDirection: 'row',
  },
  doneButton: {
    backgroundColor: '#FF5E3A',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    width: '100%',
  },
  doneButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FF5E3A',
    padding: 15,
    alignItems: 'center',
    margin: 20,
  },
  cancelButtonText: {
    color: '#FF5E3A',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RideScreen; 