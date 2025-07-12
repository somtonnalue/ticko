import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Colors } from '@/constants/colors';
import { BorderRadius, Spacing, Typography } from '@/constants/dimensions';
import { mockEvents } from '@/data/mock-events';
import { User } from '@/types/ticket';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TicketPreview() {
  const { eventId, selectedSeats, ticketTypeId } = useLocalSearchParams<{
    eventId: string;
    selectedSeats: string;
    ticketTypeId: string;
  }>();

  const [userInfo, setUserInfo] = useState<Partial<User>>({
    name: '',
    email: '',
    phone: '',
  });

  const event = mockEvents.find(e => e.id === eventId);
  const seatIds = selectedSeats ? JSON.parse(selectedSeats) : [];
  
  // Mock data for demonstration
  const ticketTypes = [
    {
      id: '1',
      name: 'General Admission',
      price: event?.price.min || 100,
      description: 'Standard event access',
      features: ['Event access', 'Digital ticket'],
    },
    {
      id: '2',
      name: 'VIP Experience',
      price: (event?.price.min || 100) * 1.8,
      description: 'Premium experience with perks',
      features: ['Priority entry', 'Welcome drink', 'VIP lounge access', 'Premium seating'],
    },
    {
      id: '3',
      name: 'Backstage Pass',
      price: (event?.price.min || 100) * 2.5,
      description: 'Ultimate fan experience',
      features: ['All VIP benefits', 'Meet & greet', 'Backstage tour', 'Exclusive merchandise'],
    },
  ];

  const selectedTicketType = ticketTypes.find(t => t.id === ticketTypeId);

  if (!event || !selectedTicketType) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Invalid booking data</Text>
      </SafeAreaView>
    );
  }

  const subtotal = seatIds.length * selectedTicketType.price;
  const serviceFee = Math.round(subtotal * 0.1);
  const taxes = Math.round(subtotal * 0.08);
  const total = subtotal + serviceFee + taxes;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleProceedToPayment = () => {
    // Validate user info
    if (!userInfo.name || !userInfo.email || !userInfo.phone) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userInfo.email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    router.push({
      pathname: '/checkout',
      params: {
        eventId,
        selectedSeats,
        ticketTypeId,
        userInfo: JSON.stringify(userInfo),
        total: total.toString(),
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>Review Booking</Text>
          <Text style={styles.headerSubtitle}>Confirm your details</Text>
        </View>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Event Summary */}
        <Card variant="elevated" padding="lg" style={styles.summaryCard}>
          <Text style={styles.sectionTitle}>Event Details</Text>
          <View style={styles.eventInfo}>
            <Text style={styles.eventTitle}>{event.title}</Text>
            <View style={styles.eventDetails}>
              <View style={styles.eventDetail}>
                <Ionicons name="calendar" size={16} color={Colors.text.secondary} />
                <Text style={styles.eventDetailText}>{formatDate(event.date)}</Text>
              </View>
              <View style={styles.eventDetail}>
                <Ionicons name="time" size={16} color={Colors.text.secondary} />
                <Text style={styles.eventDetailText}>{event.time}</Text>
              </View>
              <View style={styles.eventDetail}>
                <Ionicons name="location" size={16} color={Colors.text.secondary} />
                <Text style={styles.eventDetailText}>{event.venue}</Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Ticket Summary */}
        <Card variant="elevated" padding="lg" style={styles.summaryCard}>
          <Text style={styles.sectionTitle}>Ticket Summary</Text>
          
          <View style={styles.ticketSummary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Ticket Type:</Text>
              <Text style={styles.summaryValue}>{selectedTicketType.name}</Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Selected Seats:</Text>
              <Text style={styles.summaryValue}>
                {seatIds.join(', ')} ({seatIds.length} seat{seatIds.length !== 1 ? 's' : ''})
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Ticket Features:</Text>
              <View style={styles.featuresContainer}>
                {selectedTicketType.features.map((feature, index) => (
                  <View key={index} style={styles.feature}>
                    <Ionicons name="checkmark" size={14} color={Colors.accent.green} />
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </Card>

        {/* User Information Form */}
        <Card variant="elevated" padding="lg" style={styles.summaryCard}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          
          <View style={styles.form}>
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Full Name *</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Enter your full name"
                placeholderTextColor={Colors.text.tertiary}
                value={userInfo.name}
                onChangeText={(text) => setUserInfo(prev => ({ ...prev, name: text }))}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Email Address *</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Enter your email"
                placeholderTextColor={Colors.text.tertiary}
                value={userInfo.email}
                onChangeText={(text) => setUserInfo(prev => ({ ...prev, email: text }))}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Phone Number *</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Enter your phone number"
                placeholderTextColor={Colors.text.tertiary}
                value={userInfo.phone}
                onChangeText={(text) => setUserInfo(prev => ({ ...prev, phone: text }))}
                keyboardType="phone-pad"
              />
            </View>
          </View>
        </Card>

        {/* Price Breakdown */}
        <Card variant="elevated" padding="lg" style={styles.summaryCard}>
          <Text style={styles.sectionTitle}>Price Breakdown</Text>
          
          <View style={styles.priceBreakdown}>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>
                Tickets ({seatIds.length}x ${selectedTicketType.price})
              </Text>
              <Text style={styles.priceValue}>${subtotal}</Text>
            </View>
            
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Service Fee</Text>
              <Text style={styles.priceValue}>${serviceFee}</Text>
            </View>
            
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Taxes</Text>
              <Text style={styles.priceValue}>${taxes}</Text>
            </View>
            
            <View style={styles.priceDivider} />
            
            <View style={styles.priceRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>${total}</Text>
            </View>
          </View>
        </Card>

        {/* Terms and Conditions */}
        <Card variant="outlined" padding="md" style={styles.summaryCard}>
          <View style={styles.termsContainer}>
            <Ionicons name="information-circle" size={20} color={Colors.accent.blue} />
            <View style={styles.termsText}>
              <Text style={styles.termsTitle}>Booking Terms</Text>
              <Text style={styles.termsDescription}>
                By proceeding with this booking, you agree to our terms and conditions. 
                Tickets are non-refundable but may be transferable subject to event policies.
              </Text>
            </View>
          </View>
        </Card>
      </ScrollView>

      {/* Bottom Action */}
      <SafeAreaView edges={['bottom']} style={styles.bottomContainer}>
        <View style={styles.bottomContent}>
          <View style={styles.bottomSummary}>
            <Text style={styles.bottomTotal}>Total: ${total}</Text>
            <Text style={styles.bottomSubtext}>
              {seatIds.length} ticket{seatIds.length !== 1 ? 's' : ''} • {selectedTicketType.name}
            </Text>
          </View>
          <Button
            title="Proceed to Payment"
            onPress={handleProceedToPayment}
            style={styles.paymentButton}
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
  summaryCard: {
    margin: Spacing.md,
    marginBottom: 0,
    marginTop: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontFamily: Typography.fontFamily.semibold,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  eventInfo: {
    gap: Spacing.sm,
  },
  eventTitle: {
    fontSize: Typography.fontSize.lg,
    fontFamily: Typography.fontFamily.semibold,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  eventDetails: {
    gap: Spacing.xs,
  },
  eventDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  eventDetailText: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.text.secondary,
  },
  ticketSummary: {
    gap: Spacing.md,
  },
  summaryRow: {
    gap: Spacing.xs,
  },
  summaryLabel: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.medium,
    color: Colors.text.secondary,
    fontWeight: Typography.fontWeight.medium,
  },
  summaryValue: {
    fontSize: Typography.fontSize.base,
    fontFamily: Typography.fontFamily.semibold,
    color: Colors.text.primary,
    fontWeight: Typography.fontWeight.semibold,
  },
  featuresContainer: {
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  featureText: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.text.secondary,
  },
  form: {
    gap: Spacing.lg,
  },
  formGroup: {
    gap: Spacing.sm,
  },
  formLabel: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.semibold,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  formInput: {
    borderWidth: 1,
    borderColor: Colors.border.medium,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: Typography.fontSize.base,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.text.primary,
    backgroundColor: Colors.background.secondary,
  },
  priceBreakdown: {
    gap: Spacing.md,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: Typography.fontSize.base,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.text.secondary,
  },
  priceValue: {
    fontSize: Typography.fontSize.base,
    fontFamily: Typography.fontFamily.semibold,
    color: Colors.text.primary,
    fontWeight: Typography.fontWeight.semibold,
  },
  priceDivider: {
    height: 1,
    backgroundColor: Colors.border.light,
    marginVertical: Spacing.sm,
  },
  totalLabel: {
    fontSize: Typography.fontSize.lg,
    fontFamily: Typography.fontFamily.bold,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
  },
  totalValue: {
    fontSize: Typography.fontSize.lg,
    fontFamily: Typography.fontFamily.bold,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary[600],
  },
  termsContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  termsText: {
    flex: 1,
    gap: Spacing.xs,
  },
  termsTitle: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.semibold,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  termsDescription: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.text.secondary,
    lineHeight: Typography.lineHeight.sm,
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
  bottomSummary: {
    flex: 1,
  },
  bottomTotal: {
    fontSize: Typography.fontSize.lg,
    fontFamily: Typography.fontFamily.bold,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
  },
  bottomSubtext: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.text.secondary,
  },
  paymentButton: {
    marginLeft: Spacing.lg,
    paddingHorizontal: Spacing.xl,
  },
}); 