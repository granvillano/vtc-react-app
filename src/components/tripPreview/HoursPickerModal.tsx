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

import { Button, Card } from '../common';
import { tripPreviewStyles as styles } from '../../screens/styles/tripPreviewStyles';

type Props = {
    visible: boolean;
    options: number[];
    selected: number;
    onSelect: (value: number) => void;
    onClose: () => void;
};

export const HoursPickerModal: React.FC<Props> = ({
    visible,
    options,
    selected,
    onSelect,
    onClose,
}) => {
    const ITEM_HEIGHT = 42;
    const listRef = useRef<FlatList<number>>(null);

    const selectedIndex = useMemo(
        () => options.findIndex((o) => o === selected),
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
        if (option !== undefined && option !== selected) {
            onSelect(option);
        }
    };

    const renderItem = ({ item }: { item: number }) => {
        const isSelected = item === selected;
        return (
            <TouchableOpacity
                style={[styles.timeOption, isSelected && styles.timeOptionSelected]}
                onPress={() => onSelect(item)}
                activeOpacity={0.7}
            >
                <Text style={styles.timeOptionText}>
                    {item} {item === 1 ? 'hora' : 'horas'}
                </Text>
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
                    <Text style={styles.sectionTitle}>Selecciona horas</Text>
                    <Text style={styles.sheetSubtitle}>Actual: {selected}</Text>

                    <View style={styles.pickerContainer}>
                        <FlatList
                            ref={listRef}
                            data={options}
                            keyExtractor={(item) => item.toString()}
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
