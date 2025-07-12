import { EventCard } from "@/components/molecules/event-card";
import { FilterModal } from "@/components/molecules/filter-modal";
import { SearchHeader } from "@/components/molecules/search-header";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Colors } from "@/constants/colors";
import { Spacing, Typography } from "@/constants/dimensions";
import { mockEvents } from "@/data/mock-events";
import { Event, EventCategory, SearchFilters } from "@/types/ticket";
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useMemo, useState } from "react";
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | 'all'>('all');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({});

  const categories: { id: EventCategory | 'all'; label: string; icon: string }[] = [
    { id: 'all', label: 'All', icon: 'grid-outline' },
    { id: 'concert', label: 'Concerts', icon: 'musical-notes-outline' },
    { id: 'sports', label: 'Sports', icon: 'football-outline' },
    { id: 'theater', label: 'Theater', icon: 'library-outline' },
    { id: 'comedy', label: 'Comedy', icon: 'happy-outline' },
    { id: 'conference', label: 'Conference', icon: 'business-outline' },
    { id: 'festival', label: 'Festival', icon: 'flower-outline' },
  ];

  const filteredEvents = useMemo(() => {
    return mockEvents.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           event.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           event.location.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
      
      // Apply additional filters
      const matchesFilterCategory = !filters.category || event.category === filters.category;
      const matchesPrice = !filters.priceRange || 
                          (event.price.min >= filters.priceRange.min && event.price.max <= filters.priceRange.max);
      const matchesLocation = !filters.location || event.location === filters.location;
      
      return matchesSearch && matchesCategory && matchesFilterCategory && matchesPrice && matchesLocation;
    });
  }, [searchQuery, selectedCategory, filters]);

  const handleEventPress = (event: Event) => {
    router.push({
      pathname: '/event-details',
      params: { eventId: event.id }
    });
  };

  const handleFilterPress = () => {
    setShowFilterModal(true);
  };

  const handleApplyFilters = (newFilters: SearchFilters) => {
    setFilters(newFilters);
    // If a category filter is applied, sync it with the category buttons
    if (newFilters.category) {
      setSelectedCategory(newFilters.category);
    }
  };

  const handleCategoryPress = (categoryId: EventCategory | 'all') => {
    setSelectedCategory(categoryId);
  };

	return (
		<SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background.primary} />
			<SafeAreaView edges={["top"]} style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.greeting}>Hello! 👋</Text>
              <Text style={styles.headerTitle}>Find Your Next Experience</Text>
            </View>
            <View style={styles.headerIcons}>
              <Button
                title=""
                onPress={() => Alert.alert("Notifications", "No new notifications")}
                variant="ghost"
                icon={<Ionicons name="notifications-outline" size={24} color={Colors.text.secondary} />}
              />
            </View>
          </View>
        </View>

        {/* Search */}
        <SearchHeader
          onSearch={setSearchQuery}
          onFilterPress={handleFilterPress}
          placeholder="Search events, venues, artists..."
        />

        <ScrollView 
          style={styles.content} 
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Categories */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesContainer}
            >
              {categories.map((category) => (
                <Button
                  key={category.id}
                  title={category.label}
                  onPress={() => handleCategoryPress(category.id)}
                  variant={selectedCategory === category.id ? "primary" : "outline"}
                  size="sm"
                  icon={
                    <Ionicons 
                      name={category.icon as any} 
                      size={16} 
                      color={selectedCategory === category.id ? Colors.neutral.white : Colors.primary[600]} 
                    />
                  }
                  style={styles.categoryButton}
                />
              ))}
            </ScrollView>
          </View>

          {/* Stats */}
          <View style={styles.section}>
            <View style={styles.statsContainer}>
              <Card variant="elevated" padding="md" style={styles.statCard}>
                <View style={styles.statItem}>
                  <Ionicons name="ticket-outline" size={24} color={Colors.primary[600]} />
                  <Text style={styles.statNumber}>{filteredEvents.length}</Text>
                  <Text style={styles.statLabel}>Events Available</Text>
                </View>
              </Card>
              <Card variant="elevated" padding="md" style={styles.statCard}>
                <View style={styles.statItem}>
                  <Ionicons name="location-outline" size={24} color={Colors.accent.green} />
                  <Text style={styles.statNumber}>12</Text>
                  <Text style={styles.statLabel}>Cities</Text>
                </View>
              </Card>
              <Card variant="elevated" padding="md" style={styles.statCard}>
                <View style={styles.statItem}>
                  <Ionicons name="star-outline" size={24} color={Colors.accent.yellow} />
                  <Text style={styles.statNumber}>4.8</Text>
                  <Text style={styles.statLabel}>Rating</Text>
                </View>
              </Card>
            </View>
          </View>

          {/* Events List */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {selectedCategory === 'all' ? 'All Events' : `${categories.find(c => c.id === selectedCategory)?.label} Events`}
              </Text>
              <Text style={styles.resultCount}>
                {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'}
              </Text>
            </View>
            
            {filteredEvents.length > 0 ? (
              <View style={styles.eventsContainer}>
                {filteredEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onPress={handleEventPress}
                  />
                ))}
              </View>
            ) : (
              <Card variant="outlined" padding="xl" style={styles.emptyState}>
                <View style={styles.emptyStateContent}>
                  <Ionicons name="search-outline" size={48} color={Colors.text.tertiary} />
                  <Text style={styles.emptyStateTitle}>No events found</Text>
                  <Text style={styles.emptyStateMessage}>
                    {searchQuery ? 
                      `No events match "${searchQuery}". Try different keywords or filters.` :
                      `No events available in the ${selectedCategory} category.`
                    }
                  </Text>
                  <Button
                    title="Clear Filters"
                    onPress={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                    }}
                    variant="outline"
                    style={styles.clearFiltersButton}
                  />
                </View>
              </Card>
            )}
          </View>

          {/* Footer spacing */}
          <View style={styles.footer} />
        </ScrollView>

        {/* Filter Modal */}
        <FilterModal
          visible={showFilterModal}
          onClose={() => setShowFilterModal(false)}
          onApplyFilters={handleApplyFilters}
          currentFilters={filters}
        />
			</SafeAreaView>
		</SafeAreaProvider>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
    backgroundColor: Colors.background.primary,
  },
  header: {
    backgroundColor: Colors.background.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: Typography.fontSize.base,
    fontFamily: Typography.fontFamily.medium,
    color: Colors.text.secondary,
    fontWeight: Typography.fontWeight.medium,
  },
  headerTitle: {
    fontSize: Typography.fontSize['2xl'],
    fontFamily: Typography.fontFamily.bold,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    marginTop: Spacing.xs / 2,
    letterSpacing: Typography.letterSpacing.tight,
  },
  headerIcons: {
    flexDirection: 'row',
    paddingLeft: Spacing.xxl,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: Spacing.xl,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontFamily: Typography.fontFamily.semibold,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  resultCount: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.medium,
    color: Colors.text.secondary,
    fontWeight: Typography.fontWeight.medium,
  },
  categoriesContainer: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  categoryButton: {
    marginRight: Spacing.sm,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  statCard: {
    flex: 1,
  },
  statItem: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  statNumber: {
    fontSize: Typography.fontSize.xl,
    fontFamily: Typography.fontFamily.bold,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
  },
  statLabel: {
    fontSize: Typography.fontSize.xs,
    fontFamily: Typography.fontFamily.medium,
    color: Colors.text.secondary,
    fontWeight: Typography.fontWeight.medium,
    textAlign: 'center',
  },
  eventsContainer: {
    paddingHorizontal: Spacing.md,
  },
  emptyState: {
    marginHorizontal: Spacing.md,
  },
  emptyStateContent: {
    alignItems: 'center',
    gap: Spacing.md,
  },
  emptyStateTitle: {
    fontSize: Typography.fontSize.lg,
    fontFamily: Typography.fontFamily.semibold,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  emptyStateMessage: {
    fontSize: Typography.fontSize.base,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: Typography.lineHeight.base,
  },
  clearFiltersButton: {
    marginTop: Spacing.sm,
  },
  footer: {
    height: Spacing.xl,
  },
});
