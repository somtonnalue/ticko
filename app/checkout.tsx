import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Colors } from '@/constants/colors';
import { BorderRadius, Spacing, Typography } from '@/constants/dimensions';
import { mockEvents } from '@/data/mock-events';
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

interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'apple_pay' | 'google_pay';
  name: string;
  icon: string;
}

export default function Checkout() {
  const { eventId, selectedSeats, ticketTypeId, userInfo, total } = useLocalSearchParams<{
    eventId: string;
    selectedSeats: string;
    ticketTypeId: string;
    userInfo: string;
    total: string;
  }>();

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const event = mockEvents.find(e => e.id === eventId);
  const user = userInfo ? JSON.parse(userInfo) : {};
  const seatIds = selectedSeats ? JSON.parse(selectedSeats) : [];
  const totalAmount = total ? parseInt(total) : 0;

  const paymentMethods: PaymentMethod[] = [
    { id: '1', type: 'card', name: 'Credit/Debit Card', icon: 'card' },
    { id: '2', type: 'paypal', name: 'PayPal', icon: 'logo-paypal' },
    { id: '3', type: 'apple_pay', name: 'Apple Pay', icon: 'logo-apple' },
    { id: '4', type: 'google_pay', name: 'Google Pay', icon: 'logo-google' },
  ];

  if (!event) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Invalid booking data</Text>
      </SafeAreaView>
    );
  }

  const handlePayment = async () => {
    if (!selectedPaymentMethod) {
      Alert.alert('Payment Method Required', 'Please select a payment method.');
      return;
    }

    if (selectedPaymentMethod.type === 'card') {
      if (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv || !cardDetails.name) {
        Alert.alert('Card Details Required', 'Please fill in all card details.');
        return;
      }
    }

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      router.push({
        pathname: '/booking-confirmation',
        params: {
          eventId,
          selectedSeats,
          ticketTypeId,
          userInfo,
          total,
          bookingId: `TK${Date.now()}`,
        },
      });
    }, 3000);
  };

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\s/g, '');
    const match = cleaned.match(/.{1,4}/g);
    return match ? match.join(' ') : '';
  };

  const formatExpiry = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`;
    }
    return cleaned;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>Secure Checkout</Text>
          <Text style={styles.headerSubtitle}>Complete your booking</Text>
        </View>
        <Ionicons name="shield-checkmark" size={24} color={Colors.accent.green} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Order Summary */}
        <Card variant="elevated" padding="lg" style={styles.summaryCard}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.orderSummary}>
            <Text style={styles.eventTitle}>{event.title}</Text>
            <Text style={styles.eventDetails}>
              {seatIds.length} ticket{seatIds.length !== 1 ? 's' : ''} • {event.venue}
            </Text>
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalAmount}>${totalAmount}</Text>
            </View>
          </View>
        </Card>

        {/* Payment Methods */}
        <Card variant="elevated" padding="lg" style={styles.summaryCard}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <View style={styles.paymentMethods}>
            {paymentMethods.map((method) => (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.paymentMethod,
                  selectedPaymentMethod?.id === method.id && styles.paymentMethodSelected
                ]}
                onPress={() => setSelectedPaymentMethod(method)}
              >
                <Ionicons name={method.icon as any} size={24} color={Colors.text.primary} />
                <Text style={styles.paymentMethodText}>{method.name}</Text>
                {selectedPaymentMethod?.id === method.id && (
                  <Ionicons name="checkmark-circle" size={20} color={Colors.primary[600]} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Card Details (show only if card payment is selected) */}
        {selectedPaymentMethod?.type === 'card' && (
          <Card variant="elevated" padding="lg" style={styles.summaryCard}>
            <Text style={styles.sectionTitle}>Card Details</Text>
            <View style={styles.cardForm}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Card Number</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="1234 5678 9012 3456"
                  placeholderTextColor={Colors.text.tertiary}
                  value={cardDetails.number}
                  onChangeText={(text) => {
                    const formatted = formatCardNumber(text);
                    if (formatted.length <= 19) {
                      setCardDetails(prev => ({ ...prev, number: formatted }));
                    }
                  }}
                  keyboardType="numeric"
                  maxLength={19}
                />
              </View>

              <View style={styles.formRow}>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.formLabel}>Expiry Date</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="MM/YY"
                    placeholderTextColor={Colors.text.tertiary}
                    value={cardDetails.expiry}
                    onChangeText={(text) => {
                      const formatted = formatExpiry(text);
                      if (formatted.length <= 5) {
                        setCardDetails(prev => ({ ...prev, expiry: formatted }));
                      }
                    }}
                    keyboardType="numeric"
                    maxLength={5}
                  />
                </View>

                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.formLabel}>CVV</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="123"
                    placeholderTextColor={Colors.text.tertiary}
                    value={cardDetails.cvv}
                    onChangeText={(text) => {
                      if (text.length <= 4) {
                        setCardDetails(prev => ({ ...prev, cvv: text }));
                      }
                    }}
                    keyboardType="numeric"
                    maxLength={4}
                    secureTextEntry
                  />
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Cardholder Name</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="John Doe"
                  placeholderTextColor={Colors.text.tertiary}
                  value={cardDetails.name}
                  onChangeText={(text) => setCardDetails(prev => ({ ...prev, name: text }))}
                  autoCapitalize="words"
                />
              </View>
            </View>
          </Card>
        )}

        {/* Security Notice */}
        <Card variant="outlined" padding="md" style={styles.summaryCard}>
          <View style={styles.securityNotice}>
            <Ionicons name="shield-checkmark" size={20} color={Colors.accent.green} />
            <View style={styles.securityText}>
              <Text style={styles.securityTitle}>Secure Payment</Text>
              <Text style={styles.securityDescription}>
                Your payment information is encrypted and secure. We never store your card details.
              </Text>
            </View>
          </View>
        </Card>

        {/* Billing Information */}
        <Card variant="elevated" padding="lg" style={styles.summaryCard}>
          <Text style={styles.sectionTitle}>Billing Information</Text>
          <View style={styles.billingInfo}>
            <Text style={styles.billingLabel}>Name:</Text>
            <Text style={styles.billingValue}>{user.name}</Text>
          </View>
          <View style={styles.billingInfo}>
            <Text style={styles.billingLabel}>Email:</Text>
            <Text style={styles.billingValue}>{user.email}</Text>
          </View>
          <View style={styles.billingInfo}>
            <Text style={styles.billingLabel}>Phone:</Text>
            <Text style={styles.billingValue}>{user.phone}</Text>
          </View>
        </Card>
      </ScrollView>

      {/* Bottom Action */}
      <SafeAreaView edges={['bottom']} style={styles.bottomContainer}>
        <View style={styles.bottomContent}>
          <View style={styles.bottomSummary}>
            <Text style={styles.bottomTotal}>Total: ${totalAmount}</Text>
            <Text style={styles.bottomSubtext}>Secure payment processing</Text>
          </View>
          <Button
            title={isProcessing ? "Processing..." : "Complete Payment"}
            onPress={handlePayment}
            disabled={!selectedPaymentMethod || isProcessing}
            loading={isProcessing}
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
  orderSummary: {
    gap: Spacing.sm,
  },
  eventTitle: {
    fontSize: Typography.fontSize.lg,
    fontFamily: Typography.fontFamily.semibold,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  eventDetails: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.text.secondary,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
  },
  totalLabel: {
    fontSize: Typography.fontSize.lg,
    fontFamily: Typography.fontFamily.semibold,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  totalAmount: {
    fontSize: Typography.fontSize['2xl'],
    fontFamily: Typography.fontFamily.bold,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary[600],
  },
  paymentMethods: {
    gap: Spacing.sm,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border.light,
    backgroundColor: Colors.background.secondary,
    gap: Spacing.md,
  },
  paymentMethodSelected: {
    borderColor: Colors.primary[600],
    backgroundColor: Colors.primary[50],
  },
  paymentMethodText: {
    flex: 1,
    fontSize: Typography.fontSize.base,
    fontFamily: Typography.fontFamily.medium,
    color: Colors.text.primary,
    fontWeight: Typography.fontWeight.medium,
  },
  cardForm: {
    gap: Spacing.lg,
  },
  formGroup: {
    gap: Spacing.sm,
  },
  formRow: {
    flexDirection: 'row',
    gap: Spacing.md,
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
  securityNotice: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  securityText: {
    flex: 1,
    gap: Spacing.xs,
  },
  securityTitle: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.semibold,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  securityDescription: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.text.secondary,
    lineHeight: Typography.lineHeight.sm,
  },
  billingInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.xs,
  },
  billingLabel: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.medium,
    color: Colors.text.secondary,
    fontWeight: Typography.fontWeight.medium,
  },
  billingValue: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.semibold,
    color: Colors.text.primary,
    fontWeight: Typography.fontWeight.semibold,
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