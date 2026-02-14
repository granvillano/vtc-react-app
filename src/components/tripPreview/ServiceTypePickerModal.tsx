import React, { useEffect, useMemo, useRef } from 'react';
import {
    Modal,
    Text,
    TouchableOpacity,
    View,
    FlatList,
    NativeScrollEvent,
    NativeSyntheticEvent,
} from 'react-native';

import { Card, Button } from '../common';
import { tripPreviewStyles as styles } from '../../screens/styles/tripPreviewStyles';
import { ServiceType } from '../../services/tripService';

type Option = { value: ServiceType; label: string };

type Props = {
    visible: boolean;
    options: Option[];
    selected: ServiceType;
    onSelect: (value: ServiceType) => void;
    onClose: () => void;
};

export const ServiceTypePickerModal: React.FC<Props> = ({
    visible,
    options,
    selected,
    onSelect,
    onClose,
}) => {
    const ITEM_HEIGHT = 42;
    const listRef = useRef<FlatList<Option>>(null);

    const selectedIndex = useMemo(
        () => options.findIndex((o) => o.value === selected),
        [options, selected]
    );

    useEffect(() => {
        if (visible && selectedIndex >= 0) {
            listRef.current?.scrollToIndex({
                index: selectedIndex,
                animated: false,
                viewPosition: 0.5,
            });
        }
    }, [visible, selectedIndex]);

    const handleMomentumEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        const index = Math.round(offsetY / ITEM_HEIGHT);
        const bounded = Math.min(options.length - 1, Math.max(0, index));
        const option = options[bounded];
        if (option && option.value !== selected) {
            onSelect(option.value);
        }
    };

    const renderItem = ({ item }: { item: Option }) => {
        const isSelected = item.value === selected;
        return (
            <TouchableOpacity
                style={[styles.timeOption, isSelected && styles.timeOptionSelected]}
                onPress={() => onSelect(item.value)}
                activeOpacity={0.7}
            >
                <Text style={styles.timeOptionText}>{item.label}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.timePickerOverlay}>
                <Card
                    variant="default"
                    padding="lg"
                    style={styles.timePickerModal}
                >
                    <View style={styles.sheetHandle} />
                    <Text style={styles.sectionTitle}>Selecciona el servicio</Text>
                    <Text style={styles.sheetSubtitle}>
                        Actual: {options.find((o) => o.value === selected)?.label || '—'}
                    </Text>

                    <View style={styles.pickerContainer}>
                        <FlatList
                            ref={listRef}
                            data={options}
                            keyExtractor={(item) => item.value}
                            renderItem={renderItem}
                            showsVerticalScrollIndicator={false}
                            snapToInterval={ITEM_HEIGHT}
                            snapToAlignment="center"
                            decelerationRate="fast"
                            onMomentumScrollEnd={handleMomentumEnd}
                            contentContainerStyle={{ paddingVertical: ITEM_HEIGHT }}
                            getItemLayout={(_data, index) => ({
                                length: ITEM_HEIGHT,
                                offset: ITEM_HEIGHT * index,
                                index,
                            })}
                        />
                        <View
                            style={styles.pickerHighlight}
                            pointerEvents="none"
                        />
                    </View>

                    <Button
                        title="Cerrar"
                        variant="secondary"
                        onPress={onClose}
                        style={styles.timePickerClose}
                    />
                </Card>
            </View>
        </Modal>
    );
};
