import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Colors } from '@/constants/colors';
import { BorderRadius, Spacing, Typography } from '@/constants/dimensions';
import { mockEvents } from '@/data/mock-events';
import { Event } from '@/types/ticket';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import {
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EventDetails() {
  const { eventId } = useLocalSearchParams<{ eventId: string }>();
  
  // In a real app, you'd fetch the event by ID
  const event: Event | undefined = mockEvents.find(e => e.id === eventId);

  if (!event) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Event not found</Text>
          <Button
            title="Go Back"
            onPress={() => router.back()}
            variant="outline"
          />
        </View>
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

  const formatTime = (timeString: string) => {
    return timeString;
  };

  const handleBookNow = () => {
    router.push({
      pathname: '/seat-selection',
      params: { eventId: event.id }
    });
  };

  const handleShare = () => {
    // Implement share functionality
    console.log('Share event');
  };

  const handleFavorite = () => {
    // Implement favorite functionality
    console.log('Add to favorites');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Hero Image with Back Button */}
      <View style={styles.heroContainer}>
        <Image source={{ uri: event.image }} style={styles.heroImage} />
        <View style={styles.heroOverlay} />
        
        <SafeAreaView edges={['top']} style={styles.heroContent}>
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color={Colors.neutral.white} />
            </TouchableOpacity>
            
            <View style={styles.rightActions}>
              <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
                <Ionicons name="share-outline" size={24} color={Colors.neutral.white} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={handleFavorite}>
                <Ionicons name="heart-outline" size={24} color={Colors.neutral.white} />
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.heroTextContainer}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>
                {event.category.toUpperCase()}
              </Text>
            </View>
            <Text style={styles.heroTitle}>{event.title}</Text>
            <Text style={styles.heroSubtitle}>{event.venue}</Text>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Event Info */}
        <Card variant="elevated" padding="lg" style={styles.infoCard}>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Ionicons name="calendar" size={20} color={Colors.primary[600]} />
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>Date</Text>
                <Text style={styles.infoValue}>{formatDate(event.date)}</Text>
              </View>
            </View>
            
            <View style={styles.infoItem}>
              <Ionicons name="time" size={20} color={Colors.primary[600]} />
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>Time</Text>
                <Text style={styles.infoValue}>{formatTime(event.time)}</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Ionicons name="location" size={20} color={Colors.primary[600]} />
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>Venue</Text>
                <Text style={styles.infoValue}>{event.venue}</Text>
                <Text style={styles.infoSubValue}>{event.location}</Text>
              </View>
            </View>
            
            <View style={styles.infoItem}>
              <Ionicons name="people" size={20} color={Colors.primary[600]} />
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>Availability</Text>
                <Text style={styles.infoValue}>{event.availableSeats} seats left</Text>
                <Text style={styles.infoSubValue}>of {event.totalSeats} total</Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About This Event</Text>
          <Card variant="default" padding="lg">
            <Text style={styles.description}>{event.description}</Text>
          </Card>
        </View>

        {/* Pricing */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ticket Pricing</Text>
          <Card variant="default" padding="lg">
            <View style={styles.pricingContainer}>
              <View style={styles.pricingItem}>
                <Text style={styles.pricingLabel}>Starting from</Text>
                <Text style={styles.pricingValue}>${event.price.min}</Text>
              </View>
              <View style={styles.pricingDivider} />
              <View style={styles.pricingItem}>
                <Text style={styles.pricingLabel}>Up to</Text>
                <Text style={styles.pricingValue}>${event.price.max}</Text>
              </View>
            </View>
            <Text style={styles.pricingNote}>
              Final price will be determined based on seat selection and ticket type
            </Text>
          </Card>
        </View>

        {/* Venue Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Venue Information</Text>
          <Card variant="default" padding="lg">
            <View style={styles.venueInfo}>
              <View style={styles.venueDetail}>
                <Ionicons name="business" size={20} color={Colors.text.secondary} />
                <Text style={styles.venueText}>{event.venue}</Text>
              </View>
              <View style={styles.venueDetail}>
                <Ionicons name="location" size={20} color={Colors.text.secondary} />
                <Text style={styles.venueText}>{event.location}</Text>
              </View>
              <View style={styles.venueDetail}>
                <Ionicons name="car" size={20} color={Colors.text.secondary} />
                <Text style={styles.venueText}>Parking available on-site</Text>
              </View>
            </View>
          </Card>
        </View>
      </ScrollView>

      {/* Fixed Bottom Action */}
      <SafeAreaView edges={['bottom']} style={styles.bottomContainer}>
        <View style={styles.bottomContent}>
          <View style={styles.priceContainer}>
            <Text style={styles.bottomPriceLabel}>From</Text>
            <Text style={styles.bottomPrice}>${event.price.min}</Text>
          </View>
          <Button
            title="Select Seats"
            onPress={handleBookNow}
            style={styles.bookButton}
            disabled={event.availableSeats === 0}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  heroContainer: {
    height: 300,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  heroContent: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    padding: Spacing.md,
  },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rightActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTextContainer: {
    gap: Spacing.sm,
  },
  categoryBadge: {
    backgroundColor: Colors.primary[600],
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
  },
  categoryText: {
    fontSize: Typography.fontSize.xs,
    fontFamily: Typography.fontFamily.bold,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.neutral.white,
  },
  heroTitle: {
    fontSize: Typography.fontSize['3xl'],
    fontFamily: Typography.fontFamily.bold,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.neutral.white,
    lineHeight: Typography.lineHeight['3xl'],
    letterSpacing: Typography.letterSpacing.tight,
  },
  heroSubtitle: {
    fontSize: Typography.fontSize.lg,
    fontFamily: Typography.fontFamily.medium,
    color: Colors.neutral.white,
    opacity: 0.9,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: Spacing.xl,
  },
  infoCard: {
    margin: Spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    gap: Spacing.sm,
  },
  infoText: {
    flex: 1,
  },
  infoLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    fontWeight: Typography.fontWeight.medium,
  },
  infoValue: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.primary,
    fontWeight: Typography.fontWeight.semibold,
    marginTop: Spacing.xs / 2,
  },
  infoSubValue: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
  },
  section: {
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontFamily: Typography.fontFamily.semibold,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  description: {
    fontSize: Typography.fontSize.base,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.text.primary,
    lineHeight: Typography.lineHeight.base,
  },
  pricingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  pricingItem: {
    flex: 1,
    alignItems: 'center',
  },
  pricingDivider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.border.light,
    marginHorizontal: Spacing.md,
  },
  pricingLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    fontWeight: Typography.fontWeight.medium,
  },
  pricingValue: {
    fontSize: Typography.fontSize['2xl'],
    color: Colors.primary[600],
    fontWeight: Typography.fontWeight.bold,
    marginTop: Spacing.xs,
  },
  pricingNote: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.tertiary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  venueInfo: {
    gap: Spacing.md,
  },
  venueDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  venueText: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.primary,
    flex: 1,
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
  priceContainer: {
    alignItems: 'flex-start',
  },
  bottomPriceLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    fontWeight: Typography.fontWeight.medium,
  },
  bottomPrice: {
    fontSize: Typography.fontSize['2xl'],
    color: Colors.primary[600],
    fontWeight: Typography.fontWeight.bold,
  },
  bookButton: {
    flex: 1,
    marginLeft: Spacing.lg,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  errorText: {
    fontSize: Typography.fontSize.lg,
    color: Colors.text.primary,
  },
}); 