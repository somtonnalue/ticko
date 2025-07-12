import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Colors } from '@/constants/colors';
import { BorderRadius, Spacing, Typography } from '@/constants/dimensions';
import { mockEvents } from '@/data/mock-events';
import { Seat, SeatType, TicketType } from '@/types/ticket';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SeatSelection() {
  const { eventId } = useLocalSearchParams<{ eventId: string }>();
  
  const event = mockEvents.find(e => e.id === eventId);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [selectedTicketType, setSelectedTicketType] = useState<TicketType | null>(null);

  // Mock seat data
  const generateSeats = (): Seat[] => {
    const seats: Seat[] = [];
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const seatsPerRow = 10;

    rows.forEach(row => {
      for (let i = 1; i <= seatsPerRow; i++) {
        const seatType: SeatType = row <= 'C' ? 'premium' : row <= 'F' ? 'standard' : 'economy';
        const basePrice = event?.price.min || 100;
        const price = seatType === 'premium' ? basePrice * 1.5 : 
                     seatType === 'standard' ? basePrice : 
                     basePrice * 0.7;

        seats.push({
          id: `${row}${i}`,
          row,
          number: i,
          type: seatType,
          price: Math.round(price),
          isAvailable: Math.random() > 0.3, // 70% available
          isSelected: false,
        });
      }
    });

    return seats;
  };

  const [seats] = useState<Seat[]>(generateSeats());

  const ticketTypes: TicketType[] = [
    {
      id: '1',
      name: 'General Admission',
      price: event?.price.min || 100,
      description: 'Standard event access',
      features: ['Event access', 'Digital ticket'],
      color: Colors.secondary[600],
    },
    {
      id: '2',
      name: 'VIP Experience',
      price: (event?.price.min || 100) * 1.8,
      description: 'Premium experience with perks',
      features: ['Priority entry', 'Welcome drink', 'VIP lounge access', 'Premium seating'],
      color: Colors.accent.yellow,
    },
    {
      id: '3',
      name: 'Backstage Pass',
      price: (event?.price.min || 100) * 2.5,
      description: 'Ultimate fan experience',
      features: ['All VIP benefits', 'Meet & greet', 'Backstage tour', 'Exclusive merchandise'],
      color: Colors.primary[600],
    },
  ];

  if (!event) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Event not found</Text>
      </SafeAreaView>
    );
  }

  const handleSeatPress = (seat: Seat) => {
    if (!seat.isAvailable) return;

    const isSelected = selectedSeats.some(s => s.id === seat.id);
    
    if (isSelected) {
      setSelectedSeats(prev => prev.filter(s => s.id !== seat.id));
    } else {
      if (selectedSeats.length >= 6) {
        Alert.alert('Limit Reached', 'You can select up to 6 seats per booking.');
        return;
      }
      setSelectedSeats(prev => [...prev, seat]);
    }
  };

  const handleContinue = () => {
    if (selectedSeats.length === 0) {
      Alert.alert('No Seats Selected', 'Please select at least one seat to continue.');
      return;
    }

    if (!selectedTicketType) {
      Alert.alert('No Ticket Type', 'Please select a ticket type to continue.');
      return;
    }

    router.push({
      pathname: '/ticket-preview',
      params: { 
        eventId: event.id,
        selectedSeats: JSON.stringify(selectedSeats.map(s => s.id)),
        ticketTypeId: selectedTicketType.id,
      }
    });
  };

  const getTotalPrice = () => {
    const seatsTotal = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
    const ticketTypeMultiplier = selectedTicketType ? (selectedTicketType.price / (event.price.min || 100)) : 1;
    return Math.round(seatsTotal * ticketTypeMultiplier);
  };

  const getSeatColor = (seat: Seat) => {
    if (!seat.isAvailable) return Colors.neutral.gray[300];
    if (selectedSeats.some(s => s.id === seat.id)) return Colors.primary[600];
    
    switch (seat.type) {
      case 'premium': return Colors.accent.yellow;
      case 'standard': return Colors.accent.blue;
      case 'economy': return Colors.accent.green;
      default: return Colors.neutral.gray[400];
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>Select Seats</Text>
          <Text style={styles.headerSubtitle}>{event.title}</Text>
        </View>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Seat Map */}
        <Card variant="elevated" padding="lg" style={styles.seatMapCard}>
          <Text style={styles.sectionTitle}>Seat Map</Text>
          
          {/* Stage */}
          <View style={styles.stage}>
            <Text style={styles.stageText}>STAGE</Text>
          </View>

          {/* Seat Grid */}
          <View style={styles.seatGrid}>
            {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map(row => (
              <View key={row} style={styles.seatRow}>
                <Text style={styles.rowLabel}>{row}</Text>
                <View style={styles.seatRowSeats}>
                  {seats
                    .filter(seat => seat.row === row)
                    .map(seat => (
                      <TouchableOpacity
                        key={seat.id}
                        style={[
                          styles.seat,
                          { backgroundColor: getSeatColor(seat) }
                        ]}
                        onPress={() => handleSeatPress(seat)}
                        disabled={!seat.isAvailable}
                      >
                        <Text style={[
                          styles.seatText,
                          { color: seat.isAvailable ? Colors.neutral.white : Colors.neutral.gray[500] }
                        ]}>
                          {seat.number}
                        </Text>
                      </TouchableOpacity>
                    ))}
                </View>
                <Text style={styles.rowLabel}>{row}</Text>
              </View>
            ))}
          </View>

          {/* Legend */}
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendSeat, { backgroundColor: Colors.accent.yellow }]} />
              <Text style={styles.legendText}>Premium</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendSeat, { backgroundColor: Colors.accent.blue }]} />
              <Text style={styles.legendText}>Standard</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendSeat, { backgroundColor: Colors.accent.green }]} />
              <Text style={styles.legendText}>Economy</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendSeat, { backgroundColor: Colors.primary[600] }]} />
              <Text style={styles.legendText}>Selected</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendSeat, { backgroundColor: Colors.neutral.gray[300] }]} />
              <Text style={styles.legendText}>Unavailable</Text>
            </View>
          </View>
        </Card>

        {/* Ticket Types */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ticket Type</Text>
          <View style={styles.ticketTypes}>
            {ticketTypes.map(ticketType => (
              <TouchableOpacity
                key={ticketType.id}
                style={[
                  styles.ticketTypeCard,
                  selectedTicketType?.id === ticketType.id && styles.ticketTypeCardSelected
                ]}
                onPress={() => setSelectedTicketType(ticketType)}
              >
                <View style={styles.ticketTypeHeader}>
                  <View style={[styles.ticketTypeColor, { backgroundColor: ticketType.color }]} />
                  <View style={styles.ticketTypeInfo}>
                    <Text style={styles.ticketTypeName}>{ticketType.name}</Text>
                    <Text style={styles.ticketTypeDescription}>{ticketType.description}</Text>
                  </View>
                  <Text style={styles.ticketTypePrice}>${ticketType.price}</Text>
                </View>
                <View style={styles.ticketTypeFeatures}>
                  {ticketType.features.map((feature, index) => (
                    <View key={index} style={styles.ticketTypeFeature}>
                      <Ionicons name="checkmark" size={16} color={Colors.accent.green} />
                      <Text style={styles.ticketTypeFeatureText}>{feature}</Text>
                    </View>
                  ))}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Selected Seats Summary */}
        {selectedSeats.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Selected Seats</Text>
            <Card variant="outlined" padding="md">
              <View style={styles.selectedSeats}>
                {selectedSeats.map(seat => (
                  <View key={seat.id} style={styles.selectedSeat}>
                    <Text style={styles.selectedSeatText}>
                      {seat.row}{seat.number}
                    </Text>
                    <TouchableOpacity onPress={() => handleSeatPress(seat)}>
                      <Ionicons name="close-circle" size={20} color={Colors.status.error} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </Card>
          </View>
        )}
      </ScrollView>

      {/* Bottom Action */}
      <SafeAreaView edges={['bottom']} style={styles.bottomContainer}>
        <View style={styles.bottomContent}>
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryText}>
              {selectedSeats.length} seat{selectedSeats.length !== 1 ? 's' : ''} selected
            </Text>
            <Text style={styles.summaryPrice}>
              Total: ${getTotalPrice()}
            </Text>
          </View>
          <Button
            title="Continue"
            onPress={handleContinue}
            disabled={selectedSeats.length === 0 || !selectedTicketType}
            style={styles.continueButton}
          />
        </View>
      </SafeAreaView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: Typography.fontSize.lg,
    fontFamily: Typography.fontFamily.semibold,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  headerSubtitle: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.text.secondary,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: Spacing.xl,
  },
  seatMapCard: {
    margin: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontFamily: Typography.fontFamily.semibold,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  stage: {
    backgroundColor: Colors.neutral.gray[800],
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  stageText: {
    color: Colors.neutral.white,
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.semibold,
    fontWeight: Typography.fontWeight.semibold,
  },
  seatGrid: {
    gap: Spacing.xs,
    marginBottom: Spacing.lg,
  },
  seatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  rowLabel: {
    width: 20,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  seatRowSeats: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.xs / 2,
  },
  seat: {
    width: 28,
    height: 28,
    borderRadius: BorderRadius.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  seatText: {
    fontSize: Typography.fontSize.xs,
    fontFamily: Typography.fontFamily.semibold,
    fontWeight: Typography.fontWeight.semibold,
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    justifyContent: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  legendSeat: {
    width: 16,
    height: 16,
    borderRadius: BorderRadius.xs,
  },
  legendText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
  },
  section: {
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.lg,
  },
  ticketTypes: {
    gap: Spacing.md,
  },
  ticketTypeCard: {
    backgroundColor: Colors.background.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.border.light,
  },
  ticketTypeCardSelected: {
    borderColor: Colors.primary[600],
    backgroundColor: Colors.primary[50],
  },
  ticketTypeHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  ticketTypeColor: {
    width: 4,
    height: 40,
    borderRadius: BorderRadius.sm,
    marginRight: Spacing.sm,
  },
  ticketTypeInfo: {
    flex: 1,
  },
  ticketTypeName: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  ticketTypeDescription: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    marginTop: Spacing.xs / 2,
  },
  ticketTypePrice: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary[600],
  },
  ticketTypeFeatures: {
    gap: Spacing.xs,
  },
  ticketTypeFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  ticketTypeFeatureText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
  },
  selectedSeats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  selectedSeat: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary[100],
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    gap: Spacing.xs,
  },
  selectedSeatText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.primary[700],
  },
  bottomContainer: {
    backgroundColor: Colors.background.card,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
  },
  bottomContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  summaryContainer: {
    flex: 1,
  },
  summaryText: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.text.secondary,
  },
  summaryPrice: {
    fontSize: Typography.fontSize.lg,
    fontFamily: Typography.fontFamily.bold,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
  },
  continueButton: {
    marginLeft: Spacing.lg,
    paddingHorizontal: Spacing.xl,
  },
}); 