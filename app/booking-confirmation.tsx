import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Colors } from '@/constants/colors';
import { BorderRadius, Spacing, Typography } from '@/constants/dimensions';
import { mockEvents } from '@/data/mock-events';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function BookingConfirmation() {
  const { eventId, selectedSeats, ticketTypeId, userInfo, total, bookingId } = useLocalSearchParams<{
    eventId: string;
    selectedSeats: string;
    ticketTypeId: string;
    userInfo: string;
    total: string;
    bookingId: string;
  }>();

  const event = mockEvents.find(e => e.id === eventId);
  const user = userInfo ? JSON.parse(userInfo) : {};
  const seatIds = selectedSeats ? JSON.parse(selectedSeats) : [];
  const totalAmount = total ? parseInt(total) : 0;

  if (!event) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Booking data not found</Text>
      </SafeAreaView>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleDownloadTickets = () => {
    // In a real app, this would download the tickets
    console.log('Download tickets');
  };

  const handleAddToCalendar = () => {
    // In a real app, this would add event to calendar
    console.log('Add to calendar');
  };

  const handleShareBooking = () => {
    // In a real app, this would share the booking
    console.log('Share booking');
  };

  const handleBackToHome = () => {
    router.dismissAll();
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Success Header */}
        <View style={styles.successHeader}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark" size={48} color={Colors.neutral.white} />
          </View>
          <Text style={styles.successTitle}>Booking Confirmed!</Text>
          <Text style={styles.successMessage}>
            Your tickets have been booked successfully. Confirmation details have been sent to your email.
          </Text>
        </View>

        {/* Booking Details */}
        <Card variant="elevated" padding="lg" style={styles.detailsCard}>
          <View style={styles.bookingHeader}>
            <Text style={styles.sectionTitle}>Booking Details</Text>
            <View style={styles.bookingIdContainer}>
              <Text style={styles.bookingIdLabel}>Booking ID</Text>
              <Text style={styles.bookingId}>{bookingId}</Text>
            </View>
          </View>

          <View style={styles.bookingDetails}>
            <Text style={styles.eventTitle}>{event.title}</Text>
            
            <View style={styles.detailRow}>
              <Ionicons name="calendar" size={20} color={Colors.primary[600]} />
              <View style={styles.detailText}>
                <Text style={styles.detailLabel}>Date & Time</Text>
                <Text style={styles.detailValue}>{formatDate(event.date)} at {event.time}</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="location" size={20} color={Colors.primary[600]} />
              <View style={styles.detailText}>
                <Text style={styles.detailLabel}>Venue</Text>
                <Text style={styles.detailValue}>{event.venue}</Text>
                <Text style={styles.detailSubValue}>{event.location}</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="people" size={20} color={Colors.primary[600]} />
              <View style={styles.detailText}>
                <Text style={styles.detailLabel}>Seats</Text>
                <Text style={styles.detailValue}>
                  {seatIds.join(', ')} ({seatIds.length} ticket{seatIds.length !== 1 ? 's' : ''})
                </Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="person" size={20} color={Colors.primary[600]} />
              <View style={styles.detailText}>
                <Text style={styles.detailLabel}>Booked by</Text>
                <Text style={styles.detailValue}>{user.name}</Text>
                <Text style={styles.detailSubValue}>{user.email}</Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Payment Summary */}
        <Card variant="elevated" padding="lg" style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>Payment Summary</Text>
          <View style={styles.paymentSummary}>
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Total Amount Paid</Text>
              <Text style={styles.paymentValue}>${totalAmount}</Text>
            </View>
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Payment Method</Text>
              <Text style={styles.paymentValue}>•••• 1234</Text>
            </View>
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Transaction ID</Text>
              <Text style={styles.paymentValue}>TXN{Date.now().toString().slice(-8)}</Text>
            </View>
          </View>
        </Card>

        {/* Quick Actions */}
        <Card variant="elevated" padding="lg" style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton} onPress={handleDownloadTickets}>
              <Ionicons name="download" size={24} color={Colors.primary[600]} />
              <Text style={styles.actionButtonText}>Download Tickets</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={handleAddToCalendar}>
              <Ionicons name="calendar-outline" size={24} color={Colors.primary[600]} />
              <Text style={styles.actionButtonText}>Add to Calendar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={handleShareBooking}>
              <Ionicons name="share-outline" size={24} color={Colors.primary[600]} />
              <Text style={styles.actionButtonText}>Share Booking</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Important Information */}
        <Card variant="outlined" padding="md" style={styles.detailsCard}>
          <View style={styles.infoContainer}>
            <Ionicons name="information-circle" size={20} color={Colors.accent.blue} />
            <View style={styles.infoText}>
              <Text style={styles.infoTitle}>Important Information</Text>
              <Text style={styles.infoDescription}>
                • Please arrive at least 30 minutes before the event{'\n'}
                • Bring a valid ID for verification{'\n'}
                • Check your email for detailed instructions{'\n'}
                • Contact support if you need to make changes
              </Text>
            </View>
          </View>
        </Card>

        {/* Support */}
        <Card variant="outlined" padding="md" style={styles.detailsCard}>
          <View style={styles.supportContainer}>
            <Text style={styles.supportTitle}>Need Help?</Text>
            <Text style={styles.supportDescription}>
              Our customer support team is here to help you with any questions about your booking.
            </Text>
            <TouchableOpacity style={styles.supportButton}>
              <Ionicons name="chatbubbles" size={16} color={Colors.primary[600]} />
              <Text style={styles.supportButtonText}>Contact Support</Text>
            </TouchableOpacity>
          </View>
        </Card>
      </ScrollView>

      {/* Bottom Actions */}
      <SafeAreaView edges={['bottom']} style={styles.bottomContainer}>
        <View style={styles.bottomContent}>
          <Button
            title="View My Tickets"
            onPress={handleDownloadTickets}
            variant="outline"
            style={styles.viewTicketsButton}
          />
          <Button
            title="Back to Home"
            onPress={handleBackToHome}
            style={styles.homeButton}
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
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: Spacing.xl,
  },
  successHeader: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.md,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.accent.green,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  successTitle: {
    fontSize: Typography.fontSize['3xl'],
    fontFamily: Typography.fontFamily.bold,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
    textAlign: 'center',
    letterSpacing: Typography.letterSpacing.tight,
  },
  successMessage: {
    fontSize: Typography.fontSize.base,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: Typography.lineHeight.base,
  },
  detailsCard: {
    margin: Spacing.md,
    marginBottom: 0,
    marginTop: Spacing.md,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontFamily: Typography.fontFamily.semibold,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  bookingIdContainer: {
    alignItems: 'flex-end',
  },
  bookingIdLabel: {
    fontSize: Typography.fontSize.xs,
    fontFamily: Typography.fontFamily.medium,
    color: Colors.text.secondary,
    fontWeight: Typography.fontWeight.medium,
  },
  bookingId: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.primary[600],
    fontWeight: Typography.fontWeight.bold,
    marginTop: Spacing.xs / 2,
  },
  bookingDetails: {
    gap: Spacing.lg,
  },
  eventTitle: {
    fontSize: Typography.fontSize.xl,
    fontFamily: Typography.fontFamily.bold,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  detailText: {
    flex: 1,
    gap: Spacing.xs / 2,
  },
  detailLabel: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.medium,
    color: Colors.text.secondary,
    fontWeight: Typography.fontWeight.medium,
  },
  detailValue: {
    fontSize: Typography.fontSize.base,
    fontFamily: Typography.fontFamily.semibold,
    color: Colors.text.primary,
    fontWeight: Typography.fontWeight.semibold,
  },
  detailSubValue: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.text.secondary,
  },
  paymentSummary: {
    gap: Spacing.md,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentLabel: {
    fontSize: Typography.fontSize.base,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.text.secondary,
  },
  paymentValue: {
    fontSize: Typography.fontSize.base,
    fontFamily: Typography.fontFamily.semibold,
    color: Colors.text.primary,
    fontWeight: Typography.fontWeight.semibold,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primary[50],
    borderWidth: 1,
    borderColor: Colors.primary[200],
    gap: Spacing.xs,
  },
  actionButtonText: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.semibold,
    color: Colors.primary[700],
    fontWeight: Typography.fontWeight.semibold,
    textAlign: 'center',
  },
  infoContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  infoText: {
    flex: 1,
    gap: Spacing.xs,
  },
  infoTitle: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.semibold,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  infoDescription: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.text.secondary,
    lineHeight: Typography.lineHeight.sm,
  },
  supportContainer: {
    gap: Spacing.sm,
  },
  supportTitle: {
    fontSize: Typography.fontSize.base,
    fontFamily: Typography.fontFamily.semibold,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  supportDescription: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.text.secondary,
    lineHeight: Typography.lineHeight.sm,
  },
  supportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  supportButtonText: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.semibold,
    color: Colors.primary[600],
    fontWeight: Typography.fontWeight.semibold,
  },
  bottomContainer: {
    backgroundColor: Colors.background.card,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
  },
  bottomContent: {
    flexDirection: 'row',
    gap: Spacing.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  viewTicketsButton: {
    flex: 1,
  },
  homeButton: {
    flex: 1,
  },
}); 