import React, { useEffect, useMemo, useRef } from 'react';
import {
    Text,
    View,
    ScrollView,
    NativeScrollEvent,
    NativeSyntheticEvent,
    Animated,
    Easing,
} from 'react-native';
import { tripPreviewStyles as styles } from '../../screens/styles/tripPreviewStyles';

// Generic wheel picker for any type of value
export type WheelPickerOption<T> = {
    value: T;
    label: string;
};

type WheelPickerProps<T> = {
    options: WheelPickerOption<T>[];
    selected: T;
    onSelect: (value: T) => void;
    label: string;
    helperText?: string;
};

export function WheelPicker<T>({
    options,
    selected,
    onSelect,
    label,
    helperText,
    onInteractionStart,
    onInteractionEnd,
}: WheelPickerProps<T> & { onInteractionStart?: () => void; onInteractionEnd?: () => void }) {
    if (!options || !Array.isArray(options) || options.length === 0) {
        return (
            <View style={styles.serviceCard}>
                <Text style={styles.sectionTitle}>{label}</Text>
                <Text style={styles.helperText}>No hay opciones disponibles para seleccionar.</Text>
            </View>
        );
    }
    const ITEM_HEIGHT = 40;
    const CONTAINER_HEIGHT = 120;
    const EDGE_SPACER = (CONTAINER_HEIGHT - ITEM_HEIGHT) / 2;
    const CENTER_INDEX_OFFSET = Math.floor(CONTAINER_HEIGHT / ITEM_HEIGHT / 2);
    const scrollRef = useRef<ScrollView>(null);

    const snapOffsets = useMemo(
        () => options.map((_, index) => (index - CENTER_INDEX_OFFSET) * ITEM_HEIGHT + EDGE_SPACER),
        [options, EDGE_SPACER, CENTER_INDEX_OFFSET]
    );

    const selectedIndex = useMemo(
        () => options.findIndex((o) => o.value === selected),
        [options, selected]
    );

    useEffect(() => {
        if (selectedIndex >= 0) {
            scrollRef.current?.scrollTo({
                y: (selectedIndex - CENTER_INDEX_OFFSET) * ITEM_HEIGHT + EDGE_SPACER,
                animated: false,
            });
        }
    }, [selectedIndex, CENTER_INDEX_OFFSET, EDGE_SPACER]);

    const handleMomentumEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        const maxOffset = Math.max(0, EDGE_SPACER * 2 + (options.length - 1) * ITEM_HEIGHT);
        const clampedOffset = Math.min(maxOffset, Math.max(0, offsetY));
        const index = Math.round((clampedOffset - EDGE_SPACER) / ITEM_HEIGHT) + CENTER_INDEX_OFFSET;
        const bounded = Math.min(options.length - 1, Math.max(0, index));
        const option = options[bounded];
        scrollRef.current?.scrollTo({
            y: (bounded - CENTER_INDEX_OFFSET) * ITEM_HEIGHT + EDGE_SPACER,
            animated: true,
        });
        if (option && option.value !== selected) {
            onSelect(option.value);
        }
    };

    // Animated opacity for smooth transitions
    const animatedValues = useRef(options.map(() => new Animated.Value(0))).current;

    useEffect(() => {
        options.forEach((opt, idx) => {
            const isSelected = opt.value === selected;
            Animated.timing(animatedValues[idx], {
                toValue: isSelected ? 1 : 0.25,
                duration: 400,
                easing: Easing.inOut(Easing.cubic),
                useNativeDriver: false,
            }).start();
        });
    }, [selected, options, animatedValues]);

    const renderItem = ({ item, idx }: { item: WheelPickerOption<T>; idx: number }) => {
        const isSelected = item.value === selected;
        return (
            <Animated.View
                style={[styles.timeOption, { opacity: animatedValues[idx] }]}
                pointerEvents="none"
            >
                <Text style={[styles.timeOptionText, isSelected && styles.timeOptionTextSelected]}>
                    {item.label}
                </Text>
            </Animated.View>
        );
    };

    return (
        <View style={styles.serviceCard}>
            <Text style={styles.sectionTitle}>{label}</Text>
            {helperText && <Text style={styles.helperText}>{helperText}</Text>}
            <View style={styles.inlinePickerContainer}>
                <ScrollView
                    ref={scrollRef}
                    showsVerticalScrollIndicator={false}
                    snapToInterval={ITEM_HEIGHT}
                    snapToOffsets={snapOffsets}
                    snapToAlignment="center"
                    decelerationRate="normal"
                    disableIntervalMomentum
                    contentInsetAdjustmentBehavior="never"
                    contentContainerStyle={undefined}
                    scrollEventThrottle={16}
                    nestedScrollEnabled={true}
                    bounces={false}
                    alwaysBounceVertical={false}
                    scrollsToTop={false}
                    overScrollMode="never"
                    onStartShouldSetResponder={() => true}
                    onMoveShouldSetResponder={() => true}
                    onStartShouldSetResponderCapture={() => true}
                    onMoveShouldSetResponderCapture={() => true}
                    onResponderTerminationRequest={() => false}
                    scrollEnabled
                    onScrollBeginDrag={() => {
                        onInteractionStart && onInteractionStart();
                    }}
                    onTouchStart={() => {
                        onInteractionStart && onInteractionStart();
                    }}
                    onTouchEnd={() => {
                        onInteractionEnd && onInteractionEnd();
                    }}
                    onTouchCancel={() => {
                        onInteractionEnd && onInteractionEnd();
                    }}
                    onScrollEndDrag={handleMomentumEnd}
                    onMomentumScrollEnd={handleMomentumEnd}
                    onScroll={(event) => {
                        const offsetY = event.nativeEvent.contentOffset.y;
                        const maxOffset = Math.max(
                            0,
                            EDGE_SPACER * 2 + (options.length - 1) * ITEM_HEIGHT
                        );
                        const clampedOffset = Math.min(maxOffset, Math.max(0, offsetY));
                        const index =
                            Math.round((clampedOffset - EDGE_SPACER) / ITEM_HEIGHT) +
                            CENTER_INDEX_OFFSET;
                        const bounded = Math.min(options.length - 1, Math.max(0, index));
                        const option = options[bounded];
                        if (option && option.value !== selected) {
                            onSelect(option.value);
                        }
                    }}
                >
                    <View
                        style={{ height: EDGE_SPACER }}
                        pointerEvents="none"
                    />
                    {options.map((item, idx) => (
                        <React.Fragment key={String(item.value)}>
                            {renderItem({ item, idx })}
                        </React.Fragment>
                    ))}
                    <View
                        style={{ height: EDGE_SPACER }}
                        pointerEvents="none"
                    />
                </ScrollView>
                <View
                    style={styles.pickerHighlight}
                    pointerEvents="none"
                />
            </View>
        </View>
    );
}
