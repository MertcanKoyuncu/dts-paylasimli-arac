import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  ScrollView, 
  Switch, 
  SafeAreaView 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const ProfileScreen = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationSharing, setLocationSharing] = useState(true);
  const router = useRouter();
  
  // Kullanıcı bilgileri (gerçek bir uygulamada API'den alınacak)
  const userInfo = {
    name: 'Mertcan Koyuncu',
    email: 'info@dtsglobal.com',
    phone: '+90 555 123 45 67',
    photo: require('../../assets/profile.png'),
  };
  
  // Kullanıcının geçmiş yolculukları (gerçek bir uygulamada API'den alınacak)
  const recentRides = [
    { id: '1', date: '12 Mart 2023', from: 'Ev', to: 'İş', price: '₺45' },
    { id: '2', date: '10 Mart 2023', from: 'İş', to: 'Alışveriş Merkezi', price: '₺30' },
    { id: '3', date: '5 Mart 2023', from: 'Alışveriş Merkezi', to: 'Ev', price: '₺35' },
  ];

  const handleLogout = () => {
    // Çıkış işlemleri burada yapılacak
    router.replace('/login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profil</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <Image 
            source={userInfo.photo} 
            style={styles.profilePhoto} 
          />
          <Text style={styles.userName}>{userInfo.name}</Text>
          <Text style={styles.userContact}>{userInfo.email}</Text>
          <Text style={styles.userContact}>{userInfo.phone}</Text>
        </View>
        
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Ayarlar</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLabelContainer}>
              <Ionicons name="notifications" size={24} color="#333" style={styles.settingIcon} />
              <Text style={styles.settingLabel}>Bildirimler</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: "#767577", true: "#FF5E3A" }}
              thumbColor="#fff"
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLabelContainer}>
              <Ionicons name="location" size={24} color="#333" style={styles.settingIcon} />
              <Text style={styles.settingLabel}>Konum Paylaşımı</Text>
            </View>
            <Switch
              value={locationSharing}
              onValueChange={setLocationSharing}
              trackColor={{ false: "#767577", true: "#FF5E3A" }}
              thumbColor="#fff"
            />
          </View>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLabelContainer}>
              <Ionicons name="card" size={24} color="#333" style={styles.settingIcon} />
              <Text style={styles.settingLabel}>Ödeme Yöntemlerim</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#ccc" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLabelContainer}>
              <Ionicons name="help-circle" size={24} color="#333" style={styles.settingIcon} />
              <Text style={styles.settingLabel}>Yardım</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#ccc" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Son Yolculuklar</Text>
          
          {recentRides.map(ride => (
            <View key={ride.id} style={styles.rideItem}>
              <View style={styles.rideInfo}>
                <Text style={styles.rideDate}>{ride.date}</Text>
                <Text style={styles.rideRoute}>{ride.from} → {ride.to}</Text>
              </View>
              <Text style={styles.ridePrice}>{ride.price}</Text>
            </View>
          ))}
          
          <TouchableOpacity style={styles.allRidesButton}>
            <Text style={styles.allRidesButtonText}>TÜM YOLCULUKLAR</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutButtonText}>ÇIKIŞ YAP</Text>
        </TouchableOpacity>
        
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Versiyon 1.0.0</Text>
        </View>
      </ScrollView>
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
  profileSection: {
    alignItems: 'center',
    padding: 20,
    paddingBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  profilePhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  userContact: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  sectionContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 15,
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
  },
  rideItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  rideInfo: {
    flex: 1,
  },
  rideDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  rideRoute: {
    fontSize: 16,
    color: '#333',
  },
  ridePrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  allRidesButton: {
    marginTop: 15,
    padding: 10,
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  allRidesButtonText: {
    color: '#333',
    fontSize: 14,
  },
  logoutButton: {
    margin: 20,
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#FF5E3A',
    fontSize: 16,
    fontWeight: 'bold',
  },
  versionContainer: {
    alignItems: 'center',
    padding: 20,
  },
  versionText: {
    color: '#999',
    fontSize: 14,
  },
});

export default ProfileScreen; 