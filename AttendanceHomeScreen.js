import React from "react";
import { View, Text, StyleSheet, ActivityIndicator, Dimensions } from "react-native";
import { useRoute } from '@react-navigation/native';

export default function AttendanceHomeScreen() {
  const route = useRoute();
  const userId = route.params?.userId || '';
  const [name, setName] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const API_KEY = "AIzaSyDLB1EfUATYqnSiih6rO_FM35RZ969E7wY";
  const SHEET_ID = "1BBt7DO0m5PA7EAJ8aZy9ZqldF22N975dm0Hv3KinsYA";
  const RANGE = "Data!A:D";

  React.useEffect(() => {
    const fetchName = async () => {
      try {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        if (data && data.values && data.values.length > 0) {
          const rows = data.values;
          // Try to detect if first row is header
          const hasHeader = rows[0][0].toLowerCase().includes("leader") || rows[0][1].toLowerCase().includes("first");
          const userRows = hasHeader ? rows.slice(1) : rows;
          const found = userRows.find(row => row[0] === userId);
          if (found) {
            // Column B + ' ' + Column D
            const fullName = `${found[1] || ''} ${found[3] || ''}`.trim();
            setName(fullName);
          } else {
            setName('Not found');
          }
        } else {
          setName('Not found');
        }
      } catch (e) {
        setName('Error');
      } finally {
        setLoading(false);
      }
    };
    fetchName();
  }, [userId]);

  return (
    <View style={styles.container}>
      <View style={styles.segment}>
        <Text style={styles.welcome}>Welcome</Text>
        <Text style={styles.leaderId}>Leader ID: {userId}</Text>
        <Text style={styles.nameLabel}>
          Name: <Text style={{fontWeight: 'bold'}}>{loading ? <ActivityIndicator size="small" color="#4F8EF7" /> : name}</Text>
        </Text>
      </View>
      <Text style={styles.title}>Attendance Home</Text>
      {/* 1x3 Table */}
      <View style={styles.tableCol}>
  <View style={styles.tableCell}><Text style={styles.tableCellText}>Submit</Text></View>
  <View style={styles.tableCell}><Text style={styles.tableCellText}>Logs</Text></View>
  <View style={styles.tableCell}><Text style={styles.tableCellText}>Add Member</Text></View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  segment: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#22336B', // dark blue from blue palette
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    alignItems: 'flex-start',
    marginBottom: 24,
    marginTop: 24, // right below header
  },

  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingTop: 0,
  },
  welcome: {
    fontSize: 22,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 12,
  },
  leaderId: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 4,
    fontWeight: 'bold',
  },
  nameLabel: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 12,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4F8EF7",
  },
  tableCol: {
    flexDirection: 'column',
    width: Dimensions.get('window').width,
    alignSelf: 'center',
    height: 420,
    marginTop: 24,
    marginBottom: 24,
  },
  tableCell: {
    width: '100%',
    backgroundColor: '#e0e0e0',
    marginHorizontal: 4,
  borderRadius: 0,
    justifyContent: 'center',
    alignItems: 'center',
    height: 140,
  },
  tableCellText: {
    color: '#22336B',
    fontWeight: 'bold',
    fontSize: 18,
  },

});
